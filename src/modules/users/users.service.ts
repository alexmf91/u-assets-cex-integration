import { Injectable, Logger } from '@nestjs/common'

import { AuthService } from '../auth/auth.service'
import { DatabaseService } from '../database'
import { RegisterUserDto, UserDto } from './dto'
import { UsernameAlreadyExistsException, UserNotFoundException } from './users.exceptions'

@Injectable()
export class UsersService {
	private readonly logger = new Logger(UsersService.name, { timestamp: true })

	constructor(
		private readonly authService: AuthService,
		private readonly databaseService: DatabaseService
	) {}

	async registerUser(dto: RegisterUserDto): Promise<{ token: string; user: UserDto }> {
		this.logger.log(`Registering user: ${dto.username}`)
		const existingUser = await this.databaseService.user.findUnique({
			where: { username: dto.username }
		})
		if (existingUser) {
			this.logger.warn(`Username already exists: ${dto.username}`)
			throw new UsernameAlreadyExistsException()
		}
		const passwordHash = await this.authService.hashPassword(dto.password)
		const user = await this.databaseService.user.create({
			data: {
				username: dto.username,
				passwordHash
			}
		})
		const token = this.authService.signJwt({ username: user.username, id: user.id })
		return {
			token,
			user: UserDto.fromEntity(user)
		}
	}

	async getUserById(id: string): Promise<UserDto> {
		this.logger.log(`Retrieving user by id: ${id}`)
		const user = await this.databaseService.user.findUnique({
			where: { id }
		})
		if (!user) {
			this.logger.warn(`User not found: ${id}`)
			throw new UserNotFoundException()
		}
		return UserDto.fromEntity(user)
	}

	async getUserByUsername(username: string): Promise<UserDto> {
		this.logger.log(`Retrieving user by username: ${username}`)
		const user = await this.databaseService.user.findUnique({
			where: { username }
		})
		if (!user) {
			this.logger.warn(`User not found: ${username}`)
			throw new UserNotFoundException()
		}
		return UserDto.fromEntity(user)
	}
}
