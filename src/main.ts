import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'

import type { EnvironmentVariables } from 'env'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/exception-filters'
import { setupSwagger } from './config'

async function bootstrap() {
	try {
		const app = await NestFactory.create<NestExpressApplication>(AppModule)
		const configService = app.get<ConfigService<EnvironmentVariables>>(ConfigService)

		const PORT = configService.get('PORT', { infer: true }) || 3000
		const VERSION = configService.get('VERSION', { infer: true })

		const httpAdapterHost = app.get(HttpAdapterHost)

		app.setGlobalPrefix(`api/v${VERSION}`)
		app.enableCors({
			origin: '*',
			methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
			credentials: true
		})
		app.useGlobalPipes(new ValidationPipe({ transform: true }))
		app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost))

		setupSwagger(app, configService)

		// Bind to 0.0.0.0 to accept external connections (required for Render)
		await app.listen(PORT, '0.0.0.0')
		const url = await app.getUrl()

		Logger.verbose(`Application is running on: ${url} ✔️`)
		Logger.verbose(`Api documentation run on: ${url}/api-docs ✔️`)
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error)
		Logger.error(`❌❌❌ ${errorMessage} ❌❌❌`)
		process.exit(1)
	}
}

void bootstrap()
