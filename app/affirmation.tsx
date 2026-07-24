import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { Heart, Sparkles, Coins, Trophy, Shield, Flower, Leaf, Feather, Handshake, Zap } from 'lucide-react-native';
import { useAppStore, DAILY_POINTS_LIMIT } from '@/store/useAppStore';
import { colors } from '@/constants/colors';
import { affirmations } from '@/constants/affirmations';
import { AppLanguage, t } from '@/constants/translations';
import { getIconColor } from '@/constants/iconColors';
import { AnimatedPlus } from '@/components/AnimatedPlus';
import { AnimatedParticles } from '@/components/AnimatedParticles';
import { critConfigs, type CritConfig, type CritSoundKey, rollCrit } from '@/utils/critSystem';
import { getSpiritBonuses } from '@/utils/progression';
import { triggerCritHaptic, triggerSuccessHaptic } from '@/utils/haptics';

let Animated: any = View;
let withTiming: any = (value: any) => value;
let useSharedValue: any = (value: any) => ({ value });
let useAnimatedStyle: any = () => ({});

if (Platform.OS !== 'web') {
  try {
    const Reanimated = require('react-native-reanimated');
    Animated = Reanimated.default;
    withTiming = Reanimated.withTiming;
    useSharedValue = Reanimated.useSharedValue;
    useAnimatedStyle = Reanimated.useAnimatedStyle;
  } catch (error) {
    console.warn('Failed to load Reanimated:', error);
  }
}

const MAX_ANIMATIONS = 6;
const DEBOUNCE_TIME = 300;

const SOUND_ASSET_MAP: Record<CritSoundKey, number> = {
  tapSoft: require('../assets/tap-sound.mp3'),
  sparkleSmall: require('../assets/sparkle.mp3'),
  sparkleCrit: require('../assets/sparkle.mp3'),
  rainbowBurst: require('../assets/ding.mp3'),
  miracleDrop: require('../assets/sparkle.mp3'),
  cosmicResonance: require('../assets/ding.mp3'),
  divineBurst: require('../assets/ding.mp3'),
};

type FloatingScore = {
  id: number;
  position: { x: number; y: number };
  value: number;
  label: string;
  color: string;
  textColor: string;
  duration: number;
  driftX: number;
  floatY: number;
  rotation: number;
  initialScale: number;
  popScale: number;
};

type ParticleBurst = {
  id: number;
  position: { x: number; y: number };
  particleCount: number;
  palette: string[];
  duration: number;
  delay: number;
};

type ActiveOverlay = {
  id: number;
  crit: CritConfig;
};

let soundRegistry: Partial<Record<CritSoundKey, Audio.Sound>> = {};

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
    console.warn('Failed to configure audio session:', error);
  });
}

