# ==============================================================================
# Multi-Stage Hardened Dockerfile for PhishGuard Next.js Enterprise Frontend
# Base: Node 20 on Alpine Linux for tiny footprint (~120MB) & zero critical CVEs
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Dependencies (deps)
# ------------------------------------------------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app

# Ensure libc6-compat is installed for alpine compatibility
RUN apk add --no-cache libc6-compat

# Copy package manifests and install frozen dependencies
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# ------------------------------------------------------------------------------
# Stage 2: Builder
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Compile optimized standalone production bundle
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 3: Production Runner (Hardened & Non-Root)
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install curl for container HEALTHCHECK
RUN apk add --no-cache curl

# Security: Create dedicated non-root user and group
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static assets and standalone server from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user (Principle of Least Privilege)
USER nextjs

EXPOSE 3000

# Healthcheck to verify Next.js server readiness
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

CMD ["node", "server.js"]

