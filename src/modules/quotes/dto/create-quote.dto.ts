import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator'

export class CreateQuoteDto {
	@ApiProperty({ description: 'uAsset symbol', example: 'uETH' })
	@IsString()
	@IsNotEmpty()
	asset: string

	@ApiProperty({ description: 'Trade amount', example: 1.5 })
	@IsNumber()
	@IsPositive()
	amount: number

	@ApiProperty({ description: 'Trade side', enum: ['BUY', 'SELL'], example: 'BUY' })
	@IsEnum(['BUY', 'SELL'])
	side: 'BUY' | 'SELL'

	@ApiProperty({ description: 'User ID requesting the quote', example: 'user-abc' })
	@IsString()
	@IsNotEmpty()
	userId: string
}
