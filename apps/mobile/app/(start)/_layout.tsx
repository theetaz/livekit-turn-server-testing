import { Stack } from 'expo-router';

export default function StartLayout() {
  const headerShown = false;
  return <Stack screenOptions={{ headerShown }} />;
}
