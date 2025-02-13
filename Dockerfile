# Use official Node.js LTS image
FROM node:18-alpine AS base

# Set environment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@8.6.0 --activate

# Install required packages
RUN apk add --no-cache git make

# Set working directory
WORKDIR /app

# Copy package manager files first to optimize caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies separately
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --no-frozen-lockfile

FROM base AS build
# Ensure non-prod dependencies are also installed
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --no-frozen-lockfile
COPY . .
ENV NODE_ENV=production
RUN pnpm run build

FROM base

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/.next /app/.next

# Expose port
EXPOSE 3000

# Start the Node.js server
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["pnpm", "start"]
