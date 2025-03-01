# syntax=docker/dockerfile:1

# Base image for the app
FROM node:20-alpine AS base
 
# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* path-auth0.js ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js
RUN --mount=type=secret,id=auth0_secret \
    --mount=type=secret,id=auth0_client_id \
    --mount=type=secret,id=auth0_client_secret \
    --mount=type=secret,id=auth0_domain \
    --mount=type=secret,id=app_base_url \
    --mount=type=secret,id=strava_verify_token \
    --mount=type=secret,id=mongodb_uri \
    --mount=type=secret,id=mongodb_name \
    --mount=type=secret,id=azure_storage_connection_string \
    --mount=type=secret,id=queue_name \
    --mount=type=secret,id=next_public_base_url \
    export AUTH0_SECRET=$(cat /run/secrets/auth0_secret) && \
    export AUTH0_CLIENT_ID=$(cat /run/secrets/auth0_client_id) && \
    export AUTH0_CLIENT_SECRET=$(cat /run/secrets/auth0_client_secret) && \
    export APP_BASE_URL=$(cat /run/secrets/app_base_url) && \
    export AUTH0_DOMAIN=$(cat /run/secrets/auth0_domain) && \
    export STRAVA_VERIFY_TOKEN=$(cat /run/secrets/strava_verify_token) && \
    export MONGODB_URI=$(cat /run/secrets/mongodb_uri) && \
    export MONGODB_NAME=$(cat /run/secrets/mongodb_name) && \
    export AZURE_STORAGE_CONNECTION_STRING=$(cat /run/secrets/azure_storage_connection_string) && \
    export QUEUE_NAME=$(cat /run/secrets/queue_name) && \
    export NEXT_PUBLIC_BASE_URL=$(cat /run/secrets/next_public_base_url) && \
    npm run build 



# Stage 2: Build .NET Worker Service
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS dotnet-build
WORKDIR /src
COPY webjob/ .
RUN dotnet publish -c Release -o /app/webjob


# Stage 3: Combine everything
FROM mcr.microsoft.com/dotnet/runtime:7.0 AS runtime
WORKDIR /app


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