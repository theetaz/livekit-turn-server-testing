import { Stack } from 'expo-router';

export default function AssistantLayout() {
  const headerShown = false;
  return <Stack screenOptions={{ headerShown }} />;
}
