import { Module } from '@nestjs/common'
import { AssetsController } from './assets.controller'
import { AssetsService } from './assets.service'
import { DatabaseModule } from '../database'

@Module({
	imports: [DatabaseModule],
	controllers: [AssetsController],
	providers: [AssetsService],
	exports: [AssetsService]
})
export class AssetsModule {}
