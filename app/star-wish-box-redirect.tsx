import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';

// This is a simple redirect component to handle navigation to the Star Wish Box
export default function StarWishBoxRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the Star Wish Box screen
    router.replace('/star-wish-box');
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}