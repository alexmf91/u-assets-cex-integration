# Use Bun with a more stable base
FROM oven/bun:1-alpine AS base

WORKDIR /app

# Install system dependencies (for Prisma, etc.)
RUN apk add --no-cache openssl

# Copy only package files to leverage caching
COPY package.json bun.lockb ./

# Install dependencies (this layer gets cached unless deps change)
RUN bun install --frozen-lockfile

# Copy source files separately (after deps)
COPY . .

# Generate Prisma client (ensures generated files are in build)
RUN bunx prisma generate

# Build the app (assumes output goes to /app/dist or similar)
RUN bun run build

# Expose app port
EXPOSE 8080
