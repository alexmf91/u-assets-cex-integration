import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { LoggerMiddleware } from './common/middleware'
import { AssetsModule } from './modules/assets'
import { AuthModule } from './modules/auth'
import { DatabaseModule } from './modules/database'
import { OrdersModule } from './modules/orders'
import { QuotesModule } from './modules/quotes'
import { RedisModule } from './modules/redis'
import { UserModule } from './modules/users'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		DatabaseModule,
		RedisModule,
		AuthModule,
		AssetsModule,
		UserModule,
		OrdersModule,
		QuotesModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('')
	}
}
