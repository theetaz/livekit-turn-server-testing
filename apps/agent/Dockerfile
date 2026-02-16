FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/agent/ ./apps/agent/
COPY apps/token-server/package.json ./apps/token-server/
RUN npm install --workspace=agent
RUN npm run build --workspace=agent

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/apps/agent/package.json ./apps/agent/
COPY --from=builder /app/apps/agent/dist ./apps/agent/dist
COPY --from=builder /app/apps/agent/node_modules ./apps/agent/node_modules
CMD ["node", "apps/agent/dist/main.js", "start"]
