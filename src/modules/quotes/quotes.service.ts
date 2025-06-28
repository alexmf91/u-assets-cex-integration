import { Injectable, Logger } from '@nestjs/common'
import { REDIS_QUOTE_STORAGE_TIME } from 'src/common/constants'
import { handleServiceError, validateDto } from 'src/common/utils'
import { v4 as uuidv4 } from 'uuid'
import { AssetsService } from '../assets/assets.service'
import { DatabaseService } from '../database'
import { RedisService } from '../redis'
import { UsersService } from '../users'
import { CachedQuoteDto, CreateQuoteDto, QuoteDto } from './dto'
import {
	QuoteCommitFailedException,
	QuoteCreationFailedException,
	QuoteExpiredException,
	QuoteNotFoundException
} from './quotes.exceptions'

const makeQuoteCacheKey = (quoteId: string) => `quote:${quoteId}`

@Injectable()
export class QuotesService {
	private readonly logger = new Logger(QuotesService.name, { timestamp: true })

	constructor(
		private readonly databaseService: DatabaseService,
		private readonly redisService: RedisService,
		private readonly assetsService: AssetsService,
		private readonly usersService: UsersService
	) {}

	private calculatePrice(_asset: string, _amount: number, side: 'BUY' | 'SELL'): number {
		// Simple Mock price calculation logic
		// In a real implementation, this would fetch from external price feeds
		const basePrice = 1000 // Mock base price
		const spread = 0.001 // 0.1% spread

		if (side === 'BUY') {
			return basePrice * (1 + spread)
		} else {
			return basePrice * (1 - spread)
		}
	}

	async genQuote(dto: CreateQuoteDto): Promise<CachedQuoteDto> {
		this.logger.log(
			`Creating quote for asset: ${dto.asset}, user: ${dto.userId}, amount: ${dto.amount}, side: ${dto.side}`
		)
		try {
			// Verify asset exists and get asset ID by using assets service, if does not exist it will throw an error
			const asset = await this.assetsService.getAssetBySymbol(dto.asset)

			// Verify user exists, if doesn't exist will throw an error
			const user = await this.usersService.getUserById(dto.userId)

			const price = this.calculatePrice(dto.asset, dto.amount, dto.side)

			const quoteId = uuidv4()

			const redisQuote = CachedQuoteDto.make({
				id: quoteId,
				asset: asset.symbol,
				userId: user.id,
				amount: String(dto.amount),
				price: String(price),
				side: dto.side,
				createdAt: new Date().toISOString()
			})

			// Store in Redis with expiration (5 minutes)
			await this.redisService.set(
				makeQuoteCacheKey(quoteId),
				JSON.stringify(redisQuote),
				REDIS_QUOTE_STORAGE_TIME
			)

			return redisQuote
		} catch (error) {
			handleServiceError(
				this.logger,
				'QuotesService.createQuote',
				error,
				(cause) =>
					new QuoteCreationFailedException(
						`Failed to generate quote for asset: ${dto.asset}, user: ${dto.userId}`,
						{ cause }
					)
			)
		}
	}

	async createQuote(dto: CachedQuoteDto): Promise<QuoteDto> {
		this.logger.log(
			`Creating quote for asset: ${dto.asset}, user: ${dto.userId}, amount: ${dto.amount}, side: ${dto.side}`
		)
		try {
			// Verify asset exists and get asset ID by using assets service, if does not exist it will throw an error
			const asset = await this.assetsService.getAssetBySymbol(dto.asset)

			// Verify user exists, if doesn't exist will throw an error
			const user = await this.usersService.getUserById(dto.userId)

			const price = this.calculatePrice(dto.asset, dto.amount, dto.side)

			const quote = await this.databaseService.quote.create({
				data: {
					assetId: asset.id,
					userId: user.id,
					amount: dto.amount,
					price: price,
					side: dto.side,
					createdAt: dto.createdAt
				},
				include: {
					asset: true
				}
			})

			return QuoteDto.fromEntity(quote)
		} catch (error) {
			handleServiceError(
				this.logger,
				'QuotesService.createQuote',
				error,
				(cause) =>
					new QuoteCreationFailedException(
						`Failed to create quote for asset: ${dto.asset}, user: ${dto.userId}`,
						{ cause }
					)
			)
		}
	}

	async commitQuote(id: string): Promise<QuoteDto> {
		this.logger.log(`Committing quote with id: ${id}`)
		try {
			// Check if quote exists in Redis (not expired)
			const quoteKey = makeQuoteCacheKey(id)
			const cachedQuote = await this.redisService.get(quoteKey)

			if (!cachedQuote) {
				this.logger.warn(`Quote expired or not found in Redis: ${id}`)
				throw new QuoteExpiredException()
			}

			console.log(JSON.parse(cachedQuote))

			const parsedQuote = validateDto(CachedQuoteDto, JSON.parse(cachedQuote))

			const commitedQuote = await this.createQuote(parsedQuote)

			// Remove from Redis cache
			await this.redisService.del(quoteKey)

			return commitedQuote
		} catch (error) {
			handleServiceError(
				this.logger,
				'QuotesService.commitQuote',
				error,
				(cause) =>
					new QuoteCommitFailedException(`Failed to commit quote with id ${id}`, {
						cause
					})
			)
		}
	}

	async getCommitedQuoteById(id: string): Promise<QuoteDto> {
		this.logger.log(`Retrieving quote by id: ${id}`)

		const quote = await this.databaseService.quote.findUnique({
			where: { id },
			include: {
				asset: true
			}
		})

		if (!quote) {
			this.logger.warn(`Quote not found: ${id}`)
			throw new QuoteNotFoundException()
		}

		return QuoteDto.fromEntity(quote)
	}

	async listQuotes(): Promise<QuoteDto[]> {
		this.logger.log('Listing all quotes')
		const quotes = await this.databaseService.quote.findMany({
			include: {
				asset: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		})

		return QuoteDto.fromEntities(quotes)
	}
}
