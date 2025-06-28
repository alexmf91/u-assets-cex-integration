import { OrderSide, OrderStatus, PrismaClient, QuoteSide } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
	// Seed Users
	const passwordHash = await bcrypt.hash('password123', 10)
	const alice = await prisma.user.upsert({
		where: { username: 'alice' },
		update: {},
		create: {
			username: 'alice',
			passwordHash
		}
	})
	const bob = await prisma.user.upsert({
		where: { username: 'bob' },
		update: {},
		create: {
			username: 'bob',
			passwordHash
		}
	})

	// Seed Assets
	const ueth = await prisma.asset.upsert({
		where: { symbol: 'uETH' },
		update: {},
		create: {
			symbol: 'uETH',
			name: 'Universal Wrapped Ethereum',
			decimals: 18,
			isActive: true
		}
	})
	const ubtc = await prisma.asset.upsert({
		where: { symbol: 'uBTC' },
		update: {},
		create: {
			symbol: 'uBTC',
			name: 'Universal Wrapped Bitcoin',
			decimals: 8,
			isActive: true
		}
	})

	// Seed Quotes
	const quote1 = await prisma.quote.upsert({
		where: { id: '4b5b984b-f9a3-4d79-bd44-64bdb02d6172' },
		update: {},
		create: {
			id: '4b5b984b-f9a3-4d79-bd44-64bdb02d6172',
			assetId: ueth.id,
			userId: alice.id,
			amount: 1.5,
			price: 2500,
			side: QuoteSide.BUY
		}
	})
	const quote2 = await prisma.quote.upsert({
		where: { id: '79f6e2fe-3558-450f-9a53-aa2085ae30da' },
		update: {},
		create: {
			id: '79f6e2fe-3558-450f-9a53-aa2085ae30da',
			assetId: ubtc.id,
			userId: bob.id,
			amount: 0.8,
			price: 30000,
			side: QuoteSide.SELL
		}
	})

	// Seed Orders
	await prisma.order.upsert({
		where: { id: 'a526a16e-5573-4c08-8bdf-f4141a98c415' },
		update: {},
		create: {
			id: 'a526a16e-5573-4c08-8bdf-f4141a98c415',
			quoteId: quote1.id,
			assetId: ueth.id,
			userId: alice.id,
			amount: 1.5,
			price: 2500,
			side: OrderSide.BUY,
			status: OrderStatus.PENDING
		}
	})
	await prisma.order.upsert({
		where: { id: 'c1ed9ac8-3029-4681-93e7-1cd9a902db15' },
		update: {},
		create: {
			id: 'c1ed9ac8-3029-4681-93e7-1cd9a902db15',
			quoteId: quote2.id,
			assetId: ubtc.id,
			userId: bob.id,
			amount: 0.8,
			price: 30000,
			side: OrderSide.SELL,
			status: OrderStatus.FILLED
		}
	})

	console.log('Database seeded successfully!')
}

void (async () => {
	try {
		await main()
	} catch (e) {
		console.error(e)
		process.exit(1)
	} finally {
		await prisma.$disconnect()
	}
})()
