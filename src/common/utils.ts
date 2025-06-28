import { HttpException, Logger } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validateSync, ValidationError } from 'class-validator'

export function validateDto<T extends object>(dtoClass: new () => T, data: unknown): T {
	const instance = plainToInstance(dtoClass, data)
	const errors: ValidationError[] = validateSync(instance, {
		whitelist: true, // strip unknown properties
		forbidNonWhitelisted: true // throw if unknown properties exist
	})

	if (errors.length > 0) {
		const messages = errors.map((e) => Object.values(e.constraints ?? {}).join(', ')).join('; ')
		throw new Error(`Validation failed: ${messages}`)
	}

	return instance
}

export function handleServiceError<T extends Error>(
	logger: Logger,
	context: string,
	error: unknown,
	domainWrapper: (cause: Error) => T
): never {
	const err = error instanceof Error ? error : new Error(String(error))

	logger.error(`[${context}]`, err.stack ?? err.message)

	// Known HTTP errors: we let them bubble
	if (err instanceof HttpException) throw err

	// Otherwise, we wrap it with context
	throw domainWrapper(err)
}
