import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator'

export class CreateOrderDto {
	@ApiProperty({
		description: 'Quote ID this order is based on',
		example: 'quote-123',
		required: false
	})
	@IsString()
	@IsOptional()
	quoteId: string

	@ApiProperty({ description: 'uAsset symbol', example: 'uETH' })
	@IsString()
	@IsNotEmpty()
	asset: string

	@ApiProperty({ description: 'Order amount', example: 1.5 })
	@IsNumber()
	@IsPositive()
	amount: number

	@ApiProperty({ description: 'Order price', example: 2500 })
	@IsNumber()
	@IsPositive()
	price: number

	@ApiProperty({ description: 'Trade side', enum: ['BUY', 'SELL'], example: 'BUY' })
	@IsEnum(['BUY', 'SELL'])
	side: 'BUY' | 'SELL'

	@ApiProperty({ description: 'User ID placing the order', example: 'user-abc' })
	@IsString()
	@IsNotEmpty()
	userId: string
}
