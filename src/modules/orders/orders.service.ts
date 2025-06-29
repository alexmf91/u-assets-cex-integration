import { Injectable, Logger } from '@nestjs/common'
import { handleServiceError } from '../../common/utils'
import { AssetsService } from '../assets/assets.service'
import { DatabaseService } from '../database'
import { QuotesService } from '../quotes'
import { UsersService } from '../users'
import { CreateOrderDto, OrderDto } from './dto'
import {
	InvalidOrderDataException,
	OrderCreationFailedException,
	OrderNotFoundException
} from './orders.exceptions'

@Injectable()
export class OrdersService {
	private readonly logger = new Logger(OrdersService.name, { timestamp: true })

	constructor(
		private readonly databaseService: DatabaseService,
		private readonly assetsService: AssetsService,
		private readonly usersService: UsersService,
		private readonly quotesService: QuotesService
	) {}

	async createOrder(dto: CreateOrderDto): Promise<OrderDto> {
		this.logger.log(
			`Creating order for quote: ${dto.quoteId}, asset: ${dto.asset}, user: ${dto.userId}, amount: ${dto.amount}`
		)

		try {
			// Verify asset exists and get asset ID by using assets service, if does not exist it will throw an error
			const asset = await this.assetsService.getAssetBySymbol(dto.asset)

			// Verify user exists
			const user = await this.usersService.getUserById(dto.userId)

			// Verify commited quote exists
			const quote = await this.quotesService.getCommitedQuoteById(dto.quoteId)

			if (quote.asset !== asset.symbol) {
				this.logger.error(
					`Invalid Quote provided, quote asset does not match asset symbol. Quote asset:${quote.asset}, Asset symbol: ${asset.symbol}`
				)
				throw new InvalidOrderDataException('Quote asset does not match asset symbol')
			}

			const order = await this.databaseService.order.create({
				data: {
					quoteId: quote.id,
					assetId: asset.id,
					userId: user.id,
					amount: dto.amount,
					price: dto.price,
					side: dto.side,
					status: 'PENDING'
				},
				include: {
					asset: true,
					quote: true
				}
			})

			return OrderDto.fromEntity(order)
		} catch (error) {
			handleServiceError(
				this.logger,
				'OrdersService.createOrder',
				error,
				(cause) => new OrderCreationFailedException('Failed to create order', { cause })
			)
		}
	}

	async getOrderById(id: string): Promise<OrderDto> {
		this.logger.log(`Retrieving order by id: ${id}`)

		const order = await this.databaseService.order.findUnique({
			where: { id },
			include: {
				asset: true,
				quote: true
			}
		})

		if (!order) {
			this.logger.warn(`Order not found: ${id}`)
			throw new OrderNotFoundException()
		}

		return OrderDto.fromEntity(order)
	}

	async listOrders(): Promise<OrderDto[]> {
		this.logger.log('Listing all orders')

		const orders = await this.databaseService.order.findMany({
			include: {
				asset: true,
				quote: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		})

		return OrderDto.fromEntities(orders)
	}
}
