# Base stage
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

# Copy dependency descriptor files first to leverage caching
COPY package.json pnpm-lock.yaml ./

# Stage for installing production dependencies
FROM base AS prod-deps
# 캐시 마운트 사용 (BuildKit 필요)
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --no-frozen-lockfile
# 이후 전체 소스를 복사하여 변경에 따른 최소 재설치를 유도
COPY . .

# Stage for building the application
FROM base AS build
COPY . .
ENV NODE_ENV=development
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --no-frozen-lockfile
RUN pnpm run build
RUN ls -al /app/.next  # 디버깅용

# Final stage for production
FROM base
ENV NODE_ENV=production
# 필요한 파일만 복사하여 경량화
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/.next /app/.next

EXPOSE 3000
CMD ["pnpm", "start"]
