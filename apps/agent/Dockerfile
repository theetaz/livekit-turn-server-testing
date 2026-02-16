FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/agent/package.json ./apps/agent/
RUN npm ci
COPY apps/agent/ ./apps/agent/
RUN npm run build --workspace=agent

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/apps/agent/package.json ./apps/agent/
COPY --from=builder /app/apps/agent/dist ./apps/agent/dist
CMD ["node", "apps/agent/dist/main.js", "start"]