export default function AffirmationScreen() {
  const router = useRouter();
  const {
    settings,
    selectedAffirmationId,
    todayCounts,
    dailyPoints,
    carryOverPoints,
    incrementCount,
    growth,
    acknowledgeLevelUp,
  } = useAppStore();

  const [plusAnimations, setPlusAnimations] = useState<FloatingScore[]>([]);
  const [particleBursts, setParticleBursts] = useState<ParticleBurst[]>([]);
  const [nextAnimationId, setNextAnimationId] = useState(0);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay | null>(null);

  const buttonRef = useRef<View>(null);
  const textRef = useRef<Text>(null);
  const lastPressTimeRef = useRef<number>(0);
  const buttonEnabledRef = useRef<boolean>(true);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const buttonScale = useSharedValue(1);
  const screenScale = useSharedValue(1);

  const measureButton = () => {
    buttonRef.current?.measure((_, __, width, height, pageX, pageY) => {
      setButtonPosition({
        x: pageX || 0,
        y: pageY || 0,
        width: width || 0,
        height: height || 0,
      });
    });
  };

  const spiritBonuses = getSpiritBonuses(growth.ownedSpirits);
  const miracleCritBonus = growth.activeMiracleEvent === 'critBoost' ? 5 : 0;
  const energyMultiplier = growth.activeMiracleEvent === 'doubleEnergy' ? 2 : 1;
  const effectiveDailyLimit = DAILY_POINTS_LIMIT + spiritBonuses.dailyLimitBonus;

  const registerTimeout = (callback: () => void, ms: number) => {
    const timeout = setTimeout(callback, ms);
    timeoutRefs.current.push(timeout);
    return timeout;
  };

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    let cancelled = false;

    const preloadSounds = async () => {
      await Promise.all(
        (Object.entries(SOUND_ASSET_MAP) as Array<[CritSoundKey, number]>).map(async ([key, asset]) => {
          try {
            const sound = new Audio.Sound();
            await sound.loadAsync(asset);
            if (cancelled) {
              await sound.unloadAsync().catch(() => {});
              return;
            }
            soundRegistry[key] = sound;
          } catch (error) {
            console.warn(`Failed to preload sound for ${key}:`, error);
          }
        })
      );
    };

    preloadSounds();

    return () => {
      cancelled = true;
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
      void Promise.all(Object.values(soundRegistry).map(sound => sound?.unloadAsync().catch(() => {}))).finally(() => {
        soundRegistry = {};
      });
    };
  }, []);

  useEffect(() => {
    setDailyLimitReached(dailyPoints >= effectiveDailyLimit);
  }, [dailyPoints, effectiveDailyLimit]);

  useEffect(() => {
    if (selectedAffirmationId === null) {
      router.back();
    }
  }, [selectedAffirmationId, router]);

  useEffect(() => {
    const timeout = registerTimeout(measureButton, 400);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!growth.lastLevelUp) {
      return;
    }

    try {
      screenScale.value = withTiming(0.96, { duration: 120 });
      registerTimeout(() => {
        screenScale.value = withTiming(1, { duration: 260 });
      }, 120);
    } catch (error) {
      console.warn('Level up celebration error:', error);
    }

    triggerSuccessHaptic(settings.vibration).catch(() => {});
    triggerCritHaptic(settings.vibration, 'divine').catch(() => {});
  }, [growth.lastLevelUp, screenScale, settings.vibration]);

  const affirmation = useMemo(
    () => affirmations.find(item => item.id === selectedAffirmationId) ?? null,
    [selectedAffirmationId]
  );

  if (selectedAffirmationId === null || !affirmation) {
    return null;
  }

  const count = todayCounts[selectedAffirmationId] || 0;
  const language = settings.language as AppLanguage;
  const iconColor = getIconColor(affirmation.icon);

  const ensureSoundLoaded = async (soundKey: CritSoundKey) => {
    const existingSound = soundRegistry[soundKey];

    try {
      if (existingSound) {
        const status = await existingSound.getStatusAsync();
        if (status.isLoaded) {
          return existingSound;
        }
      }

      const sound = existingSound ?? new Audio.Sound();
      try {
        await sound.unloadAsync();
      } catch {}
      await sound.loadAsync(SOUND_ASSET_MAP[soundKey]);
      soundRegistry[soundKey] = sound;
      return sound;
    } catch (error) {
      console.warn(`Sound preload failed for ${soundKey}:`, error);
      return null;
    }
  };

  const playButtonTapSound = async () => {
    if (!settings.sound || Platform.OS === 'web') {
      return;
    }

    try {
      const cachedSound = await ensureSoundLoaded('tapSoft');

      if (cachedSound) {
        const status = await cachedSound.getStatusAsync();
        if (status.isLoaded) {
          await cachedSound.stopAsync().catch(() => {});
          await cachedSound.setPositionAsync(0).catch(() => {});
          await cachedSound.playAsync();
          return;
        }
      }

      const tempSound = new Audio.Sound();
      await tempSound.loadAsync(SOUND_ASSET_MAP.tapSoft);
      await tempSound.playAsync();
      tempSound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && !status.isPlaying && status.positionMillis > 0) {
          tempSound.unloadAsync().catch(() => {});
        }
      });
    } catch (error) {
      console.warn('Button tap sound playback failed:', error);
    }
  };

  const getButtonCenter = () => {
    const { width, height } = Dimensions.get('window');
    const centerX = buttonPosition.width ? buttonPosition.x + buttonPosition.width / 2 : width / 2;
    const centerY = buttonPosition.height ? buttonPosition.y + buttonPosition.height / 2 : height * 0.45;
    return { x: centerX, y: centerY };
  };

  const generateFloatingPosition = () => {
    const center = getButtonCenter();
    const { width, height } = Dimensions.get('window');
    const roll = Math.random();

    let offsetX = 0;
    let offsetY = 0;

    if (roll < 0.7) {
      offsetX = (Math.random() < 0.5 ? -1 : 1) * (48 + Math.random() * 92);
      offsetY = -48 - Math.random() * 112;
    } else if (roll < 0.9) {
      offsetX = (Math.random() < 0.5 ? -1 : 1) * (88 + Math.random() * 52);
      offsetY = -30 + Math.random() * 90;
    } else {
      offsetX = Math.random() * 180 - 90;
      offsetY = -8 + Math.random() * 48;
    }

    return {
      x: Math.min(width - 48, Math.max(48, center.x + offsetX)),
      y: Math.min(height - 76, Math.max(88, center.y + offsetY)),
    };
  };

  const generateBurstPosition = (origin: { x: number; y: number }) => {
    return {
      x: origin.x + (Math.random() * 40 - 20),
      y: origin.y + (Math.random() * 30 - 15),
    };
  };

  const animateButtonPress = (crit: CritConfig) => {
    if (Platform.OS === 'web') {
      return;
    }

    try {
      buttonScale.value = withTiming(0.92, { duration: 70 });
      registerTimeout(() => {
        buttonScale.value = withTiming(1.06, { duration: 70 });
      }, 68);
      registerTimeout(() => {
        buttonScale.value = withTiming(1, { duration: 72 });
      }, 142);

      if (crit.effects.screenPulse) {
        screenScale.value = withTiming(0.985, { duration: 80 });
        registerTimeout(() => {
          screenScale.value = withTiming(1, { duration: 140 });
        }, 85);
      }
    } catch (error) {
      console.warn('Animation error:', error);
    }
  };

  const getRewardLabel = (crit: CritConfig, awardedPoints: number) => {
    if (crit.type === 'normal') {
      return `+${awardedPoints}`;
    }

    const prefix =
      crit.type === 'smallLucky'
        ? 'Lucky'
        : crit.type === 'luckyCrit'
          ? 'Lucky Crit'
          : crit.type === 'rainbowCrit'
            ? 'Rainbow'
            : crit.type === 'miracle'
              ? 'Miracle'
              : crit.type === 'cosmic'
                ? 'Cosmic'
                : 'Divine';

    return `${prefix} +${awardedPoints}`;
  };

  const triggerCritEffects = (crit: CritConfig, animationId: number, awardedPoints: number) => {
    const position = generateFloatingPosition();
    const burstPosition = generateBurstPosition(position);
    const duration = 800 + Math.round(Math.random() * 300);
    const driftX = (Math.random() < 0.5 ? -1 : 1) * (10 + Math.random() * 15);
    const floatY = 50 + Math.random() * 60;
    const rotation = Math.random() * 16 - 8;
    const initialScale = 0.95 + Math.random() * 0.08;
    const popScale = 1.02 + Math.random() * 0.08;

    setPlusAnimations(prev => [
      ...prev.slice(-(MAX_ANIMATIONS - 1)),
      {
        id: animationId,
        position,
        value: awardedPoints,
        label: getRewardLabel(crit, awardedPoints),
        color: crit.plusColor,
        textColor: crit.textColor,
        duration,
        driftX,
        floatY,
        rotation,
        initialScale,
        popScale,
      },
    ]);

    setParticleBursts(prev => [
      ...prev.slice(-(MAX_ANIMATIONS - 1)),
      {
        id: animationId,
        position: burstPosition,
        particleCount: crit.particleCount,
        palette: crit.particlePalette,
        duration: Math.min(1100, duration + 40),
        delay: 40,
      },
    ]);

    setActiveOverlay({ id: animationId, crit });
    registerTimeout(() => {
      setActiveOverlay(current => (current?.id === animationId ? null : current));
    }, crit.overlayDuration);
  };

  const handlePress = () => {
    if (dailyLimitReached || !buttonEnabledRef.current) {
      return;
    }

    const now = Date.now();
    if (now - lastPressTimeRef.current < DEBOUNCE_TIME) {
      return;
    }

    lastPressTimeRef.current = now;
    buttonEnabledRef.current = false;
    registerTimeout(() => {
      buttonEnabledRef.current = true;
    }, DEBOUNCE_TIME);

    const crit = rollCrit(undefined, spiritBonuses.critBonus + miracleCritBonus);
    const awardedPoints = Math.max(1, Math.round((crit.points + spiritBonuses.tapBonus) * energyMultiplier));
    const animationId = nextAnimationId;
    setNextAnimationId(prev => prev + 1);

    incrementCount(selectedAffirmationId, awardedPoints, { critType: crit.type });
    animateButtonPress(crit);
    triggerCritEffects(crit, animationId, awardedPoints);

    void playButtonTapSound();
    void triggerCritHaptic(settings.vibration, crit.type);
  };

  const handleAnimationComplete = (id: number) => {
    setPlusAnimations(prev => prev.filter(animation => animation.id !== id));
  };

  const handleParticleAnimationComplete = (id: number) => {
    setParticleBursts(prev => prev.filter(burst => burst.id !== id));
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    try {
      return {
        transform: [{ scale: buttonScale.value }],
      };
    } catch (error) {
      console.warn('Button animation style error:', error);
      return {};
    }
  });

  const screenAnimatedStyle = useAnimatedStyle(() => {
    try {
      return {
        transform: [{ scale: screenScale.value }],
      };
    } catch (error) {
      console.warn('Screen animation style error:', error);
      return {};
    }
  });

  const getTapText = () => {
    if (dailyLimitReached) {
      return language === 'zh' ? '今日能量已滿' : 'Daily Limit Reached';
    }

    return language === 'zh' ? '點我收集奇蹟' : 'Tap For Miracle';
  };

  const renderIcon = () => {
    const iconProps = { size: 60, color: colors.background, strokeWidth: 2 };

    switch (affirmation.icon) {
      case 'sparkles':
        return <Sparkles {...iconProps} />;
      case 'coins':
        return <Coins {...iconProps} />;
      case 'trophy':
        return <Trophy {...iconProps} />;
      case 'shield':
        return <Shield {...iconProps} />;
      case 'flower':
        return <Flower {...iconProps} />;
      case 'heart':
        return <Heart {...iconProps} />;
      case 'leaf':
        return <Leaf {...iconProps} />;
      case 'feather':
        return <Feather {...iconProps} />;
      case 'handshake':
        return <Handshake {...iconProps} />;
      case 'zap':
        return <Zap {...iconProps} />;
      default:
        return <Sparkles {...iconProps} />;
    }
  };

  const AnimatedRoot = Platform.OS !== 'web' ? Animated : View;
  const ButtonComponent = Platform.OS !== 'web' ? Animated : View;
  const center = getButtonCenter();
  const overlayCrit: CritConfig = activeOverlay?.crit ?? critConfigs.normal;
  const tapText = dailyLimitReached ? t('game.daily_limit_reached', language) : t('game.tap_for_miracle', language);
  const bonusBannerText = t('game.level_status', language, {
    level: growth.level,
    title: t(growth.title, language),
    tapBonus: spiritBonuses.tapBonus,
    critBonus: spiritBonuses.critBonus + miracleCritBonus,
  });

  return (
    <AnimatedRoot
      style={[
        styles.container,
        growth.activeMiracleEvent === 'goldenAura' && styles.goldenContainer,
        Platform.OS !== 'web' ? screenAnimatedStyle : null,
      ]}
    >
      {activeOverlay && (
        <View pointerEvents="none" style={styles.overlayRoot} key={`overlay-${activeOverlay.id}`}>
          {overlayCrit.effects.flash && (
            <View style={styles.flashOverlay}>
              {overlayCrit.particlePalette.map((color, index) => (
                <View key={`flash-${color}-${index}`} style={[styles.flashStripe, { backgroundColor: color }]} />
              ))}
            </View>
          )}

          {overlayCrit.effects.mist && (
            <View style={styles.mistLayer}>
              <View style={[styles.mistOrb, styles.mistOrbLeft, { backgroundColor: `${overlayCrit.particlePalette[1] ?? '#FFFFFF'}55` }]} />
              <View style={[styles.mistOrb, styles.mistOrbCenter, { backgroundColor: `${overlayCrit.particlePalette[2] ?? '#FFFFFF'}44` }]} />
              <View style={[styles.mistOrb, styles.mistOrbRight, { backgroundColor: `${overlayCrit.particlePalette[3] ?? '#FFFFFF'}50` }]} />
            </View>
          )}

          {(overlayCrit.effects.halo || overlayCrit.effects.ripple || overlayCrit.effects.ring) && (
            <View style={[styles.centeredEffect, { left: center.x - 150, top: center.y - 150 }]}>
              {overlayCrit.effects.halo && (
                <View style={[styles.haloRing, { borderColor: overlayCrit.particlePalette[0] ?? '#FFD76A' }]} />
              )}
              {overlayCrit.effects.ripple && (
                <View style={[styles.rippleRing, { borderColor: overlayCrit.particlePalette[1] ?? '#FFFFFF' }]} />
              )}
              {overlayCrit.effects.ring && (
                <View style={styles.starRing}>
                  {Array.from({ length: 8 }).map((_, index) => {
                    const angle = (Math.PI * 2 * index) / 8;
                    const radius = 128;
                    return (
                      <View
                        key={`ring-star-${index}`}
                        style={[
                          styles.starRingDot,
                          {
                            backgroundColor: overlayCrit.particlePalette[index % overlayCrit.particlePalette.length],
                            left: 145 + Math.cos(angle) * radius,
                            top: 145 + Math.sin(angle) * radius,
                          },
                        ]}
                      />
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {overlayCrit.effects.arcSweep && (
            <View
              style={[
                styles.centeredEffect,
                styles.arcSweep,
                {
                  left: center.x - 135,
                  top: center.y - 135,
                  borderTopColor: overlayCrit.particlePalette[0] ?? '#FFD76A',
                  borderRightColor: overlayCrit.particlePalette[1] ?? '#FF7AD9',
                },
              ]}
            />
          )}

          {overlayCrit.effects.whiteBurst && (
            <View style={[styles.whiteBurst, { left: center.x - 140, top: center.y - 140 }]} />
          )}

          {overlayCrit.effects.lightPillar && (
            <View style={[styles.lightPillar, { left: center.x - 36 }]} />
          )}

          {(overlayCrit.effects.meteor || overlayCrit.effects.meteorShower) && (
            <View style={styles.meteorLayer}>
              {(overlayCrit.effects.meteorShower ? [0, 1, 2, 3, 4, 5] : [0, 1, 2]).map(index => (
                <View
                  key={`meteor-${index}`}
                  style={[
                    styles.meteor,
                    {
                      left: `${8 + index * 15}%`,
                      top: `${12 + index * 8}%`,
                      backgroundColor: overlayCrit.particlePalette[index % overlayCrit.particlePalette.length],
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>
      )}

      {growth.lastLevelUp ? (
        <View style={styles.levelUpOverlay}>
          <View style={styles.levelUpCard}>
            <Text style={styles.levelUpLabel}>{t('common.level', language).toUpperCase()}</Text>
            <Text style={styles.levelUpTitle}>Lv.{growth.lastLevelUp.level} {t(growth.lastLevelUp.title, language)}</Text>
            <Text style={styles.levelUpText}>{t('growth.level_up_message', language)}</Text>
            <Pressable style={styles.primaryButton} onPress={acknowledgeLevelUp}>
              <Text style={styles.primaryButtonText}>{t('common.confirm', language)}</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <Text ref={textRef} style={styles.affirmationText}>
        {t(affirmation.textKey, language)}
      </Text>

      <View style={styles.bonusBanner}>
        <Text style={styles.bonusBannerText}>{bonusBannerText}</Text>
      </View>

      <Pressable
        ref={buttonRef}
        onPress={handlePress}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        pressRetentionOffset={{ top: 50, bottom: 50, left: 50, right: 50 }}
        disabled={dailyLimitReached || !buttonEnabledRef.current}
        style={{ zIndex: 20 }}
        accessibilityRole="button"
        accessibilityLabel={tapText}
        testID="button-animation"
        onLayout={measureButton}
      >
        <ButtonComponent
          style={[
            styles.button,
            { backgroundColor: iconColor },
            dailyLimitReached && styles.disabledButton,
            Platform.OS !== 'web' ? buttonAnimatedStyle : null,
          ]}
        >
          <View style={styles.buttonGlow} />
          <View style={styles.buttonContent}>
            {renderIcon()}
            <Text style={styles.buttonText}>{tapText}</Text>
          </View>
        </ButtonComponent>
      </Pressable>

      <View style={styles.statsContainer}>
        <View style={styles.countContainer}>
          <Text style={styles.countLabel}>{t('common.today', language)}</Text>
          <Text style={[styles.count, { color: iconColor }]}>+{count}</Text>
        </View>

        <View style={styles.dailyLimitContainer}>
          <Text style={styles.dailyLimitLabel}>{t('game.gain_energy', language)}</Text>
          <Text style={[styles.dailyLimitValue, dailyLimitReached && styles.dailyLimitReached]}>
            {dailyPoints}/{effectiveDailyLimit}
          </Text>
        </View>
      </View>

      {carryOverPoints > 0 && (
        <View style={styles.carryOverContainer}>
          <Text style={styles.carryOverText}>
            {t('game.carry_over_accumulated', language, { points: carryOverPoints })}
          </Text>
        </View>
      )}

      <View pointerEvents="none" style={styles.floatingOverlay}>
        {plusAnimations.map(animation => (
          <AnimatedPlus
            key={`plus-${animation.id}`}
            animationId={animation.id}
            value={animation.value}
            label={animation.label}
            color={animation.color}
            textColor={animation.textColor}
            position={animation.position}
            duration={animation.duration}
            driftX={animation.driftX}
            floatY={animation.floatY}
            rotation={animation.rotation}
            initialScale={animation.initialScale}
            popScale={animation.popScale}
            onAnimationComplete={handleAnimationComplete}
          />
        ))}

        {particleBursts.map(burst => (
          <AnimatedParticles
            key={`particle-${burst.id}`}
            icon={affirmation.icon}
            animation={affirmation.animation}
            onAnimationComplete={() => handleParticleAnimationComplete(burst.id)}
            color={iconColor}
            position={burst.position}
            particleCount={burst.particleCount}
            duration={burst.duration}
            palette={burst.palette}
            delay={burst.delay}
          />
        ))}
      </View>
    </AnimatedRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  goldenContainer: {
    backgroundColor: '#FFF7D6',
  },
  overlayRoot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 6,
    pointerEvents: 'none',
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    opacity: 0.24,
  },
  flashStripe: {
    flex: 1,
  },
  mistLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  mistOrb: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
  },
  mistOrbLeft: {
    left: -40,
    top: 120,
  },
  mistOrbCenter: {
    alignSelf: 'center',
    top: 80,
  },
  mistOrbRight: {
    right: -50,
    bottom: 160,
  },
  centeredEffect: {
    position: 'absolute',
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  haloRing: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 999,
    borderWidth: 8,
    opacity: 0.32,
  },
  rippleRing: {
    position: 'absolute',
    width: 290,
    height: 290,
    borderRadius: 999,
    borderWidth: 4,
    opacity: 0.26,
  },
  arcSweep: {
    position: 'absolute',
    width: 270,
    height: 270,
    borderRadius: 999,
    borderWidth: 18,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    opacity: 0.8,
  },
  starRing: {
    width: 300,
    height: 300,
  },
  starRingDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 999,
    marginLeft: -6,
    marginTop: -6,
    shadowOpacity: 0.32,
    shadowRadius: 8,
    elevation: 3,
  },
  whiteBurst: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  lightPillar: {
    position: 'absolute',
    top: 40,
    bottom: 40,
    width: 72,
    borderRadius: 999,
    backgroundColor: 'rgba(255,245,196,0.55)',
  },
  meteorLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  meteor: {
    position: 'absolute',
    width: 120,
    height: 6,
    borderRadius: 999,
    opacity: 0.72,
    transform: [{ rotate: '-28deg' }],
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 2,
  },
  levelUpOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.74)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
    padding: 20,
  },
  levelUpCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    borderWidth: 2,
    borderColor: '#FFD76A',
    shadowColor: '#FFD76A',
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 4,
    alignItems: 'center',
  },
  levelUpLabel: {
    color: colors.primary,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  levelUpTitle: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
  },
  levelUpText: {
    marginTop: 12,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  primaryButton: {
    marginTop: 18,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  affirmationText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 18,
    zIndex: 10,
  },
  bonusBanner: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: `${colors.primary}12`,
    borderRadius: 999,
    marginBottom: 22,
  },
  bonusBannerText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
  },
  button: {
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 10,
    zIndex: 20,
    minWidth: 48,
    minHeight: 48,
    overflow: 'hidden',
  },
  buttonGlow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    paddingHorizontal: 18,
  },
  buttonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
    zIndex: 20,
  },
  statsContainer: {
    marginTop: 48,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    zIndex: 10,
  },
  countContainer: {
    alignItems: 'center',
  },
  countLabel: {
    fontSize: 16,
    color: colors.textLight,
  },
  count: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  dailyLimitContainer: {
    alignItems: 'center',
  },
  dailyLimitLabel: {
    fontSize: 16,
    color: colors.textLight,
  },
  dailyLimitValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.success,
  },
  dailyLimitReached: {
    color: '#FF6B6B',
  },
  carryOverContainer: {
    marginTop: 24,
    backgroundColor: `${colors.primary}20`,
    borderRadius: 16,
    padding: 12,
    alignSelf: 'stretch',
    zIndex: 10,
  },
  carryOverText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  floatingOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
    zIndex: 50,
    overflow: 'visible',
  },
});
