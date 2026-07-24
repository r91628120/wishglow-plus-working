import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore, DAILY_POINTS_LIMIT } from '@/store/useAppStore';
import { colors } from '@/constants/colors';
import { useI18n } from '@/constants/translations';
import { PuzzlePreview } from '@/components/PuzzlePreview';
import { triggerLightHaptic } from '@/utils/haptics';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

let gameSoundObject: Audio.Sound | null = null;

if (Platform.OS !== 'web') {
  Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    interruptionModeIOS: 1,
    shouldDuckAndroid: false,
    interruptionModeAndroid: 1,
    playThroughEarpieceAndroid: false,
    allowsRecordingIOS: false,
  }).catch(error => {
    console.warn('Failed to configure game audio session:', error);
  });

  const preloadGameSound = async () => {
    try {
      gameSoundObject = new Audio.Sound();
      await gameSoundObject.loadAsync(require('@/assets/ding.mp3'));
    } catch (error) {
      console.warn('Failed to preload game sound:', error);
    }
  };

  preloadGameSound();
}

const playGameSound = async (soundEnabled: boolean) => {
  if (!soundEnabled || Platform.OS === 'web') {
    return;
  }

  try {
    if (!gameSoundObject) {
      gameSoundObject = new Audio.Sound();
      await gameSoundObject.loadAsync(require('@/assets/ding.mp3'));
    }

    const status = await gameSoundObject.getStatusAsync();
    if (!status.isLoaded) {
      await gameSoundObject.unloadAsync().catch(() => {});
      await gameSoundObject.loadAsync(require('@/assets/ding.mp3'));
    }

    await gameSoundObject.stopAsync().catch(() => {});
    await gameSoundObject.setPositionAsync(0).catch(() => {});
    await gameSoundObject.playAsync();
  } catch (error) {
    console.warn('Game sound playback error:', error);
  }
};

const triggerGameHaptic = async (vibrationEnabled: boolean) => {
  if (!vibrationEnabled || Platform.OS === 'web') {
    return;
  }

  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {
    console.warn('Game haptic feedback error:', error);
  }
};

export default function GameScreen() {
  const router = useRouter();
  const { settings, totalPoints, dailyPoints, carryOverPoints, puzzles, unlockPuzzlePiece } = useAppStore();
  const { t } = useI18n();
  const [canSpin, setCanSpin] = useState(false);
  const [spinReward, setSpinReward] = useState<number | null>(null);
  const [visiblePuzzles, setVisiblePuzzles] = useState<number[]>([]);

  useEffect(() => {
    setCanSpin(totalPoints > 0 && totalPoints % 2000 === 0);
    setVisiblePuzzles([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  }, [totalPoints]);

  const handleSpin = () => {
    if (!canSpin) return;

    playGameSound(settings.sound).catch(() => {});
    triggerGameHaptic(settings.vibration).catch(() => {});

    const rewards = [100, 200, 300];
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];

    setSpinReward(randomReward);
    setCanSpin(false);

    const targetPuzzle = puzzles.find(puzzle => puzzle.pieces.some(piece => !piece.unlocked));
    const randomPiece = targetPuzzle?.pieces.filter(piece => !piece.unlocked)[0];
    if (targetPuzzle && randomPiece) {
      unlockPuzzlePiece(targetPuzzle.id, randomPiece.id);
    }
  };

  const navigateToWishoniaStory = () => {
    playGameSound(settings.sound).catch(() => {});
    triggerGameHaptic(settings.vibration).catch(() => {});
    router.push('/wishonia-story');
  };

  const handlePuzzleCardPress = () => {
    triggerLightHaptic(settings.vibration).catch(() => {});
  };

  const isPuzzleUnlocked = (puzzleId: number): boolean => {
    switch (puzzleId) {
      case 1:
        return true;
      case 2:
        return totalPoints >= 10000;
      case 3:
        return totalPoints >= 30000;
      case 4:
        return totalPoints >= 50000;
      case 5:
        return totalPoints >= 70000;
      case 6:
        return totalPoints >= 90000;
      case 7:
        return totalPoints >= 120000;
      case 8:
        return totalPoints >= 140000;
      case 9:
        return totalPoints >= 160000;
      default:
        return false;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.pointsContainer}>
          <View style={styles.totalPointsContainer}>
            <Text style={styles.totalPointsLabel}>{t('game.gain_points')}</Text>
            <Text style={styles.totalPoints}>{totalPoints}</Text>
          </View>

          <View style={styles.dailyPointsContainer}>
            <Text style={styles.dailyPointsLabel}>{t('game.today_points')}</Text>
            <Text style={styles.dailyPoints}>{dailyPoints}/{DAILY_POINTS_LIMIT}</Text>
          </View>
        </View>

        <Pressable style={styles.wishoniaButton} onPress={navigateToWishoniaStory}>
          <Image
            source={{ uri: 'https://github.com/user-attachments/assets/efa6b980-7ad0-43a3-a1e2-bc862cc637d3' }}
            style={styles.wishoniaImage}
          />
          <Text style={styles.wishoniaText}>{t('nav.wishonia_story')}</Text>
        </Pressable>
      </View>

      {carryOverPoints > 0 && (
        <View style={styles.carryOverContainer}>
          <Text style={styles.carryOverText}>{t('game.carry_over_accumulated', { points: carryOverPoints })}</Text>
        </View>
      )}

      {spinReward !== null && (
        <Pressable style={styles.rewardContainer} onPress={handleSpin}>
          <Text style={styles.rewardText}>{t('game.spin_reward', { points: spinReward })}</Text>
        </Pressable>
      )}

      <Text style={styles.sectionTitle}>{t('game.unlock_puzzles')}</Text>

      {puzzles
        .filter(puzzle => visiblePuzzles.includes(puzzle.id))
        .map(puzzle => (
          <Pressable key={puzzle.id} style={styles.puzzleContainer} onPress={handlePuzzleCardPress}>
            <PuzzlePreview puzzle={puzzle} />
            {!isPuzzleUnlocked(puzzle.id) && (
              <View style={styles.lockedOverlay}>
                <Text style={styles.lockedText}>
                  {t('game.locked_requirement', { points: puzzle.target })}
                </Text>
              </View>
            )}
          </Pressable>
        ))}

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{t('game.info', { limit: DAILY_POINTS_LIMIT })}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pointsContainer: {
    flex: 1,
    marginRight: 16,
  },
  totalPointsContainer: {
    backgroundColor: `${colors.primary}10`,
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  totalPointsLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  totalPoints: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  dailyPointsContainer: {
    backgroundColor: `${colors.success}10`,
    borderRadius: 16,
    padding: 12,
  },
  dailyPointsLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  dailyPoints: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.success,
  },
  carryOverContainer: {
    backgroundColor: `${colors.primary}20`,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  carryOverText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  wishoniaButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
  wishoniaImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  wishoniaText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  rewardContainer: {
    backgroundColor: colors.success,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  rewardText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  puzzleContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  lockedText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    padding: 16,
  },
  infoContainer: {
    backgroundColor: `${colors.primary}10`,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
});
