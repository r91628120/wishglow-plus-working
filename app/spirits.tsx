import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { SPIRIT_CATALOG } from '@/constants/progression';
import { SpiritCard } from '@/components/growth/SpiritCard';
import { colors } from '@/constants/colors';
import { useI18n } from '@/constants/translations';

export default function SpiritsScreen() {
  const { growth } = useAppStore();
  const { t } = useI18n();
  const ownedIds = new Set(growth.discoveredSpiritIds);
  const ownedSpirits = SPIRIT_CATALOG.filter(spirit => ownedIds.has(spirit.id));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('spirits.title')}</Text>
      <Text style={styles.subtitle}>{t('spirits.spirit_count', { count: ownedSpirits.length })}</Text>
      {ownedSpirits.length ? (
        ownedSpirits.map(spirit => <SpiritCard key={spirit.id} spirit={spirit} owned />)
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>{t('spirits.empty_state')}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F6FF' },
  content: { padding: 16, paddingBottom: 30 },
  title: { fontSize: 28, fontWeight: '900', color: colors.text },
  subtitle: { marginTop: 8, marginBottom: 18, color: colors.textLight },
  emptyCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18 },
  emptyText: { color: colors.textLight, lineHeight: 20 },
});
