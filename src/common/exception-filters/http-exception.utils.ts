import type { HttpException } from '@nestjs/common'

export const getExceptionErrorMessage = (exception: HttpException): string => {
	const response = exception.getResponse()

	if (typeof response === 'object' && response !== null) {
		const errorMessage =
			'message' in response ? String(response.message) : JSON.stringify(response)
		return errorMessage || 'Internal server error'
	}

	return typeof exception.message === 'string' ? exception.message : 'Internal server error'
}

export const getExceptionError = (exception: HttpException): string => {
	const response = exception.getResponse()

	if (typeof response === 'object' && response !== null) {
		const errorMessage = 'error' in response ? String(response.error) : JSON.stringify(response)
		return errorMessage || 'Internal server error'
	}

	return 'Internal server error'
}
