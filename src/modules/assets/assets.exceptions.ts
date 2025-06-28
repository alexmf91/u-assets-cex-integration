import { HttpException, HttpStatus } from '@nestjs/common'

export class AssetNotFoundException extends HttpException {
	constructor(message?: string, options?: { cause?: unknown }) {
		super(
			{
				statusCode: HttpStatus.NOT_FOUND,
				error: 'ASSET_NOT_FOUND',
				message: message || 'Asset not found in the database'
			},
			HttpStatus.NOT_FOUND,
			options
		)
	}
}

export class AssetCreationFailedException extends HttpException {
	constructor(message?: string, options?: { cause?: unknown }) {
		super(
			{
				statusCode: HttpStatus.BAD_REQUEST,
				error: 'ASSET_CREATION_FAILED',
				message: message || 'Failed to create asset'
			},
			HttpStatus.BAD_REQUEST,
			options
		)
	}
}

export class AssetAlreadyExistsException extends HttpException {
	constructor(message?: string, options?: { cause?: unknown }) {
		super(
			{
				statusCode: HttpStatus.CONFLICT,
				error: 'ASSET_ALREADY_EXISTS',
				message: message || 'Asset already exists in the database'
			},
			HttpStatus.CONFLICT,
			options
		)
	}
}
