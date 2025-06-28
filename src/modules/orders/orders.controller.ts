import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateOrderDto, OrderDto } from './dto'
import { OrdersService } from './orders.service'

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
	private readonly logger = new Logger(OrdersController.name, { timestamp: true })

	constructor(private readonly ordersService: OrdersService) {}

	@Post()
	@ApiOperation({ summary: 'Create a new order from a quote' })
	@ApiResponse({ status: 201, description: 'Order created', type: OrderDto })
	async createOrder(@Body() dto: CreateOrderDto): Promise<OrderDto> {
		this.logger.log(`Received request to create order for quote: ${dto.quoteId}`)
		return this.ordersService.createOrder(dto)
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get order by ID' })
	@ApiParam({ name: 'id', required: true, description: 'Order ID', type: 'string' })
	@ApiResponse({ status: 200, description: 'Order details', type: OrderDto })
	async getOrder(@Param('id') id: string): Promise<OrderDto> {
		this.logger.log(`Received request to get order by id: ${id}`)
		return this.ordersService.getOrderById(id)
	}

	@Get()
	@ApiOperation({ summary: 'List all orders' })
	@ApiResponse({ status: 200, description: 'List of orders', type: [OrderDto] })
	async listOrders(): Promise<OrderDto[]> {
		this.logger.log('Received request to list all orders')
		return this.ordersService.listOrders()
	}
}
