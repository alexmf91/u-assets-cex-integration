import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CachedQuoteDto, CreateQuoteDto, QuoteDto } from './dto'
import { QuotesService } from './quotes.service'

@ApiTags('Quotes')
@Controller('quotes')
export class QuotesController {
	private readonly logger = new Logger(QuotesController.name, { timestamp: true })

	constructor(private readonly quotesService: QuotesService) {}

	@Post()
	@ApiOperation({ summary: 'Request a quote for a uAsset trade (stored in cache)' })
	@ApiResponse({ status: 201, description: 'Quote created', type: QuoteDto })
	async genQuote(@Body() dto: CreateQuoteDto): Promise<CachedQuoteDto> {
		this.logger.log(
			`Received request to generate quote for asset: ${dto.asset}, user: ${dto.userId}`
		)
		return this.quotesService.genQuote(dto)
	}

	@Post(':id/commit')
	@ApiOperation({ summary: 'Commit a quote (move from cache to database)' })
	@ApiParam({ name: 'id', required: true, description: 'Quote ID', type: 'string' })
	@ApiResponse({ status: 200, description: 'Quote committed', type: QuoteDto })
	async commitQuote(@Param('id') id: string): Promise<QuoteDto> {
		this.logger.log(`Received request to commit quote with id: ${id}`)
		return this.quotesService.commitQuote(id)
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get commited quote by ID' })
	@ApiParam({ name: 'id', required: true, description: 'Quote ID', type: 'string' })
	@ApiResponse({ status: 200, description: 'Quote details', type: QuoteDto })
	async getQuote(@Param('id') id: string): Promise<QuoteDto> {
		this.logger.log(`Received request to get commited quote by id: ${id}`)
		return this.quotesService.getCommitedQuoteById(id)
	}

	@Get()
	@ApiOperation({ summary: 'List all committed quotes from database' })
	@ApiResponse({ status: 200, description: 'List of quotes', type: [QuoteDto] })
	async listQuotes(): Promise<QuoteDto[]> {
		this.logger.log('Received request to list all quotes')
		return this.quotesService.listQuotes()
	}
}
