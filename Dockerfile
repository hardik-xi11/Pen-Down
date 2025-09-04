###############
# Base image  #
###############
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm" \
	NODE_ENV=production
RUN corepack enable

###############
# Builder     #
###############
FROM base AS builder
WORKDIR /app

# Install OS deps needed for prisma generation (openssl already in alpine base for node:20)
RUN apk add --no-cache libc6-compat

# Install dependencies (use npm ci for reproducibility)
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

# Copy the rest of the source
COPY . .

# Generate Prisma Client (uses schema)
RUN npx prisma generate

# Build the Next.js app (standalone output configured in next.config.ts)
RUN npm run build

###############
# Production  #
###############
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=builder --chown=appuser:appgroup /app/.next/static ./.next/static

# If you have migrations at runtime (optional)
# COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER appuser

EXPOSE 3000
ENV PORT=3000

# Disable Next.js telemetry in containers
ENV NEXT_TELEMETRY_DISABLED=1

# Start the server produced by standalone output
CMD ["node", "server.js"]
