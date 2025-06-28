import { ApiProperty } from '@nestjs/swagger'
import { Quote } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { IsDateString, IsEnum, IsNumber, IsString } from 'class-validator'

export class QuoteDto {
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

	@ApiProperty({ description: 'Quote last update timestamp', example: '2024-03-05T12:00:00Z' })
	@IsDateString()
	commitedAt: string

	static fromEntity(quote: Quote & { asset?: { symbol: string } }): QuoteDto {
		return plainToInstance(QuoteDto, {
			id: quote.id,
			asset: quote.asset?.symbol || 'unknown',
			amount: Number(quote.amount),
			side: quote.side,
			price: Number(quote.price),
			userId: quote.userId,
			createdAt: quote.createdAt.toISOString(),
			commitedAt: quote.commitedAt.toISOString()
		})
	}

	static fromEntities(quotes: (Quote & { asset?: { symbol: string } })[]): QuoteDto[] {
		return quotes.map((quote) => this.fromEntity(quote))
	}
}
