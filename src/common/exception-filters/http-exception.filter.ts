import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import type { Request } from 'express'

import { getExceptionError, getExceptionErrorMessage } from './http-exception.utils'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	private readonly logger: Logger

	constructor(private readonly httpAdapterHost: HttpAdapterHost) {
		this.logger = new Logger(HttpExceptionFilter.name)
	}

	catch(exception: HttpException, host: ArgumentsHost): void {
		const { httpAdapter } = this.httpAdapterHost

		const ctx = host.switchToHttp()
		const request = ctx.getRequest<Request>()

		const httpStatus =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR

		const errorMessage = getExceptionErrorMessage(exception)

		const responseBody = {
			path: request.url,
			statusCode: httpStatus,
			error: getExceptionError(exception),
			message: errorMessage,
			timestamp: new Date().toISOString()
		}

		this.logger.error(
			`HTTP Status: ${httpStatus}, Error Message: ${errorMessage}`,
			exception.stack
		)

		httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
	}
}
