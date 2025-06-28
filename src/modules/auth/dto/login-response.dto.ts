import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class LoginResponseDto {
	@ApiProperty({ description: 'JWT token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
	@IsString()
	token: string

	@ApiProperty({ description: 'Username', example: 'john_doe' })
	@IsString()
	username: string
}
