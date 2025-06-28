import { ApiProperty } from '@nestjs/swagger'
import { plainToInstance } from 'class-transformer'
import { IsDateString, IsEnum, IsNumber, IsString } from 'class-validator'

export class CachedQuoteDto {
	@ApiProperty({ description: 'Quote ID', example: 'quote-123' })
	@IsString()
	id: string

	@ApiProperty({ description: 'uAsset symbol', example: 'uETH' })
	@IsString()
	asset: string

	@ApiProperty({ description: 'Trade amount', example: 1.5 })
	@IsNumber()
	amount: number

	@ApiProperty({ description: 'Trade side', example: 'BUY' })
	@IsEnum(['BUY', 'SELL'])
	side: 'BUY' | 'SELL'

	@ApiProperty({ description: 'Quote price', example: 2500 })
	@IsNumber()
	price: number

	@ApiProperty({ description: 'User ID', example: 'user-abc' })
	@IsString()
	userId: string

	@ApiProperty({ description: 'Quote creation timestamp', example: '2024-03-05T12:00:00Z' })
	@IsDateString()
	createdAt: string

	static make(quote: {
		id: string
		asset: string
		amount: string
		side: 'BUY' | 'SELL'
		price: string
		userId: string
		createdAt: string
	}): CachedQuoteDto {
		return plainToInstance(CachedQuoteDto, {
			id: quote.id,
			asset: quote.asset,
			amount: Number(quote.amount),
			side: quote.side,
			price: Number(quote.price),
			userId: quote.userId,
			createdAt: quote.createdAt
		})
	}
}
