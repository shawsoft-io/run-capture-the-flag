# syntax=docker/dockerfile:1

# Base image for the app
FROM node:20-alpine AS base
 
# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js and WebJob
RUN --mount=type=secret,id=auth_secret \
    --mount=type=secret,id=auth_strava_id \
    --mount=type=secret,id=auth_strava_client_secret \
    --mount=type=secret,id=auth_url \
    --mount=type=secret,id=mongodb_uri \
    --mount=type=secret,id=mongodb_name \
    --mount=type=secret,id=next_public_base_url \
    export AUTH_SECRET=$(cat /run/secrets/auth_secret) && \
    export AUTH_STRAVA_ID=$(cat /run/secrets/auth_strava_id) && \
    export AUTH_STRAVA_SECRET=$(cat /run/secrets/auth_strava_client_secret) && \
    export AUTH_URL=$(cat /run/secrets/auth_url) && \
    export MONGODB_URI=$(cat /run/secrets/mongodb_uri) && \
    export MONGODB_NAME=$(cat /run/secrets/mongodb_name) && \
    export NEXT_PUBLIC_BASE_URL=$(cat /run/secrets/next_public_base_url) && \
    npm run build && \
    npx tsc --project tsconfig.json # Compile WebJob files

# Production image, copy all files
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy Next.js build output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy WebJob build output
COPY --from=builder /app/dist/webjob ./webjob
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Set permissions
RUN chown nextjs:nodejs .next

USER nextjs

# Expose the Next.js port
EXPOSE 3000

# Set environment variables
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Install Supervisor to manage processes
USER root
RUN apk add --no-cache supervisor

# Copy Supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Run Supervisor to manage both processes
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]