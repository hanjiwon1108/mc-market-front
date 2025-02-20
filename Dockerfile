# 1️⃣ Base 이미지 설정
FROM node:18-alpine AS base

# 환경 변수 설정
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Corepack 대신 pnpm 직접 설치 (Corepack 비활성화)
RUN npm install -g pnpm && pnpm --version

# 필수 패키지 설치
RUN apk add --no-cache git make

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 pnpm-lock.yaml 복사 후 의존성 설치 (캐싱 최적화)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile || pnpm install --no-frozen-lockfile

# 전체 프로젝트 파일 복사
COPY . .

# 2️⃣ Build 단계
FROM base AS build
RUN pnpm run build

# 3️⃣ Production 실행 단계
FROM node:18-alpine AS runner

# 환경 변수 설정
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 파일들만 복사하여 최적화
COPY --from=base /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json

# 포트 개방
EXPOSE 3000

# Next.js 실행
CMD ["pnpm", "start"]
