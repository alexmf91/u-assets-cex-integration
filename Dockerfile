# Multi-stage build for production deployment on Digital Ocean
FROM oven/bun:1-alpine AS base

# Set working directory
WORKDIR /app

# Install system dependencies for production
RUN apk add --no-cache openssl dumb-init

# Copy package files for dependency caching
COPY package.json bun.lockb ./

# Install production dependencies only
RUN bun install --frozen-lockfile --production

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN bunx prisma generate

# Build stage
FROM base AS builder

# Install all dependencies (including dev dependencies) for building
RUN bun install --frozen-lockfile

# Copy source code and configuration files
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1-alpine AS production

# Install production system dependencies
RUN apk add --no-cache openssl dumb-init

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Copy Prisma files
COPY --from=builder /app/prisma ./prisma

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=8080

# Expose port (Digital Ocean expects 8080)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
	CMD bun --version || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["bun", "dist/main.js"]
