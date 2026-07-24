import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Sparkles, Coins, Trophy, Shield, Flower, Leaf, Feather, Handshake, Zap } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { getIconColor, IconName } from '@/constants/iconColors';
import { Affirmation } from '@/constants/affirmations';
import { useAppStore } from '@/store/useAppStore';

// Pre-import Audio and Haptics for production builds
// This is critical - dynamic imports often fail in production
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

// Initialize sound object at module level for better reliability
let cardSoundObject: Audio.Sound | null = null;

// Initialize audio session as early as possible
if (Platform.OS !== 'web') {
  // Configure audio session for iOS - critical for sound to work in published app
  Audio.setAudioModeAsync({
    playsInSilentModeIOS: true, // Allow audio to play when device is on silent mode
    staysActiveInBackground: false,
    interruptionModeIOS: 1, // Use numeric value instead of enum (1 = do not mix)
    shouldDuckAndroid: false,
    interruptionModeAndroid: 1, // Use numeric value instead of enum (1 = do not mix)
    playThroughEarpieceAndroid: false,
    allowsRecordingIOS: false,
  }).catch(error => {
    console.warn('Failed to configure card audio session:', error);
  });
  
  // Preload sound
  const preloadCardSound = async () => {
    try {
      cardSoundObject = new Audio.Sound();
      
      // Try loading from asset first (most reliable in production)
      try {
        await cardSoundObject.loadAsync(require('../assets/ding.mp3'));
        console.log('Card sound preloaded from assets');
      } catch (assetError) {
        console.warn('Failed to preload card sound from assets:', assetError);
        
        // Fallback to URL
        try {
          await cardSoundObject.loadAsync({ 
            uri: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3' 
          });
          console.log('Card sound preloaded from URL');
        } catch (urlError) {
          console.warn('Failed to preload card sound from URL:', urlError);
          
          // Try alternate URL
          try {
            await cardSoundObject.loadAsync({ 
              uri: 'https://assets.mixkit.co/sfx/preview/mixkit-interface-click-1126.mp3' 
            });
            console.log('Card sound preloaded from alternate URL');
          } catch (altUrlError) {
            console.warn('Failed to preload card sound from alternate URL:', altUrlError);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to preload card sound:', error);
    }
  };
  
  preloadCardSound();
}

// Function to play card selection sound
const playCardSound = async (soundEnabled: boolean) => {
  if (!soundEnabled || Platform.OS === 'web') {
    return;
  }
  
  try {
    // If we don't have a sound object, create one
    if (!cardSoundObject) {
      cardSoundObject = new Audio.Sound();
      
      // Try loading from asset first (most reliable in production)
      try {
        await cardSoundObject.loadAsync(require('../assets/ding.mp3'));
        console.log('Card sound loaded from assets');
      } catch (assetError) {
        console.warn('Failed to load card sound from assets:', assetError);
        
        // Fallback to URL
        try {
          await cardSoundObject.loadAsync({ 
            uri: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3' 
          });
          console.log('Card sound loaded from URL');
        } catch (urlError) {
          console.warn('Failed to load card sound from URL:', urlError);
          
          // Try alternate URL
          try {
            await cardSoundObject.loadAsync({ 
              uri: 'https://assets.mixkit.co/sfx/preview/mixkit-interface-click-1126.mp3' 
            });
            console.log('Card sound loaded from alternate URL');
          } catch (altUrlError) {
            console.warn('Failed to load card sound from alternate URL:', altUrlError);
            
            // Last resort: create a one-time sound
            createAndPlayOneTimeCardSound();
            return;
          }
        }
      }
    }
    
    // If we have a sound object, try to play it
    if (cardSoundObject) {
      try {
        const status = await cardSoundObject.getStatusAsync();
        
        if (status.isLoaded) {
          // Reset sound position and play
          await cardSoundObject.stopAsync();
          await cardSoundObject.setPositionAsync(0);
          await cardSoundObject.playAsync();
          console.log('Card sound played successfully');
        } else {
          console.warn('Card sound not loaded, trying to reload');
          
          // Try to reload from asset first (most reliable in production)
          try {
            await cardSoundObject.unloadAsync();
            await cardSoundObject.loadAsync(require('../assets/ding.mp3'));
            await cardSoundObject.playAsync();
            console.log('Card sound reloaded from assets and played');
          } catch (reloadAssetError) {
            console.warn('Failed to reload card sound from assets:', reloadAssetError);
            
            // Try to reload from URL
            try {
              await cardSoundObject.unloadAsync();
              await cardSoundObject.loadAsync({ 
                uri: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3' 
              });
              await cardSoundObject.playAsync();
              console.log('Card sound reloaded from URL and played');
            } catch (reloadUrlError) {
              console.warn('Failed to reload card sound from URL:', reloadUrlError);
              
              // Try alternate URL
              try {
                await cardSoundObject.unloadAsync();
                await cardSoundObject.loadAsync({ 
                  uri: 'https://assets.mixkit.co/sfx/preview/mixkit-interface-click-1126.mp3' 
                });
                await cardSoundObject.playAsync();
                console.log('Card sound reloaded from alternate URL and played');
              } catch (altUrlError) {
                console.warn('Failed to load from alternate URL:', altUrlError);
                
                // Last resort: create a new sound object
                createAndPlayOneTimeCardSound();
              }
            }
          }
        }
      } catch (playError) {
        console.warn('Error playing card sound:', playError);
        
        // Last resort: create a new sound object
        createAndPlayOneTimeCardSound();
      }
    } else {
      // If we still don't have a sound object, create a one-time sound
      createAndPlayOneTimeCardSound();
    }
  } catch (error) {
    console.warn('Card sound playback error:', error);
  }
};

// Helper function to create and play a one-time sound
const createAndPlayOneTimeCardSound = async () => {
  try {
    const tempSound = new Audio.Sound();
    
    // Try asset first (most reliable in production)
    try {
      await tempSound.loadAsync(require('../assets/ding.mp3'));
    } catch (assetError) {
      // Try URL
      try {
        await tempSound.loadAsync({ 
          uri: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3' 
        });
      } catch (urlError) {
        // Try alternate URL
        try {
          await tempSound.loadAsync({ 
            uri: 'https://assets.mixkit.co/sfx/preview/mixkit-interface-click-1126.mp3' 
          });
        } catch (altUrlError) {
          console.warn('Failed to load one-time card sound:', altUrlError);
          return;
        }
      }
    }
    
    await tempSound.playAsync();
    
    // Clean up after playing
    tempSound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && !status.isPlaying && status.positionMillis > 0) {
        tempSound.unloadAsync().catch(() => {});
      }
    });
    
    console.log('One-time card sound played successfully');
  } catch (error) {
    console.warn('Failed to play one-time card sound:', error);
  }
};

