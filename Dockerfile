# 1️⃣ 빌드 단계
FROM node:18-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 lock 파일을 복사
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# 의존성 설치
RUN pnpm install --frozen-lockfile

# 전체 소스 코드 복사
COPY . .

# Next.js 애플리케이션 빌드
RUN pnpm run build

# 2️⃣ 실행 단계
FROM node:18-alpine AS runner

# 환경 변수 설정
ENV NODE_ENV=production

# 작업 디렉토리 설정
WORKDIR /app

# 빌드된 파일 및 node_modules만 복사
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# 포트 개방
EXPOSE 3000

# Next.js 실행
CMD ["npm", "run", "start"]
