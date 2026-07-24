import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';
import { WORLD_MAP_DATA } from '@/constants/worldMap';
import { WorldMapNode } from '@/components/worlds/WorldMapNode';
import { WorldDetailCard } from '@/components/worlds/WorldDetailCard';
import { useWorldMapStore } from '@/store/useWorldMapStore';
import { WorldMapWorld } from '@/types/worldMap';
import { triggerLightHaptic } from '@/utils/haptics';
import { useAppStore } from '@/store/useAppStore';
import { useI18n } from '@/constants/translations';

export default function WorldsScreen() {
  const { settings } = useAppStore();
  const { t } = useI18n();
  const { playerLevel, unlockedWorlds, currentWorld, setCurrentWorld } = useWorldMapStore();

  const worlds = useMemo<WorldMapWorld[]>(
    () =>
      WORLD_MAP_DATA.map(world => ({
        ...world,
        unlocked: unlockedWorlds.includes(world.id),
        isCurrent: currentWorld === world.id,
      })),
    [currentWorld, unlockedWorlds]
  );

  const [selectedWorldId, setSelectedWorldId] = useState(currentWorld);
  const selectedWorld = worlds.find(world => world.id === selectedWorldId) ?? worlds[0];

  const handleWorldPress = (world: WorldMapWorld) => {
    setSelectedWorldId(world.id);

    if (world.unlocked) {
      setCurrentWorld(world.id);
      triggerLightHaptic(settings.vibration).catch(() => {});
    }
  };

  return (
    <LinearGradient colors={['#130F2E', '#2A2050', '#3D2D66']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>{t('world.title')}</Text>
        <Text style={styles.title}>{t('nav.world')}</Text>
        <Text style={styles.subtitle}>{t('world.switch_desc')} Lv.{playerLevel}</Text>

        <View style={styles.mapShell}>
          <View style={styles.pathGlow} />
          <View style={styles.pathCore} />
          {worlds.map(world => (
            <WorldMapNode key={world.id} world={world} onPress={() => handleWorldPress(world)} />
          ))}
        </View>

        <WorldDetailCard world={selectedWorld} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 36 },
  eyebrow: { color: '#C9B9FF', fontSize: 12, fontWeight: '800', letterSpacing: 1.4 },
  title: { marginTop: 6, color: '#FFFFFF', fontSize: 32, fontWeight: '900' },
  subtitle: { marginTop: 10, color: 'rgba(255,255,255,0.75)', lineHeight: 21 },
  mapShell: {
    marginTop: 24,
    paddingVertical: 30,
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  pathGlow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 18,
    borderRadius: 999,
    backgroundColor: 'rgba(154,140,255,0.18)',
  },
  pathCore: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
    borderRadius: 999,
    backgroundColor: '#E9D8FF',
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 5,
  },
});
