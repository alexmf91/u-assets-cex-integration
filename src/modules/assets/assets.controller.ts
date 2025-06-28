import { Controller, Get, Logger, Param } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AssetsService } from './assets.service'
import { AssetDto } from './dto'

@ApiTags('Assets')
@Controller('assets')
export class AssetsController {
	private readonly logger = new Logger(AssetsController.name, { timestamp: true })

	constructor(private readonly assetsService: AssetsService) {}

	@Get()
	@ApiOperation({ summary: 'List all available uAssets' })
	@ApiResponse({ status: 200, description: 'List of assets', type: [AssetDto] })
	async listAssets(): Promise<AssetDto[]> {
		this.logger.log('Received request to list all assets')
		return this.assetsService.listAssets()
	}

	@Get(':symbol')
	@ApiOperation({ summary: 'Get asset by symbol' })
	@ApiParam({
		name: 'symbol',
		required: true,
		description: 'Asset symbol',
		type: 'string',
		example: 'uETH'
	})
	@ApiResponse({ status: 200, description: 'Asset details', type: AssetDto })
	async getAssetBySymbol(@Param('symbol') symbol: string): Promise<AssetDto> {
		this.logger.log(`Received request to get asset by symbol: ${symbol}`)
		return this.assetsService.getAssetBySymbol(symbol)
	}
}
