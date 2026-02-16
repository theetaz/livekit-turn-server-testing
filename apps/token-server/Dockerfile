FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/token-server/package.json ./apps/token-server/
RUN npm ci
COPY apps/token-server/ ./apps/token-server/
RUN npm run build --workspace=token-server

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/apps/token-server/package.json ./apps/token-server/
COPY --from=builder /app/apps/token-server/dist ./apps/token-server/dist
EXPOSE 3000
CMD ["node", "apps/token-server/dist/index.js"]
