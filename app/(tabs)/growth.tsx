import React, { useMemo } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import {
  ACHIEVEMENT_CATALOG,
  DRAW_COST_ENERGY,
  MIRACLE_EVENTS,
  SPIRIT_CATALOG,
  WORLD_CATALOG,
} from '@/constants/progression';
import { useAppStore } from '@/store/useAppStore';
import { DashboardCard } from '@/components/growth/DashboardCard';
import { TaskCard } from '@/components/growth/TaskCard';
import { getLevelFromXp, getSpiritBonuses } from '@/utils/progression';
import { triggerLightHaptic, triggerSuccessHaptic } from '@/utils/haptics';
import { useI18n } from '@/constants/translations';

const spiritNameKey = (id: string) => `spirits.names.${id}`;
const spiritDescriptionKey = (id: string) => `spirits.descriptions.${id}`;
const worldNameKey = (id: string) =>
  ({
    starterGarden: 'world.names.beginner_garden',
    forestWorld: 'world.names.forest',
    rainbowSky: 'world.names.rainbow_city',
    lightTemple: 'world.names.temple',
    cosmicCenter: 'world.names.cosmic_core',
  }[id] ?? 'world.title');
const miracleTitleKey = (id: string) =>
  ({
    doubleEnergy: 'growth.miracles.double_energy.title',
    critBoost: 'growth.miracles.crit_boost.title',
    freeSpiritDraw: 'growth.miracles.free_spirit_draw.title',
    goldenAura: 'growth.miracles.golden_aura.title',
  }[id] ?? 'growth.title');
const miracleDescriptionKey = (id: string) =>
  ({
    doubleEnergy: 'growth.miracles.double_energy.description',
    critBoost: 'growth.miracles.crit_boost.description',
    freeSpiritDraw: 'growth.miracles.free_spirit_draw.description',
    goldenAura: 'growth.miracles.golden_aura.description',
  }[id] ?? 'growth.center');
const achievementTitleKey = (id: string) =>
  ({
    'tap-1000': 'growth.achievements.tap_1000.title',
    'spirits-5': 'growth.achievements.spirits_5.title',
    'level-5': 'growth.achievements.level_5.title',
    'miracle-10': 'growth.achievements.miracle_10.title',
  }[id] ?? 'growth.ranking_title');
const achievementDescriptionKey = (id: string) =>
  ({
    'tap-1000': 'growth.achievements.tap_1000.description',
    'spirits-5': 'growth.achievements.spirits_5.description',
    'level-5': 'growth.achievements.level_5.description',
    'miracle-10': 'growth.achievements.miracle_10.description',
  }[id] ?? 'growth.ranking_desc');

