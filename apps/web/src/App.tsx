import { useCallback, useMemo, useState } from 'react';
import { TokenSource } from 'livekit-client';
import { SessionProvider, useSession, RoomAudioRenderer, useAgent } from '@livekit/components-react';

const TOKEN_SERVER_URL =
  import.meta.env.VITE_TOKEN_SERVER_URL ?? 'https://token.livekit.nipuntheekshana.com';
const agentName = import.meta.env.VITE_AGENT_NAME ?? 'english-teacher';
const roomName = `coach-${Date.now()}`;

function VoiceTest() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tokenSource = useMemo(
    () => TokenSource.endpoint(`${TOKEN_SERVER_URL}/token`),
    []
  );

  const session = useSession(tokenSource, { roomName, agentName });
  const { start, end } = session;

  const connect = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      await start();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  }, [start]);

  const disconnect = useCallback(() => {
    end();
  }, [end]);

  return (
    <SessionProvider session={session}>
      <RoomView
        session={session}
        isConnecting={isConnecting}
        error={error}
        onConnect={connect}
        onDisconnect={disconnect}
      />
    </SessionProvider>
  );
}

function RoomView({
  session,
  isConnecting,
  error,
  onConnect,
  onDisconnect,
}: {
  session: ReturnType<typeof useSession>;
  isConnecting: boolean;
  error: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  const agent = useAgent();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <RoomAudioRenderer />

      <h1 style={{ margin: 0, fontSize: 24 }}>LiveKit Voice Test</h1>
      <p style={{ color: '#888', margin: 0, fontSize: 13 }}>
        Token: {TOKEN_SERVER_URL} | Room: {roomName} | Agent: {agentName}
      </p>

      {error && <p style={{ color: '#ff6b6b', margin: 0 }}>{error}</p>}

      {!session.isConnected ? (
        <button
          onClick={onConnect}
          disabled={isConnecting}
          style={{
            padding: '12px 24px',
            fontSize: 16,
            background: '#002CF2',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            cursor: isConnecting ? 'wait' : 'pointer',
          }}
        >
          {isConnecting ? 'Connecting...' : 'Connect'}
        </button>
      ) : (
        <>
          <div style={{ padding: 16, background: '#1a1b1e', borderRadius: 12, minWidth: 280 }}>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Connected</strong>
            </p>
            <p style={{ margin: 0, color: '#888', fontSize: 14 }}>
              Agent: {agent.agentState ?? '—'}
            </p>
          </div>
          <button
            onClick={onDisconnect}
            style={{
              padding: '12px 24px',
              fontSize: 16,
              background: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
            }}
          >
            Disconnect
          </button>
        </>
      )}
    </div>
  );
}

export default function App() {
  return <VoiceTest />;
}
