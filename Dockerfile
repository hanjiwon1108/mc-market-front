# syntax=docker/dockerfile:1.4
FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN echo "Before: corepack version => $(corepack --version || echo 'not installed')" && \
    npm install -g corepack@latest && \
    echo "After : corepack version => $(corepack --version)" && \
    corepack enable && \
    pnpm --version

RUN apk add git make

WORKDIR /app
COPY . .

FROM base AS prod-deps
# Use BuildKit cache mount for the pnpm store to speed up dependency installs.
RUN --mount=type=cache,target=/pnpm/store \
    pnpm install --no-frozen-lockfile

FROM base AS build
ENV NODE_ENV=development
RUN --mount=type=cache,target=/pnpm/store \
    pnpm install --no-frozen-lockfile
RUN pnpm run build
RUN ls -al /app/.next

FROM base
ENV NODE_ENV=production
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/.next /app/.next

EXPOSE 3000
CMD ["pnpm", "start"]