export default function GrowthScreen() {
  const router = useRouter();
  const {
    settings,
    growth,
    dailyPoints,
    claimDailyTask,
    drawSpirit,
    setActiveWorld,
    shareMiracle,
    clearDrawResult,
  } = useAppStore();
  const { t } = useI18n();

  const world = WORLD_CATALOG.find(item => item.id === growth.activeWorldId) ?? WORLD_CATALOG[0];
  const miracle = MIRACLE_EVENTS.find(item => item.id === growth.activeMiracleEvent);
  const spiritBonuses = getSpiritBonuses(growth.ownedSpirits);
  const levelInfo = getLevelFromXp(growth.frequencyXp);
  const ownedSpiritCount = growth.discoveredSpiritIds.length;
  const levelProgress =
    levelInfo.nextThreshold > levelInfo.previousThreshold
      ? ((growth.frequencyXp - levelInfo.previousThreshold) /
          (levelInfo.nextThreshold - levelInfo.previousThreshold)) *
        100
      : 100;

  const drawResultSpirit = useMemo(
    () => SPIRIT_CATALOG.find(spirit => spirit.id === growth.lastDrawSpiritId),
    [growth.lastDrawSpiritId]
  );

  const handleShareMiracle = async () => {
    if (!miracle) {
      return;
    }

    await Share.share({
      message: `${t('home.title')}: ${t(miracleTitleKey(miracle.id))} - ${t(miracleDescriptionKey(miracle.id))}`,
    }).catch(() => {});

    shareMiracle();
    triggerSuccessHaptic(settings.vibration).catch(() => {});
  };

  return (
    <LinearGradient colors={world.colors} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>{t('growth.title')}</Text>
        <Text style={styles.pageSubtitle}>{t('growth.center')}</Text>

        <DashboardCard
          title={`Lv.${growth.level} ${t('growth.energy_flow')}`}
          subtitle={t('growth.level_status')}
          accent={world.particleColor}
        >
          <Text style={styles.bigNumber}>{growth.frequencyXp} XP</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min(100, levelProgress)}%` }]} />
          </View>
          <Text style={styles.helperText}>
            {t('growth.to_next_level', {
              points: Math.max(levelInfo.nextThreshold - growth.frequencyXp, 0),
            })}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>{growth.energyBank}</Text>
              <Text style={styles.miniStatLabel}>{t('game.gain_energy')}</Text>
            </View>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>{growth.spiritTickets}</Text>
              <Text style={styles.miniStatLabel}>{t('spirits.draw_ticket')}</Text>
            </View>
            <View style={[styles.miniStat, styles.lastMiniStat]}>
              <Text style={styles.miniStatValue}>{dailyPoints}</Text>
              <Text style={styles.miniStatLabel}>{t('game.today_points')}</Text>
            </View>
          </View>
        </DashboardCard>

        {growth.lastLevelUp ? (
          <DashboardCard
            title={`${t('growth.level_up_reward_title')}: Lv.${growth.lastLevelUp.level}`}
            subtitle={t(growth.lastLevelUp.title)}
            accent="#FFD76A"
          >
            <Text style={styles.helperText}>
              {growth.lastLevelUp.rewards.spiritId
                ? t('growth.unlocked_spirit_reward', {
                    name: t(spiritNameKey(growth.lastLevelUp.rewards.spiritId)),
                  })
                : t('growth.level_up_reward_fallback')}
            </Text>
            <Pressable
              onPress={() => {
                useAppStore.getState().acknowledgeLevelUp();
                triggerSuccessHaptic(settings.vibration).catch(() => {});
              }}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>{t('common.confirm')}</Text>
            </Pressable>
          </DashboardCard>
        ) : null}

        <DashboardCard title={t('growth.missions_title')} subtitle={t('growth.missions_desc')} accent="#7ED7FF">
          {growth.daily.tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onClaim={() => {
                claimDailyTask(task.id);
                triggerSuccessHaptic(settings.vibration).catch(() => {});
              }}
            />
          ))}
        </DashboardCard>

        <DashboardCard title={t('game.miracle')} subtitle={t('growth.miracle_desc')} accent={miracle?.accent ?? '#FFE27A'}>
          {miracle ? (
            <>
              <Text style={styles.miracleTitle}>{t(miracleTitleKey(miracle.id))}</Text>
              <Text style={styles.helperText}>{t(miracleDescriptionKey(miracle.id))}</Text>
              <Pressable style={styles.secondaryButton} onPress={handleShareMiracle}>
                <Text style={styles.secondaryButtonText}>{t('common.view')}</Text>
              </Pressable>
            </>
          ) : (
            <Text style={styles.helperText}>{t('common.coming_soon')}</Text>
          )}
        </DashboardCard>

        <DashboardCard
          title={t('growth.spirits_title')}
          subtitle={t('growth.spirits_desc', {
            owned: ownedSpiritCount,
            total: SPIRIT_CATALOG.length,
          })}
          accent="#FF8FD1"
        >
          <Text style={styles.helperText}>
            {t('growth.rewards_summary', {
              tapBonus: spiritBonuses.tapBonus,
              spirits: ownedSpiritCount,
              tickets: growth.spiritTickets,
              critBonus: spiritBonuses.critBonus,
            })}
          </Text>
          <View style={styles.buttonGrid}>
            <Pressable
              style={styles.primaryButton}
              onPress={() => {
                drawSpirit('energy');
                triggerLightHaptic(settings.vibration).catch(() => {});
              }}
            >
              <Text style={styles.primaryButtonText}>{t('growth.draw_with_energy', { cost: DRAW_COST_ENERGY })}</Text>
            </Pressable>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => {
                drawSpirit('ticket');
                triggerLightHaptic(settings.vibration).catch(() => {});
              }}
            >
              <Text style={styles.secondaryButtonText}>{t('growth.draw_with_ticket')}</Text>
            </Pressable>
          </View>
          <View style={styles.buttonGrid}>
            <Pressable style={styles.secondaryButton} onPress={() => router.push('/spirits' as any)}>
              <Text style={styles.secondaryButtonText}>{t('growth.view_spirits')}</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => router.push('/spirit-codex' as any)}>
              <Text style={styles.secondaryButtonText}>{t('growth.view_codex')}</Text>
            </Pressable>
          </View>
          {drawResultSpirit ? (
            <View style={styles.drawResult}>
              <Text style={styles.drawResultTitle}>
                {t('growth.draw_result', { name: t(spiritNameKey(drawResultSpirit.id)) })}
              </Text>
              <Text style={styles.helperText}>{t(spiritDescriptionKey(drawResultSpirit.id))}</Text>
              <Pressable style={styles.secondaryButton} onPress={clearDrawResult}>
                <Text style={styles.secondaryButtonText}>{t('common.close')}</Text>
              </Pressable>
            </View>
          ) : null}
        </DashboardCard>

        <DashboardCard title={t('growth.worlds_title')} subtitle={t('growth.worlds_desc')} accent="#71E6C4">
          {WORLD_CATALOG.map(item => {
            const unlocked = growth.unlockedWorldIds.includes(item.id);
            const active = growth.activeWorldId === item.id;

            return (
              <Pressable
                key={item.id}
                style={[styles.worldItem, !unlocked && styles.worldItemLocked, active && styles.worldItemActive]}
                disabled={!unlocked}
                onPress={() => {
                  setActiveWorld(item.id);
                  triggerLightHaptic(settings.vibration).catch(() => {});
                }}
              >
                <View style={styles.worldInfo}>
                  <Text style={styles.worldName}>{t(worldNameKey(item.id))}</Text>
                  <Text style={styles.worldMeta}>{t('world.unlocks_at_level', { level: item.unlockLevel })}</Text>
                </View>
                <Text style={styles.worldStatus}>
                  {active
                    ? t('world.current')
                    : unlocked
                      ? t('world.available')
                      : t('world.locked')}
                </Text>
              </Pressable>
            );
          })}
        </DashboardCard>

        <DashboardCard title={t('growth.ranking_title')} subtitle={t('growth.ranking_desc')} accent="#B39DFF">
          {ACHIEVEMENT_CATALOG.map(definition => {
            const progress = growth.achievements.find(item => item.id === definition.id);
            return (
              <View key={definition.id} style={styles.achievementItem}>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{t(achievementTitleKey(definition.id))}</Text>
                  <Text style={styles.worldMeta}>{t(achievementDescriptionKey(definition.id))}</Text>
                </View>
                <Text style={[styles.worldStatus, progress?.unlocked && styles.unlockedText]}>
                  {progress?.unlocked ? t('common.unlocked') : t('common.locked')}
                </Text>
              </View>
            );
          })}
          <Pressable style={styles.secondaryButton} onPress={() => router.push('/leaderboards' as any)}>
            <Text style={styles.secondaryButtonText}>{t('growth.view_ranking')}</Text>
          </Pressable>
        </DashboardCard>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  pageTitle: { fontSize: 28, fontWeight: '900', color: colors.text },
  pageSubtitle: { marginTop: 8, marginBottom: 18, color: colors.textLight, lineHeight: 20 },
  bigNumber: { fontSize: 34, fontWeight: '900', color: colors.text },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: '#E8E0FF',
    overflow: 'hidden',
    marginTop: 12,
  },
  progressFill: { height: '100%', borderRadius: 999, backgroundColor: colors.primary },
  helperText: { marginTop: 10, color: colors.textLight, lineHeight: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  miniStat: {
    flex: 1,
    backgroundColor: `${colors.primary}12`,
    borderRadius: 16,
    padding: 12,
    marginRight: 10,
  },
  lastMiniStat: { marginRight: 0 },
  miniStatValue: { fontSize: 22, fontWeight: '900', color: colors.text },
  miniStatLabel: { marginTop: 4, color: colors.textLight, fontSize: 12 },
  miracleTitle: { fontSize: 24, fontWeight: '900', color: colors.text, marginBottom: 8 },
  buttonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignSelf: 'flex-start',
  },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '800' },
  secondaryButton: {
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-start',
  },
  secondaryButtonText: { color: colors.text, fontWeight: '700' },
  drawResult: { marginTop: 16, backgroundColor: '#FFF9E8', borderRadius: 18, padding: 16 },
  drawResultTitle: { fontSize: 18, fontWeight: '900', color: colors.text },
  worldItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  worldItemLocked: { opacity: 0.5 },
  worldItemActive: { borderColor: colors.primary },
  worldInfo: { flex: 1, marginRight: 12 },
  worldName: { fontSize: 16, fontWeight: '800', color: colors.text },
  worldMeta: { marginTop: 4, color: colors.textLight, fontSize: 12 },
  worldStatus: { color: colors.textLight, fontWeight: '700' },
  unlockedText: { color: '#4CAF50' },
  achievementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEAFD',
  },
  achievementInfo: { flex: 1, marginRight: 12 },
  achievementTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
});
