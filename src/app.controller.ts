import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger'
import { AppService } from './app.service'

@ApiTags('App')
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('health-check')
	@ApiOperation({
		description: 'API call to check if the server is alive.'
	})
	@ApiOkResponse({
		description: 'The server is alive'
	})
	getHealthCheck() {
		return this.appService.getHealthCheck()
	}
}
