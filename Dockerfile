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
WORKDIR /app
COPY . .

# Install dependencies (include dev dependencies)
RUN pnpm install --no-frozen-lockfile

# Expose port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run Next.js in development mode (no build)
CMD ["pnpm", "dev"]
