import { Redirect } from 'expo-router';

// Redirect to the game tab
export default function GameRedirect() {
  return <Redirect href="/(tabs)/game" />;
}