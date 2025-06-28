import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RegisterUserDto, UserDto } from './dto'
import { UsersService } from './users.service'

@ApiTags('Users')
@Controller('users')
export class UsersController {
	private readonly logger = new Logger(UsersController.name, { timestamp: true })

	constructor(private readonly userService: UsersService) {}

	@Post('register')
	@ApiOperation({
		summary: 'Register new user',
		description: 'Registers a new user with username and password.'
	})
	@ApiResponse({ status: 201, description: 'User registered successfully' })
	async registerUser(@Body() dto: RegisterUserDto) {
		this.logger.log(`Received request to register user: ${dto.username}`)
		return this.userService.registerUser(dto)
	}

	@Get(':username')
	@ApiOperation({
		summary: 'Get user by username',
		description: 'Retrieves user details using their username.'
	})
	@ApiResponse({ status: 200, type: UserDto })
	async getUserByUsername(@Param('username') username: string) {
		this.logger.log(`Received request to get user by username: ${username}`)
		return this.userService.getUserByUsername(username)
	}
}