// Function to trigger haptic feedback for card selection
const triggerCardHaptic = async (vibrationEnabled: boolean) => {
  if (!vibrationEnabled || Platform.OS === 'web') {
    return;
  }
  
  try {
    // Try all available haptic methods in sequence until one works
    try {
      // Try light impact first (most subtle)
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      console.log('Light impact haptic feedback triggered successfully for card');
    } catch (lightImpactError) {
      console.warn('Light impact haptic failed for card, trying medium impact:', lightImpactError);
      
      try {
        // Try medium impact as fallback
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        console.log('Medium haptic feedback triggered as fallback for card');
      } catch (mediumImpactError) {
        console.warn('Medium impact haptic failed for card, trying heavy impact:', mediumImpactError);
        
        try {
          // Try heavy impact as fallback
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          console.log('Heavy impact haptic feedback triggered as fallback for card');
        } catch (heavyImpactError) {
          console.warn('Heavy impact haptic failed for card, trying notification:', heavyImpactError);
          
          try {
            // Try notification as fallback
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            console.log('Notification haptic triggered as fallback for card');
          } catch (notificationError) {
            console.warn('Notification haptic failed for card, trying selection:', notificationError);
            
            try {
              // Try selection as last resort
              await Haptics.selectionAsync();
              console.log('Selection haptic triggered as last resort for card');
            } catch (selectionError) {
              console.warn('All card haptic attempts failed:', selectionError);
            }
          }
        }
      }
    }
  } catch (error) {
    console.warn('Card haptic feedback error:', error);
  }
};

type AffirmationCardProps = {
  affirmation: Affirmation;
};

export const AffirmationCard: React.FC<AffirmationCardProps> = ({ affirmation }) => {
  const router = useRouter();
  const { settings, todayCounts, setSelectedAffirmationId } = useAppStore();
  const count = todayCounts[affirmation.id] || 0;
  
  // Optimized for immediate response
  const handlePress = () => {
    // Play sound and trigger haptic feedback FIRST for immediate response
    playCardSound(settings.sound).catch(error => {
      console.warn('Play card sound error:', error);
    });
    
    triggerCardHaptic(settings.vibration).catch(error => {
      console.warn('Card haptic feedback error:', error);
    });
    
    // Set the selected affirmation ID
    setSelectedAffirmationId(affirmation.id);
    
    // Then navigate to the affirmation screen
    router.push('/affirmation');
  };
  
  const renderIcon = () => {
    // Get the color for this specific icon
    const iconColor = getIconColor(affirmation.icon);
    
    const iconProps = { 
      size: 24, 
      color: iconColor,
      strokeWidth: 2
    };
    
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
  
  // Get the background color for the icon container (lighter version of the icon color)
  const getIconBackgroundColor = () => {
    const iconColor = getIconColor(affirmation.icon);
    return `${iconColor}20`; // 20% opacity version of the color
  };
  
  return (
    <Pressable 
      style={styles.container}
      onPress={handlePress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      pressRetentionOffset={{ top: 20, bottom: 20, left: 20, right: 20 }}
      // Ensure minimum touch target size
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={affirmation.text[settings.language]}
    >
      <View style={[styles.iconContainer, { backgroundColor: getIconBackgroundColor() }]}>
        {renderIcon()}
      </View>
      <Text style={styles.text} numberOfLines={2}>
        {affirmation.text[settings.language]}
      </Text>
      <View style={[styles.countContainer, { backgroundColor: getIconColor(affirmation.icon) }]}>
        <Text style={styles.countText}>+{count}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 8,
    width: 160,
    height: 160,
    justifyContent: 'space-between',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
    // Ensure minimum touch target size
    minWidth: 48,
    minHeight: 48,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    color: colors.text,
    marginVertical: 8,
    flexShrink: 1,
  },
  countContainer: {
    alignSelf: 'flex-end',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  countText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
});