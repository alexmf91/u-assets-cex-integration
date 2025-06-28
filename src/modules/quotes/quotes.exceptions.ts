import { HttpException, HttpStatus } from '@nestjs/common'

export class QuoteNotFoundException extends HttpException {
	constructor(message?: string, options?: { cause?: unknown }) {
		super(
			{
				statusCode: HttpStatus.NOT_FOUND,
				error: 'QUOTE_NOT_FOUND',
				message: message || 'Quote not found in the database'
			},
			HttpStatus.NOT_FOUND,
			options
		)
	}
}

export class QuoteExpiredException extends HttpException {
	constructor(message?: string, options?: { cause?: unknown }) {
		super(
			{
				statusCode: HttpStatus.BAD_REQUEST,
				error: 'QUOTE_EXPIRED',
				message: message || 'Quote has expired'
			},
			HttpStatus.BAD_REQUEST,
			options
		)
	}
}

export class QuoteCreationFailedException extends HttpException {
	constructor(message?: string, options?: { cause?: unknown }) {
		super(
			{
				statusCode: HttpStatus.BAD_REQUEST,
				error: 'QUOTE_CREATION_FAILED',
				message: message || 'Failed to create quote'
			},
			HttpStatus.BAD_REQUEST,
			options
		)
	}
}

export class QuoteCommitFailedException extends HttpException {
	constructor(message?: string, options?: { cause?: unknown }) {
		super(
			{
				statusCode: HttpStatus.BAD_REQUEST,
				error: 'QUOTE_COMMIT_FAILED',
				message: message || 'Failed to commit quote'
			},
			HttpStatus.BAD_REQUEST,
			options
		)
	}
}
