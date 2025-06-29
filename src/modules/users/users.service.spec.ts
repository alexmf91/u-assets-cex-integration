/* eslint-disable @typescript-eslint/unbound-method */
import { Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { AuthService } from '../auth/auth.service'
import { DatabaseService } from '../database'
import { RegisterUserDto, UserDto } from './dto'
import { UsernameAlreadyExistsException, UserNotFoundException } from './users.exceptions'
import { UsersService } from './users.service'

describe('UsersService', () => {
	let service: UsersService
	let authService: jest.Mocked<AuthService>
	let databaseService: jest.Mocked<DatabaseService>

	const mockUser = {
		id: 'user-123',
		username: 'testuser',
		passwordHash: 'hashed-password',
		createdAt: new Date('2024-01-01T00:00:00Z'),
		updatedAt: new Date('2024-01-01T00:00:00Z')
	}

	const mockUserDto = {
		id: 'user-123',
		username: 'testuser',
		createdAt: '2024-01-01T00:00:00.000Z',
		updatedAt: '2024-01-01T00:00:00.000Z'
	}

	beforeEach(async () => {
		const mockAuthService = {
			hashPassword: jest.fn(),
			signJwt: jest.fn()
		}

		const mockDatabaseService = {
			user: {
				findUnique: jest.fn(),
				create: jest.fn()
			}
		}

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: AuthService,
					useValue: mockAuthService
				},
				{
					provide: DatabaseService,
					useValue: mockDatabaseService
				}
			]
		}).compile()

		service = module.get<UsersService>(UsersService)
		authService = module.get(AuthService)
		databaseService = module.get(DatabaseService)

		// Mock logger to avoid console output during tests
		jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {})
		jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {})
	})

	describe('registerUser', () => {
		const registerDto: RegisterUserDto = {
			username: 'newuser',
			password: 'password123'
		}

		it('successfully register a new user', async () => {
			// Arrange
			const hashedPassword = 'hashed-password-123'
			const token = 'jwt-token-123'

			;(databaseService.user.findUnique as jest.Mock).mockResolvedValue(null)
			authService.hashPassword.mockResolvedValue(hashedPassword)
			;(databaseService.user.create as jest.Mock).mockResolvedValue(mockUser)
			authService.signJwt.mockReturnValue(token)

			// Act
			const result = await service.registerUser(registerDto)

			// Assert
			expect(databaseService.user.findUnique).toHaveBeenCalledWith({
				where: { username: registerDto.username }
			})
			expect(authService.hashPassword).toHaveBeenCalledWith(registerDto.password)
			expect(databaseService.user.create).toHaveBeenCalledWith({
				data: {
					username: registerDto.username,
					passwordHash: hashedPassword
				}
			})
			expect(authService.signJwt).toHaveBeenCalledWith({
				username: mockUser.username,
				id: mockUser.id
			})
			expect(result).toEqual({
				token,
				user: mockUserDto
			})
		})

		it('throw UsernameAlreadyExistsException when username already exists', async () => {
			// Arrange
			;(databaseService.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

			// Act & Assert
			await expect(service.registerUser(registerDto)).rejects.toThrow(
				UsernameAlreadyExistsException
			)
			expect(databaseService.user.findUnique).toHaveBeenCalledWith({
				where: { username: registerDto.username }
			})
			expect(authService.hashPassword).not.toHaveBeenCalled()
			expect(databaseService.user.create).not.toHaveBeenCalled()
		})

		it('handle database errors during user creation', async () => {
			// Arrange
			const dbError = new Error('Database connection failed')
			;(databaseService.user.findUnique as jest.Mock).mockResolvedValue(null)
			authService.hashPassword.mockResolvedValue('hashed-password')
			;(databaseService.user.create as jest.Mock).mockRejectedValue(dbError)

			// Act & Assert
			await expect(service.registerUser(registerDto)).rejects.toThrow(dbError)
		})
	})

	describe('getUserById', () => {
		it('successfully retrieve user by id', async () => {
			// Arrange
			const userId = 'user-123'
			;(databaseService.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

			// Act
			const result = await service.getUserById(userId)

			// Assert
			expect(databaseService.user.findUnique).toHaveBeenCalledWith({
				where: { id: userId }
			})
			expect(result).toEqual(mockUserDto)
		})

		it('throw UserNotFoundException when user is not found by id', async () => {
			// Arrange
			const userId = 'non-existent-id'
			;(databaseService.user.findUnique as jest.Mock).mockResolvedValue(null)

			// Act & Assert
			await expect(service.getUserById(userId)).rejects.toThrow(UserNotFoundException)
			expect(databaseService.user.findUnique).toHaveBeenCalledWith({
				where: { id: userId }
			})
		})

		it('handle database errors when retrieving user by id', async () => {
			// Arrange
			const userId = 'user-123'
			const dbError = new Error('Database connection failed')
			;(databaseService.user.findUnique as jest.Mock).mockRejectedValue(dbError)

			// Act & Assert
			await expect(service.getUserById(userId)).rejects.toThrow(dbError)
		})
	})

	describe('getUserByUsername', () => {
		it('successfully retrieve user by username', async () => {
			// Arrange
			const username = 'testuser'
			;(databaseService.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

			// Act
			const result = await service.getUserByUsername(username)

			// Assert
			expect(databaseService.user.findUnique).toHaveBeenCalledWith({
				where: { username }
			})
			expect(result).toEqual(mockUserDto)
		})

		it('throw UserNotFoundException when user is not found by username', async () => {
			// Arrange
			const username = 'non-existent-user'
			;(databaseService.user.findUnique as jest.Mock).mockResolvedValue(null)

			// Act & Assert
			await expect(service.getUserByUsername(username)).rejects.toThrow(UserNotFoundException)
			expect(databaseService.user.findUnique).toHaveBeenCalledWith({
				where: { username }
			})
		})

		it('handle database errors when retrieving user by username', async () => {
			// Arrange
			const username = 'testuser'
			const dbError = new Error('Database connection failed')
			;(databaseService.user.findUnique as jest.Mock).mockRejectedValue(dbError)

			// Act & Assert
			await expect(service.getUserByUsername(username)).rejects.toThrow(dbError)
		})
	})

	describe('UserDto.fromEntity', () => {
		it('correctly transform user entity to DTO', () => {
			// Act
			const result = UserDto.fromEntity(mockUser)

			// Assert
			expect(result).toEqual(mockUserDto)
		})

		it('handle different date formats correctly', () => {
			// Arrange
			const userWithDifferentDates = {
				...mockUser,
				createdAt: new Date('2024-12-25T15:30:45.123Z'),
				updatedAt: new Date('2024-12-26T10:20:30.456Z')
			}

			// Act
			const result = UserDto.fromEntity(userWithDifferentDates)

			// Assert
			expect(result.createdAt).toBe('2024-12-25T15:30:45.123Z')
			expect(result.updatedAt).toBe('2024-12-26T10:20:30.456Z')
		})
	})
})
