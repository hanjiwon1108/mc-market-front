FROM node:18-alpine AS builder
WORKDIR /app
# 필요한 글로벌 도구 설치 (pnpm 및 corepack)
RUN npm install -g corepack pnpm && corepack enable
# 의존성 설치 및 빌드 단계
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm run build

FROM node:18-alpine AS production
WORKDIR /app
# 빌드 산출물을 복사
COPY --from=builder /app . 
EXPOSE 3000
ENV NODE_ENV=production
CMD ["pnpm", "start"]
