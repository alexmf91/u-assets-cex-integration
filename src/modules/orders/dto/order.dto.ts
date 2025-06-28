import { ApiProperty } from '@nestjs/swagger'
import { Order } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { IsDateString, IsEnum, IsNumber, IsString } from 'class-validator'

export class OrderDto {
	@ApiProperty({ description: 'Order ID', example: 'order-123' })
	@IsString()
	id: string

	@ApiProperty({ description: 'Quote ID ', example: 'quote-123' })
	@IsString()
	quoteId: string

	@ApiProperty({ description: 'uAsset symbol', example: 'uETH' })
	@IsString()
	asset: string

	@ApiProperty({ description: 'Order amount', example: 1.5 })
	@IsNumber()
	amount: number

	@ApiProperty({ description: 'Order price', example: 2500 })
	@IsNumber()
	price: number

	@ApiProperty({ description: 'User ID', example: 'user-abc' })
	@IsString()
	userId: string

	@ApiProperty({ description: 'Order status', example: 'PENDING' })
	@IsEnum(['PENDING', 'FILLED', 'CANCELLED', 'FAILED'])
	status: 'PENDING' | 'FILLED' | 'CANCELLED' | 'FAILED'

	@ApiProperty({ description: 'Order creation timestamp', example: '2024-03-05T12:00:00Z' })
	@IsDateString()
	createdAt: string

	@ApiProperty({ description: 'Order last update timestamp', example: '2024-03-05T12:00:00Z' })
	@IsDateString()
	updatedAt: string

	static fromEntity(order: Order & { asset?: { symbol: string } }): OrderDto {
		return plainToInstance(OrderDto, {
			id: order.id,
			quoteId: order.quoteId,
			asset: order.asset?.symbol || 'unknown',
			amount: Number(order.amount),
			price: Number(order.price),
			userId: order.userId,
			status: order.status,
			createdAt: order.createdAt.toISOString(),
			updatedAt: order.updatedAt.toISOString()
		})
	}

	static fromEntities(orders: (Order & { asset?: { symbol: string } })[]): OrderDto[] {
		return orders.map((order) => this.fromEntity(order))
	}
}
