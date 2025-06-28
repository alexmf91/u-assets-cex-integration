import { HttpException, HttpStatus } from '@nestjs/common'

export class OrderNotFoundException extends HttpException {
	constructor(message?: string, options?: { cause?: unknown }) {
		super(
			{
				statusCode: HttpStatus.NOT_FOUND,
				error: 'ORDER_NOT_FOUND',
				message: message || 'Order not found in the database'
			},
			HttpStatus.NOT_FOUND,
			options
		)
	}
}

export class OrderCreationFailedException extends HttpException {
	constructor(message?: string, options?: { cause?: unknown }) {
		super(
			{
				statusCode: HttpStatus.BAD_REQUEST,
				error: 'ORDER_CREATION_FAILED',
				message: message || 'Failed to create order'
			},
			HttpStatus.BAD_REQUEST,
			options
		)
	}
}

export class InvalidOrderDataException extends HttpException {
	constructor(message?: string, options?: { cause?: unknown }) {
		super(
			{
				statusCode: HttpStatus.BAD_REQUEST,
				error: 'INVALID_ORDER_DATA',
				message: message || 'Invalid order data provided'
			},
			HttpStatus.BAD_REQUEST,
			options
		)
	}
}
