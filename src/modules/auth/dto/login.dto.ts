import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
	@ApiProperty({ description: 'Username', example: 'alice' })
	@IsString()
	@IsNotEmpty()
	username: string

	@ApiProperty({ description: 'Password', example: 'password123' })
	@IsString()
	@IsNotEmpty()
	password: string
}
