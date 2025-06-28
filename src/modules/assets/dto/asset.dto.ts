import { ApiProperty } from '@nestjs/swagger'
import { Asset } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator'

export class AssetDto {
	@ApiProperty({ description: 'Asset ID', example: 'asset-123' })
	@IsString()
	id: string

	@ApiProperty({ description: 'Asset symbol', example: 'uETH' })
	@IsString()
	symbol: string

	@ApiProperty({ description: 'Asset name', example: 'Wrapped Ethereum' })
	@IsString()
	name: string

	@ApiProperty({ description: 'Number of decimals', example: 18 })
	@IsNumber()
	decimals: number

	@ApiProperty({ description: 'Whether asset is active for trading', example: true })
	@IsBoolean()
	isActive: boolean

	@ApiProperty({ description: 'Asset creation timestamp', example: '2024-03-05T12:00:00Z' })
	@IsDateString()
	createdAt: string

	@ApiProperty({ description: 'Asset last update timestamp', example: '2024-03-05T12:00:00Z' })
	@IsDateString()
	updatedAt: string

	static fromEntity(asset: Asset): AssetDto {
		return plainToInstance(AssetDto, {
			id: asset.id,
			symbol: asset.symbol,
			name: asset.name,
			decimals: asset.decimals,
			isActive: asset.isActive,
			createdAt: asset.createdAt.toISOString(),
			updatedAt: asset.updatedAt.toISOString()
		})
	}

	static fromEntities(assets: Asset[]): AssetDto[] {
		return assets.map((asset) => this.fromEntity(asset))
	}
}
