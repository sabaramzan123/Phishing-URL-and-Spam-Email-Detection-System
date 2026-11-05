# ==============================================================================
# Stage 1: Builder (Install dependencies & compile Next.js application)
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Step 1: Install node modules
COPY package*.json ./
RUN npm install

# Step 2: Copy source code and build Next.js (standalone output)
COPY . .
RUN npm run build

# ==============================================================================
# Stage 2: Runner (Minimal & Secure Production Container ~120MB)
# ==============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Security Hardening: Create non-root user (nextjs:nodejs)
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 nextjs -G nodejs

# Copy static assets and standalone production build from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose Next.js port
EXPOSE 3000

# Start server directly with Node (no heavy npm/npx needed)
CMD ["node", "server.js"]
