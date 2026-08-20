# syntax=docker/dockerfile:1

##############################
# Stage 1 — build with Bun
##############################
FROM node:22-alpine AS builder

# Bun needs bash/libstdc++ on Alpine
RUN apk add --no-cache bash curl unzip libstdc++ \
  && curl -fsSL https://bun.sh/install | bash
ENV BUN_INSTALL=/root/.bun
ENV PATH="/root/.bun/bin:${PATH}"

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build the app as a standalone Node (Nitro) server
COPY . .
ENV NODE_ENV=production
ENV NITRO_PRESET=node-server
# Set when the app is served under a sub-path by a reverse proxy / ZTA tunnel,
# e.g. --build-arg APP_BASE_PATH=/catalytic/. Leave empty when served at root.
ARG APP_BASE_PATH=
ENV APP_BASE_PATH=${APP_BASE_PATH}
RUN bun run build

##############################
# Stage 2 — runtime (Node 22)
##############################
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# The Nitro node-server output is fully self-contained:
# .output/server (bundled server + deps) and .output/public (static assets).
COPY --from=builder /app/.output ./.output

USER node
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
