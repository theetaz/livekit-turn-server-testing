import { TokenSource } from 'livekit-client';
import { createContext, useContext, useMemo, useState } from 'react';
import { SessionProvider, useSession } from '@livekit/components-react';
import { AudioSession } from '@livekit/react-native';

const TOKEN_SERVER_URL = process.env.EXPO_PUBLIC_TOKEN_SERVER_URL ?? 'http://localhost:3000';
const agentName = 'english-teacher';

interface ConnectionContextType {
  isConnectionActive: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const ConnectionContext = createContext<ConnectionContextType>({
  isConnectionActive: false,
  error: null,
  connect: () => Promise.resolve(),
  disconnect: () => {},
});

export function useConnection() {
  const ctx = useContext(ConnectionContext);
  if (!ctx) throw new Error('useConnection must be used within a ConnectionProvider');
  return ctx;
}

interface ConnectionProviderProps {
  children: React.ReactNode;
}

export function ConnectionProvider({ children }: ConnectionProviderProps) {
  const [isConnectionActive, setIsConnectionActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tokenSource = useMemo(
    () => TokenSource.endpoint(`${TOKEN_SERVER_URL}/token`),
    []
  );

  const session = useSession(tokenSource, {
    roomName: 'english-coach-room',
    agentName,
  });

  const { start: startSession, end: endSession } = session;

  const value = useMemo(
    () => ({
      isConnectionActive,
      error,
      connect: async () => {
        setError(null);
        setIsConnectionActive(true);
        try {
          await AudioSession.startAudioSession();
          await startSession();
        } catch (err) {
          setIsConnectionActive(false);
          setError(err instanceof Error ? err.message : 'Connection failed');
          throw err;
        }
      },
      disconnect: () => {
        setIsConnectionActive(false);
        setError(null);
        endSession();
        AudioSession.stopAudioSession();
      },
    }),
    [startSession, endSession, isConnectionActive, error]
  );

  return (
    <SessionProvider session={session}>
      <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>
    </SessionProvider>
  );
}
