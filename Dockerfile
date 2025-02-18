# 1️⃣ 빌드 환경 설정
FROM node:18-alpine AS builder

# 환경 변수 설정
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 작업 디렉토리 설정
WORKDIR /app

# pnpm 설치 (필요시 npm, yarn으로 변경 가능)
RUN npm install -g pnpm

# package.json, pnpm-lock.yaml만 복사하여 종속성 설치 최적화
COPY package.json pnpm-lock.yaml ./

# 의존성 설치
RUN pnpm install --frozen-lockfile

# 프로젝트 전체 복사
COPY . .

# Next.js 빌드 실행
RUN pnpm run build

---

# 2️⃣ 실행 환경 설정
FROM node:18-alpine AS runner

# 환경 변수 설정
ENV NODE_ENV=production

# 작업 디렉토리 설정
WORKDIR /app

# node_modules, .next 및 필요한 파일들만 복사
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

# 포트 노출
EXPOSE 3000

# Next.js 실행
CMD ["pnpm", "start"]
