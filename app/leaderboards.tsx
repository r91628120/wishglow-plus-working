import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { colors } from '@/constants/colors';
import { LeaderboardType } from '@/types';
import { useI18n } from '@/constants/translations';

export default function LeaderboardsScreen() {
  const { growth } = useAppStore();
  const { t } = useI18n();
  const [selectedTab, setSelectedTab] = useState<LeaderboardType>('today');

  const tabs: Array<{ key: LeaderboardType; label: string }> = [
    { key: 'today', label: t('common.today') },
    { key: 'week', label: t('stats.week') },
    { key: 'friends', label: t('growth.ranking_title') },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('growth.ranking_title')}</Text>
      <Text style={styles.subtitle}>{t('growth.ranking_desc')}</Text>

      <View style={styles.tabRow}>
        {tabs.map(tab => (
          <Pressable
            key={tab.key}
            onPress={() => setSelectedTab(tab.key)}
            style={[styles.tabButton, selectedTab === tab.key && styles.tabButtonActive]}
          >
            <Text style={[styles.tabText, selectedTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>

      {growth.leaderboards[selectedTab].map((entry, index) => (
        <View key={`${selectedTab}-${entry.id}`} style={[styles.row, entry.isPlayer && styles.rowActive]}>
          <Text style={styles.rank}>#{index + 1}</Text>
          <View style={styles.nameBlock}>
            <Text style={styles.name}>{entry.name}</Text>
            <Text style={styles.score}>
              {entry.score} {t('game.gain_points')}
            </Text>
          </View>
          <Text style={styles.badge}>{entry.isPlayer ? t('common.current') : 'NPC'}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFF',
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 18,
    color: colors.textLight,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#EDE7FF',
    padding: 4,
    borderRadius: 999,
    marginBottom: 18,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 999,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.textLight,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  row: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rowActive: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  rank: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    width: 48,
  },
  nameBlock: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  score: {
    marginTop: 4,
    color: colors.textLight,
  },
  badge: {
    color: colors.primary,
    fontWeight: '800',
  },
});
