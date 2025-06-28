import { HttpException, HttpStatus } from '@nestjs/common'

export class UserNotFoundException extends HttpException {
	constructor(message?: string, options?: { cause?: unknown }) {
		super(
			{
				statusCode: HttpStatus.NOT_FOUND,
				error: 'USER_NOT_FOUND',
				message: message || 'User not found in the database'
			},
			HttpStatus.NOT_FOUND,
			options
		)
	}
}

export class UsernameAlreadyExistsException extends HttpException {
	constructor(message?: string, options?: { cause?: unknown }) {
		super(
			{
				statusCode: HttpStatus.CONFLICT,
				error: 'USERNAME_ALREADY_EXISTS',
				message: message || 'This username is already taken. Please choose a different one.'
			},
			HttpStatus.CONFLICT,
			options
		)
	}
}
