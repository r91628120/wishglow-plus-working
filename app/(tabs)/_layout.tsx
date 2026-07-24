import React from 'react';
import { Tabs } from 'expo-router';
import { Home, BarChart2, Gamepad2, Settings, Sparkles, Orbit } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAppStore } from '@/store/useAppStore';
import { useI18n } from '@/constants/translations';
import { triggerTabHaptic } from '@/utils/haptics';

export default function TabLayout() {
  const { settings } = useAppStore();
  const { t } = useI18n();

  const handleTabPress = () => {
    triggerTabHaptic(settings.vibration).catch(() => {});
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: t('nav.home'), tabBarIcon: ({ color }) => <Home size={24} color={color} /> }}
        listeners={{ tabPress: handleTabPress }}
      />
      <Tabs.Screen
        name="stats"
        options={{ title: t('nav.stats'), tabBarIcon: ({ color }) => <BarChart2 size={24} color={color} /> }}
        listeners={{ tabPress: handleTabPress }}
      />
      <Tabs.Screen
        name="game"
        options={{ title: t('nav.game'), tabBarIcon: ({ color }) => <Gamepad2 size={24} color={color} /> }}
        listeners={{ tabPress: handleTabPress }}
      />
      <Tabs.Screen
        name="growth"
        options={{ title: t('nav.growth'), tabBarIcon: ({ color }) => <Sparkles size={24} color={color} /> }}
        listeners={{ tabPress: handleTabPress }}
      />
      <Tabs.Screen
        name="worlds"
        options={{ title: t('nav.world'), tabBarIcon: ({ color }) => <Orbit size={24} color={color} /> }}
        listeners={{ tabPress: handleTabPress }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: t('nav.settings'), tabBarIcon: ({ color }) => <Settings size={24} color={color} /> }}
        listeners={{ tabPress: handleTabPress }}
      />
    </Tabs>
  );
}
