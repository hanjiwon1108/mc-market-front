FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN echo "Before: corepack version => $(corepack --version || echo 'not installed')" && \
    npm install -g corepack@latest && \
    echo "After : corepack version => $(corepack --version)" && \
    corepack enable && \
    pnpm --version
RUN apk add git make

# Set working directory
COPY . /app
WORKDIR /app

# Install dependencies (including devDependencies)
FROM base AS prod-deps
RUN pnpm install --no-frozen-lockfile  # `--mount=type=cache` 제거

FROM base AS build
ENV NODE_ENV=development
RUN pnpm install --no-frozen-lockfile  # `--mount=type=cache` 제거
RUN pnpm run build
RUN ls -al /app/.next  # 디버깅

FROM base

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/.next /app/.next

# Expose port
EXPOSE 3000

# Start the Node.js server
CMD ["pnpm", "start"]
