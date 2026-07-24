import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { StatsChart } from '@/components/StatsChart';
import { useI18n } from '@/constants/translations';

export default function StatsScreen() {
  const { t } = useI18n();
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'monthly' | 'yearly'>('daily');

  const periods: { key: 'daily' | 'monthly' | 'yearly'; label: string }[] = [
    { key: 'daily', label: t('stats.day') },
    { key: 'monthly', label: t('stats.month') },
    { key: 'yearly', label: t('stats.year') },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {periods.map(period => (
          <Pressable
            key={period.key}
            style={[styles.tabButton, selectedPeriod === period.key && styles.activeTabButton]}
            onPress={() => setSelectedPeriod(period.key)}
          >
            <Text style={[styles.tabText, selectedPeriod === period.key && styles.activeTabText]}>
              {period.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.chartContainer}>
        <StatsChart period={selectedPeriod} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{t('stats.info')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: colors.border,
    padding: 4,
  },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTabButton: { backgroundColor: colors.primary },
  tabText: { fontSize: 16, color: colors.textLight, fontWeight: '500' },
  activeTabText: { color: colors.background, fontWeight: 'bold' },
  chartContainer: { flex: 1 },
  infoContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    backgroundColor: `${colors.primary}10`,
    borderRadius: 16,
  },
  infoText: { fontSize: 14, color: colors.text, textAlign: 'center' },
});
