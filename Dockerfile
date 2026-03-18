# Multi-stage build for optimized production image
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Build dependencies (for prisma generation)
FROM base AS build_deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

# Build application
FROM base AS builder
RUN apk add --no-cache libc6-compat
COPY --from=build_deps /app/node_modules ./node_modules
COPY . .

# Generate prisma client and build next app
RUN npx prisma generate
RUN npm run build

# Production runtime
FROM base AS runner
RUN apk add --no-cache libc6-compat dumb-init
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create app user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

USER nextjs
EXPOSE 3000
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["/sbin/dumb-init", "--"]
CMD ["node_modules/.bin/next", "start"]
