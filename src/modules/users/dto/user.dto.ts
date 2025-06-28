import { ApiProperty } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { IsDateString, IsString } from 'class-validator'

export class UserDto {
	@ApiProperty({ description: 'User ID', example: 'user-123' })
	@IsString()
	id: string

	@ApiProperty({ description: 'Username', example: 'john_doe' })
	@IsString()
	username: string

	@ApiProperty({ description: 'User creation timestamp', example: '2024-03-05T12:00:00Z' })
	@IsDateString()
	createdAt: string

	@ApiProperty({ description: 'User last update timestamp', example: '2024-03-05T12:00:00Z' })
	@IsDateString()
	updatedAt: string

	static fromEntity(user: User): UserDto {
		return plainToInstance(UserDto, {
			id: user.id,
			username: user.username,
			createdAt: user.createdAt.toISOString(),
			updatedAt: user.updatedAt.toISOString()
		})
	}
}
