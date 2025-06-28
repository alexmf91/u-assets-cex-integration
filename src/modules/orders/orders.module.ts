import { Module } from '@nestjs/common'
import { AssetsModule } from '../assets'
import { DatabaseModule } from '../database'
import { QuotesModule } from '../quotes'
import { UserModule } from '../users'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'

@Module({
	imports: [DatabaseModule, AssetsModule, UserModule, QuotesModule],
	controllers: [OrdersController],
	providers: [OrdersService]
})
export class OrdersModule {}
