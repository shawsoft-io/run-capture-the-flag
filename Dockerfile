# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
 
# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
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
 
# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1
 
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
    npm run build
 
# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
 
ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1
 
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
 
COPY --from=builder /app/public ./public
 
# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next
 
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
 
USER nextjs
 
EXPOSE 3000
 
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
 
# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]