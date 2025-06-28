import { Module } from '@nestjs/common'
import { AssetsModule } from '../assets'
import { DatabaseModule } from '../database'
import { RedisModule } from '../redis'
import { UserModule } from '../users'
import { QuotesController } from './quotes.controller'
import { QuotesService } from './quotes.service'

@Module({
	imports: [DatabaseModule, RedisModule, AssetsModule, UserModule],
	controllers: [QuotesController],
	providers: [QuotesService],
	exports: [QuotesService]
})
export class QuotesModule {}
