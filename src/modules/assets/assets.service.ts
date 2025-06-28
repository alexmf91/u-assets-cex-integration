import { Injectable, Logger } from '@nestjs/common'
import { DatabaseService } from '../database'
import { AssetNotFoundException } from './assets.exceptions'
import { AssetDto } from './dto'

@Injectable()
export class AssetsService {
	private readonly logger = new Logger(AssetsService.name, { timestamp: true })

	constructor(private readonly databaseService: DatabaseService) {}

	async listAssets(): Promise<AssetDto[]> {
		this.logger.log('Listing all active assets')
		const assets = await this.databaseService.asset.findMany({
			where: { isActive: true },
			orderBy: { symbol: 'asc' }
		})
		return AssetDto.fromEntities(assets)
	}

	async getAssetBySymbol(symbol: string): Promise<AssetDto> {
		this.logger.log(`Retrieving asset by symbol: ${symbol}`)
		const asset = await this.databaseService.asset.findUnique({
			where: { symbol }
		})
		if (!asset) {
			this.logger.warn(`Asset not found: ${symbol}`)
			throw new AssetNotFoundException(`Asset with symbol '${symbol}' not found`)
		}
		return AssetDto.fromEntity(asset)
	}

	async seedDefaultAssets(): Promise<void> {
		this.logger.log('Seeding default assets')
		const defaultAssets = [
			{ symbol: 'uETH', name: 'Universal Wrapped Ethereum', decimals: 18 },
			{ symbol: 'uBTC', name: 'Universal Wrapped Bitcoin', decimals: 8 },
			{ symbol: 'uUSDC', name: 'Universal Wrapped USDC', decimals: 6 },
			{ symbol: 'uUSDT', name: 'Universal Wrapped USDT', decimals: 6 }
		]
		for (const assetData of defaultAssets) {
			await this.databaseService.asset.upsert({
				where: { symbol: assetData.symbol },
				update: {},
				create: {
					symbol: assetData.symbol,
					name: assetData.name,
					decimals: assetData.decimals,
					isActive: true
				}
			})
		}
	}
}
