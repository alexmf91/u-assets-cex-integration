import { HttpException, HttpStatus } from '@nestjs/common'

export class InvalidCredentials extends HttpException {
	constructor(message?: string, options?: { cause?: unknown }) {
		super(
			{
				statusCode: HttpStatus.UNAUTHORIZED,
				error: 'INVALID_CREDENTIALS',
				message: message || 'Invalid credentials'
			},
			HttpStatus.UNAUTHORIZED,
			options
		)
	}
}
