import { useConnection } from '@/hooks/useConnection';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

export default function StartScreen() {
  const router = useRouter();
  const { isConnectionActive, connect } = useConnection();

  useEffect(() => {
    if (isConnectionActive) router.navigate('../assistant');
  }, [isConnectionActive, router]);

  const connectText = isConnectionActive ? 'Connecting' : 'Start Voice Assistant';

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🎙️</Text>
      <Text style={styles.text}>Chat with your AI English teacher</Text>

      <TouchableOpacity
        onPress={() => connect()}
        style={styles.button}
        activeOpacity={0.7}
        disabled={isConnectionActive}
      >
        {isConnectionActive ? (
          <ActivityIndicator size="small" color="#ffffff" style={styles.activityIndicator} />
        ) : undefined}
        <Text style={styles.buttonText}>{connectText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#151718',
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  text: {
    color: '#ffffff',
    marginBottom: 24,
  },
  activityIndicator: {
    marginEnd: 8,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#002CF2',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  buttonText: {
    color: '#ffffff',
  },
});
