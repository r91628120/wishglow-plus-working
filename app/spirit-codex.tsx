import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSpiritDexStore } from '@/store/useSpiritDexStore';
import { SpiritFilterBar } from '@/components/spirits/SpiritFilterBar';
import { SpiritDexCard } from '@/components/spirits/SpiritDexCard';
import { SpiritDetailModal } from '@/components/spirits/SpiritDetailModal';
import { SpiritDexEntry } from '@/types/spiritDex';
import { useI18n } from '@/constants/translations';

export default function SpiritCodexScreen() {
  const { t } = useI18n();
  const { spirits, collectedSpiritIds, selectedRarityFilter, setSelectedRarityFilter, selectSpiritCollectedState } =
    useSpiritDexStore();
  const [selectedSpirit, setSelectedSpirit] = useState<SpiritDexEntry | null>(null);

  const filteredSpirits = useMemo(
    () =>
      selectedRarityFilter === 'all'
        ? spirits
        : spirits.filter(spirit => spirit.rarity === selectedRarityFilter),
    [selectedRarityFilter, spirits]
  );

  return (
    <LinearGradient colors={['#191435', '#2A1F52', '#402D73']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>{t('spirits.codex_eyebrow')}</Text>
        <Text style={styles.title}>{t('spirits.codex_title')}</Text>
        <Text style={styles.subtitle}>
          {t('spirits.codex_desc', { owned: collectedSpiritIds.length, total: spirits.length })}
        </Text>

        <SpiritFilterBar selectedFilter={selectedRarityFilter} onSelect={setSelectedRarityFilter} />

        <View style={styles.grid}>
          {filteredSpirits.map(spirit => {
            const collected = selectSpiritCollectedState(spirit.id);
            return (
              <SpiritDexCard
                key={spirit.id}
                spirit={spirit}
                collected={collected}
                onPress={() => setSelectedSpirit(spirit)}
              />
            );
          })}
        </View>
      </ScrollView>

      <SpiritDetailModal
        spirit={selectedSpirit}
        collected={selectedSpirit ? selectSpiritCollectedState(selectedSpirit.id) : false}
        visible={!!selectedSpirit}
        onClose={() => setSelectedSpirit(null)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 36 },
  eyebrow: { color: '#C8BBFF', fontSize: 12, fontWeight: '800', letterSpacing: 1.4 },
  title: { marginTop: 6, color: '#FFFFFF', fontSize: 32, fontWeight: '900' },
  subtitle: { marginTop: 10, marginBottom: 18, color: 'rgba(255,255,255,0.76)', lineHeight: 21 },
  grid: { marginTop: 18, flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
});
