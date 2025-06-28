import { Body, Controller, Logger, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { LoginDto, LoginResponseDto } from './dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	private readonly logger = new Logger(AuthController.name, { timestamp: true })

	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@ApiOperation({ summary: 'Login with username and password' })
	@ApiResponse({
		status: 200,
		description: 'Login successful',
		type: LoginResponseDto
	})
	async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
		this.logger.log(`Received login request for username: ${dto.username}`)
		return this.authService.login(dto)
	}
}
