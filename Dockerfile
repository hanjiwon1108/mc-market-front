FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# corepack 활성화 및 검증 비활성화
RUN corepack enable
RUN npm config set strict-ssl false

# 필수 패키지 설치
RUN apk add git make

# 작업 디렉토리 설정
WORKDIR /app
COPY . /app

# 의존성 설치 단계 (프로덕션)
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --no-verify-store-integrity || true

# 빌드 단계
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --no-verify-store-integrity || true
RUN pnpm run build || true

# 최종 실행 단계
FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/.next /app/.next

# 포트 공개
EXPOSE 3000

# 환경 변수 설정
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 서버 시작
CMD ["pnpm", "start"]
