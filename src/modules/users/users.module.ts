import { Module } from '@nestjs/common'
import { AuthModule } from '../auth'
import { DatabaseModule } from '../database'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
	imports: [DatabaseModule, AuthModule],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService]
})
export class UserModule {}
