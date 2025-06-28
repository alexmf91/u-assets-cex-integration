import { Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'

import { DatabaseService } from '../database'
import { UserNotFoundException } from '../users/users.exceptions'
import { InvalidCredentials } from './auth.exceptions'
import { LoginDto, LoginResponseDto } from './dto'

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name, { timestamp: true })
	private readonly saltRounds = 12

	constructor(
		private readonly jwtService: JwtService,
		private readonly databaseService: DatabaseService
	) {}

	private comparePassword(password: string, hash: string): Promise<boolean> {
		return bcrypt.compare(password, hash)
	}

	public hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, this.saltRounds)
	}

	async login(dto: LoginDto): Promise<LoginResponseDto> {
		this.logger.log(`Login attempt for username: ${dto.username}`)
		const user = await this.databaseService.user.findUnique({
			where: { username: dto.username }
		})
		if (!user) {
			this.logger.warn(`User with username '${dto.username}' not found in the db`)
			throw new UserNotFoundException()
		}
		const isPasswordValid = await this.comparePassword(dto.password, user.passwordHash)
		if (!isPasswordValid) {
			this.logger.warn(`Invalid credentials for username: ${dto.username}`)
			throw new InvalidCredentials()
		}
		const token = this.jwtService.sign({ username: user.username, id: user.id })
		return { token, username: user.username }
	}

	public signJwt(payload: object): string {
		return this.jwtService.sign(payload)
	}
}
