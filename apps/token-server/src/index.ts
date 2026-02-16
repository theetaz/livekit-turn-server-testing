import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  AccessToken,
  RoomAgentDispatch,
  RoomConfiguration,
} from 'livekit-server-sdk';

dotenv.config();

const AGENT_NAME = process.env.AGENT_NAME ?? 'english-teacher';

const app = express();
const port = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.post('/token', async (req, res) => {
  try {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const serverUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !serverUrl) {
      res.status(500).json({ error: 'Server misconfigured: missing LiveKit credentials' });
      return;
    }

    const body = req.body as Record<string, unknown>;
    const roomName =
      (body.room_name as string) || (body.roomName as string) || 'english-coach-room';
    const participantIdentity =
      (body.participant_identity as string) ||
      (body.participantIdentity as string) ||
      `user-${Date.now()}`;
    const participantName =
      (body.participant_name as string) ||
      (body.participantName as string) ||
      participantIdentity;

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantIdentity,
      name: participantName,
      ttl: '10m',
    });
    at.addGrant({ roomJoin: true, room: roomName });

    at.roomConfig = new RoomConfiguration({
      agents: [
        new RoomAgentDispatch({
          agentName: AGENT_NAME,
          metadata: JSON.stringify({ participantIdentity, participantName }),
        }),
      ],
    });

    const participantToken = await at.toJwt();

    res.status(201).json({
      server_url: serverUrl,
      participant_token: participantToken,
    });
  } catch (err) {
    console.error('Token generation failed:', err);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

app.listen(port, () => {
  console.log(`Token server listening on port ${port}`);
});
