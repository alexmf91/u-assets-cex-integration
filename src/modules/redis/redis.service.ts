import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { EnvironmentVariables } from 'env'
import { createClient, type RedisClientType } from 'redis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
	private readonly client: RedisClientType

	constructor(configService: ConfigService<EnvironmentVariables>) {
		const redisUrl = configService.get<string>('REDIS_URL', { infer: true })

		if (!redisUrl) {
			throw new Error('REDIS_URL is missing in the environment variables')
		}

		this.client = createClient({ url: redisUrl })
	}

	async onModuleInit() {
		await this.client.connect()
	}

	onModuleDestroy() {
		this.client.destroy()
	}

	async set(key: string, value: string, expirationInSeconds: number) {
		await this.client.set(key, value, { EX: expirationInSeconds })
	}

	async get(key: string): Promise<string | null> {
		return this.client.get(key)
	}

	async del(key: string) {
		await this.client.del(key)
	}
}
