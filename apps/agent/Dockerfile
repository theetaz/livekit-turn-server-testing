FROM node:20-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/agent/ ./apps/agent/
COPY apps/token-server/package.json ./apps/token-server/
RUN npm install --workspace=agent
RUN npm run build --workspace=agent

FROM node:20-slim
RUN apt-get update && apt-get install -y --no-install-recommends libglib2.0-0 ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/apps/agent/package.json ./apps/agent/
COPY --from=builder /app/apps/agent/dist ./apps/agent/dist
COPY --from=builder /app/apps/agent/node_modules ./apps/agent/node_modules
CMD ["node", "apps/agent/dist/main.js", "start"]
