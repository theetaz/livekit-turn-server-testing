#!/usr/bin/env node
/**
 * Test LiveKit server and TURN connectivity.
 * Run: node scripts/test-livekit.mjs
 * Requires: LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET in .env
 */

import { config } from 'dotenv';
import { AccessToken } from 'livekit-server-sdk';
import { Room, RoomEvent } from 'livekit-client';

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env') });

const LIVEKIT_URL = process.env.LIVEKIT_URL;
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;

async function generateToken() {
  if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    throw new Error('LIVEKIT_API_KEY and LIVEKIT_API_SECRET required');
  }
  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: `test-${Date.now()}`,
    name: 'test-client',
    ttl: '5m',
  });
  at.addGrant({ roomJoin: true, room: 'test-connectivity-room' });
  return at.toJwt();
}

async function testLiveKitConnection() {
  if (!LIVEKIT_URL) {
    throw new Error('LIVEKIT_URL required');
  }

  console.log('\n--- LiveKit + TURN Connectivity Test ---\n');
  console.log('LIVEKIT_URL:', LIVEKIT_URL);
  console.log('');

  const token = await generateToken();
  console.log('✓ Token generated');

  const room = new Room();

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      room.disconnect();
      reject(new Error('Connection timeout (15s)'));
    }, 15000);

    room.on(RoomEvent.Connected, async () => {
      clearTimeout(timeout);
      console.log('✓ Connected to LiveKit room');

      try {
        const pcManager = room.engine?.pcManager;
        const pc = pcManager?.subscriber ?? pcManager?.publisher;
        if (pc?.getStats) {
          const stats = await pc.getStats();
          stats.forEach((report) => {
            if (report.type === 'candidate-pair' && report.state === 'succeeded') {
              const local = stats.get(report.localCandidateId);
              const remote = stats.get(report.remoteCandidateId);
              const localType = local?.candidateType ?? 'unknown';
              const remoteType = remote?.candidateType ?? 'unknown';
              console.log('  ICE pair:', localType, '<->', remoteType);
              if (localType === 'relay' || remoteType === 'relay') {
                console.log('✓ TURN relay in use');
              } else {
                console.log('  (Direct/STUN - TURN not needed for this network)');
              }
            }
          });
        }
      } catch {
        // Stats not critical
      }
      room.disconnect();
      resolve();
    });

    room.on(RoomEvent.Disconnected, (reason) => {
      if (reason) console.log('Disconnected:', reason);
    });

    room.on(RoomEvent.ConnectionStateChanged, (state) => {
      console.log('  Connection state:', state);
    });

    room.connect(LIVEKIT_URL, token).catch((err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

testLiveKitConnection()
  .then(() => {
    console.log('\n✓ All checks passed\n');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n✗ Failed:', err.message);
    if (err.message.includes('LIVEKIT_')) {
      console.error('\nEnsure .env has LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET');
    }
    process.exit(1);
  });
