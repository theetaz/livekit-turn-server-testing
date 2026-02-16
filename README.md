# LiveKit Realtime Online Coach

A personal AI English teacher that helps you improve your English through real-time voice conversation. Monorepo built with React Native (Expo, latest), Node.js, and LiveKit — connecting to a self-hosted LiveKit server. TypeScript throughout.

## Features (Intended)

- **Real-time voice conversation** with an AI English teacher
- **Self-hosted LiveKit** — no dependency on LiveKit Cloud
- **Mobile-first** — React Native Expo app for iOS and Android
- **Teacher persona** — system prompt tuned for English improvement (pronunciation, grammar, vocabulary)

## Architecture

| Component | Role |
|-----------|------|
| **Mobile App** | React Native (Expo, latest), connects to LiveKit room, handles voice I/O |
| **Token Server** | Node.js API that issues LiveKit access tokens (PM2) |
| **AI Agent** | Node.js voice agent (LiveKit Agents JS) with English-teaching logic |
| **LiveKit Server** | Self-hosted on VPS; WebSocket + optional TURN |

## File Structure

Monorepo. TypeScript throughout.

```
livekit-realtime-online-coach/
├── docs/
│   ├── PROJECT_MEMORY.md   # Project memory (updates, structure, context)
│   └── plan.md             # Implementation plan
├── apps/
│   ├── mobile/             # React Native Expo app
│   ├── token-server/       # Node.js token generation backend
│   └── agent/              # LiveKit AI agent (Node.js)
└── README.md
```

## Getting Started

1. Ensure your LiveKit server is running on your VPS.
2. Set up the token server (`apps/token-server/`) with `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET`. Run with PM2.
3. Deploy the AI agent (`apps/agent/`) and point it at your LiveKit server.
4. Configure the mobile app (`apps/mobile/`) with the token server URL and LiveKit URL.
5. From repo root: `npm install`. For mobile: `cd apps/mobile && npx expo run:ios` or `npx expo run:android`.

See [docs/plan.md](docs/plan.md) for the full implementation plan.

## Changelog

| Date | Change |
|------|--------|
| 2025-02-15 | Project initialized. Documentation and plan created. |
| 2025-02-15 | Monorepo structure. Node.js for token server and agent. TypeScript throughout. |
| 2025-02-15 | Implementation complete. Mobile app, token server, and English-teacher agent. |

---

References: [agent-starter-react-native](https://github.com/livekit-examples/agent-starter-react-native), [agent-starter-node](https://github.com/livekit-examples/agent-starter-node).
