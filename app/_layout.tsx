import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useAppStore } from '@/store/useAppStore';
import { normalizeLanguage, t } from '@/constants/translations';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    const hydrate = async () => {
      try {
        await useAppStore.persist.rehydrate();
      } catch (rehydrateError) {
        console.warn('Rehydration error:', rehydrateError);
      }
    };

    hydrate();
  }, []);

  useEffect(() => {
    if (error) {
      console.warn('Font loading error:', error);
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const language = useAppStore(state => normalizeLanguage(state.settings.language));

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerBackTitle: t('nav.back', language),
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#8A6FE8',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: t('home.title', language) }} />
        <Stack.Screen name="affirmation" options={{ presentation: 'card', title: t('home.title', language) }} />
        <Stack.Screen name="wishonia-story" options={{ presentation: 'card', title: t('nav.wishonia_story', language) }} />
        <Stack.Screen name="wish-star-box" options={{ presentation: 'card', title: t('nav.wish_star_box', language) }} />
        <Stack.Screen name="spirits" options={{ presentation: 'card', title: t('nav.spirits', language) }} />
        <Stack.Screen name="spirit-codex" options={{ presentation: 'card', title: t('nav.spirit_codex', language) }} />
        <Stack.Screen name="leaderboards" options={{ presentation: 'card', title: t('nav.leaderboards', language) }} />
      </Stack>
    </>
  );
}
