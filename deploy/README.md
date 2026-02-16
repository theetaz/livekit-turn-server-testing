# Deployment Guide

## Quick Start (Docker)

```bash
# Create .env at project root with:
# LIVEKIT_URL=wss://livekit.yourdomain.com
# LIVEKIT_API_KEY=your-key
# LIVEKIT_API_SECRET=your-secret
# OPENAI_API_KEY=your-openai-key

# Build and run
docker compose up -d

# Token server: http://localhost:3000
# Agent: connects to LiveKit (no HTTP endpoint)
```

## Exposing Token Server Publicly

The **agent** connects outbound to LiveKit and OpenAI—it does not need a public URL. Only the **token server** must be reachable by the mobile app.

### Option 1: Direct Port (dev/testing)

If your server has a public IP:

```bash
docker compose up -d
# Token server at http://YOUR_SERVER_IP:3000
```

Set `EXPO_PUBLIC_TOKEN_SERVER_URL=http://YOUR_SERVER_IP:3000` in the mobile app. iOS may block HTTP; use Option 2 or 3 for HTTPS.

### Option 2: Nginx + Let's Encrypt (recommended)

1. Point a subdomain (e.g. `token.yourdomain.com`) to your server IP.

2. Obtain SSL certs:
```bash
# Install certbot, then:
sudo certbot certonly --standalone -d token.yourdomain.com
# Certs go to /etc/letsencrypt/live/token.yourdomain.com/
```

3. Copy certs for Docker:
```bash
mkdir -p deploy/certs
sudo cp /etc/letsencrypt/live/token.yourdomain.com/fullchain.pem deploy/certs/
sudo cp /etc/letsencrypt/live/token.yourdomain.com/privkey.pem deploy/certs/
sudo chown $USER:$USER deploy/certs/*
```

4. Update `deploy/nginx.conf` – replace `server_name _` with `server_name token.yourdomain.com`.

5. Run with nginx:
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

6. Set `EXPO_PUBLIC_TOKEN_SERVER_URL=https://token.yourdomain.com` in the mobile app.

### Option 3: Cloudflare Tunnel (no port opening)

1. Install [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/).

2. Create a tunnel and route `token.yourdomain.com` to `http://localhost:3000`.

3. No nginx or SSL config needed; Cloudflare handles HTTPS.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| LIVEKIT_URL | Yes | LiveKit server URL (e.g. wss://livekit.yourdomain.com) |
| LIVEKIT_API_KEY | Yes | LiveKit API key |
| LIVEKIT_API_SECRET | Yes | LiveKit API secret |
| OPENAI_API_KEY | Yes | OpenAI API key (agent only) |

## Renewing SSL (Option 2)

```bash
sudo certbot renew
sudo cp /etc/letsencrypt/live/token.yourdomain.com/*.pem deploy/certs/
docker compose -f docker-compose.yml -f docker-compose.prod.yml restart nginx
```
