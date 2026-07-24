import React from 'react';
import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { colors } from '@/constants/colors';
import { affirmations } from '@/constants/affirmations';
import { formatDate, useI18n } from '@/constants/translations';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { AffirmationCard } from '@/components/AffirmationCard';
import { getSpiritBonuses } from '@/utils/progression';

export default function HomeScreen() {
  const router = useRouter();
  const { settings, todayCounts, growth } = useAppStore();
  const { language, t } = useI18n();
  const spiritBonuses = getSpiritBonuses(growth.ownedSpirits);
  const totalToday = Object.values(todayCounts).reduce((sum, count) => sum + count, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>{t('home.title')}</Text>
          <Text style={styles.date}>{formatDate(new Date(), language)}</Text>
        </View>
        <LanguageSwitcher />
      </View>

      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>{t('home.journey_start')}</Text>
        <View style={styles.todayCountContainer}>
          <Text style={styles.todayCountLabel}>{t('home.today_gain')}</Text>
          <Text style={styles.todayCount}>+{totalToday}</Text>
        </View>
      </View>

      <Pressable style={styles.growthBanner} onPress={() => router.push('/growth' as any)}>
        <View style={styles.growthBannerCopy}>
          <Text style={styles.growthBannerTitle}>Lv.{growth.level} {t(growth.title)}</Text>
          <Text style={styles.growthBannerText}>
            {t('growth.rewards_summary', {
              spirits: growth.discoveredSpiritIds.length,
              tickets: growth.spiritTickets,
              tapBonus: spiritBonuses.tapBonus,
            })}
          </Text>
          <Text style={styles.growthBannerHint}>{t('home.growth_card_desc')}</Text>
        </View>
        <Text style={styles.growthBannerAction}>{t('home.view_growth_center')}</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>{t('home.choose_affirmation')}</Text>

      <FlatList
        data={affirmations}
        renderItem={({ item }) => <AffirmationCard affirmation={item} />}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.affirmationsContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  date: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  welcomeContainer: {
    marginTop: 24,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: `${colors.primary}10`,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  growthBanner: {
    marginTop: 16,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: '#FFF5E6',
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  growthBannerCopy: {
    flex: 1,
  },
  growthBannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  growthBannerText: {
    marginTop: 6,
    color: colors.text,
  },
  growthBannerHint: {
    marginTop: 6,
    color: colors.textLight,
    fontSize: 12,
  },
  growthBannerAction: {
    color: colors.primary,
    fontWeight: '900',
  },
  todayCountContainer: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    marginLeft: 16,
  },
  todayCountLabel: {
    fontSize: 12,
    color: colors.background,
  },
  todayCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.background,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  affirmationsContainer: {
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
});
