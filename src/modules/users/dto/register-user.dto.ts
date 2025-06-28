import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class RegisterUserDto {
	@ApiProperty({ description: 'Username', example: 'john_doe' })
	@IsString()
	@IsNotEmpty()
	username: string

	@ApiProperty({ description: 'Password', example: 'password123' })
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	password: string
}
