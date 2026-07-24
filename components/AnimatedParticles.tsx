import React, { useEffect } from 'react';
import { StyleSheet, View, Platform, Dimensions } from 'react-native';
import { colors } from '@/constants/colors';
import { getIconColor } from '@/constants/iconColors';
import { Heart, Sparkles, Coins, Trophy, Shield, Flower, Leaf, Feather, Handshake, Zap } from 'lucide-react-native';

// Import Reanimated conditionally to avoid web issues
let Animated: any = View;
let withTiming: any = (value: any) => value;
let withDelay: any = (_: any, value: any) => value;
let useSharedValue: any = (value: any) => ({ value });
let useAnimatedStyle: any = () => ({});

// Only import Reanimated if not on web
if (Platform.OS !== 'web') {
  try {
    const Reanimated = require('react-native-reanimated');
    Animated = Reanimated.default;
    withTiming = Reanimated.withTiming;
    withDelay = Reanimated.withDelay;
    useSharedValue = Reanimated.useSharedValue;
    useAnimatedStyle = Reanimated.useAnimatedStyle;
  } catch (error) {
    console.warn('Failed to load Reanimated:', error);
  }
}

type AnimatedParticlesProps = {
  icon: string;
  animation: string;
  onAnimationComplete?: () => void;
  color?: string;
  position?: { x: number, y: number };
};

export const AnimatedParticles: React.FC<AnimatedParticlesProps> = ({ 
  icon,
  animation,
  onAnimationComplete,
  color,
  position
}) => {
  // Use provided color or get from iconColors, fallback to primary
  const iconColor = color || getIconColor(icon);
  
  // For web, use a simpler approach without animations
  if (Platform.OS === 'web') {
    useEffect(() => {
      // Call animation complete after exactly 0.3 second
      const timeout = setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 300); // 0.3 second duration as requested
      
      return () => clearTimeout(timeout);
    }, [onAnimationComplete]);
    
    // For web, render a single static icon that will be hidden after timeout
    return (
      <View style={styles.container} pointerEvents="none">
        <View style={[styles.webParticle, { top: '20%', left: '20%' }]}>
          {renderIcon(icon, iconColor, 40)}
        </View>
      </View>
    );
  }
  
  // Get screen dimensions
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  // Generate a random position on the screen
  const generateRandomPosition = () => {
    // Use the entire screen area for random positioning
    const x = Math.random() * screenWidth * 0.8 + screenWidth * 0.1; // 10-90% of screen width
    const y = Math.random() * screenHeight * 0.6 + screenHeight * 0.1; // 10-70% of screen height
    
    // Ensure the position is not in the center area where the button and text are
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;
    const safeDistance = 150; // Distance to keep from center
    
    // If too close to center, adjust position
    if (Math.abs(x - centerX) < safeDistance && Math.abs(y - centerY) < safeDistance) {
      // Move to a corner based on which quadrant we're in
      if (x < centerX && y < centerY) {
        // Top-left quadrant
        return { x: x - safeDistance, y: y - safeDistance };
      } else if (x >= centerX && y < centerY) {
        // Top-right quadrant
        return { x: x + safeDistance, y: y - safeDistance };
      } else if (x < centerX && y >= centerY) {
        // Bottom-left quadrant
        return { x: x - safeDistance, y: y + safeDistance };
      } else {
        // Bottom-right quadrant
        return { x: x + safeDistance, y: y + safeDistance };
      }
    }
    
    return { x, y };
  };
  
  // Use provided position or generate a random one
  const particlePosition = position || generateRandomPosition();
  
  return (
    <View style={styles.container} pointerEvents="none">
      <ParticleItem 
        icon={icon}
        animation={animation}
        x={particlePosition.x}
        y={particlePosition.y}
        delay={0}
        size={50} // Fixed size for better visibility
        rotation={Math.random() * 360} // Random initial rotation
        onAnimationComplete={onAnimationComplete}
        color={iconColor}
      />
    </View>
  );
};

// Helper function to render the appropriate icon
const renderIcon = (icon: string, color: string, size: number) => {
  const iconProps = { 
    size: size, 
    color: color,
    strokeWidth: 2
  };
  
  switch (icon) {
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

type ParticleItemProps = {
  icon: string;
  animation: string;
  x: number;
  y: number;
  delay: number;
  size: number;
  rotation: number;
  onAnimationComplete?: () => void;
  color: string;
};

const ParticleItem: React.FC<ParticleItemProps> = ({
  icon,
  animation,
  x,
  y,
  delay,
  size,
  rotation,
  onAnimationComplete,
  color
}) => {
  // Safe initialization with fallbacks
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(rotation);
  
  useEffect(() => {
    try {
      // Set initial values
      opacity.value = 1;
      scale.value = 1;
      translateY.value = 0;
      rotate.value = rotation;
      
      // Create animation timing function with exactly 0.3 second duration
      const timingConfig = {
        duration: 300, // 0.3 second duration as requested
      };
      
      // Move up 100px
      translateY.value = withDelay(
        delay, 
        withTiming(-100, timingConfig)
      );
      
      // Rotate for more dynamic feel
      rotate.value = withDelay(
        delay,
        withTiming(rotation + (Math.random() * 180 - 90), timingConfig)
      );
      
      // Scale up slightly for more dynamic feel
      scale.value = withDelay(
        delay,
        withTiming(1.2, {
          duration: 150, // Faster scale-up
        })
      );
      
      // Fade out over exactly 0.3 second
      opacity.value = withDelay(
        delay,
        withTiming(0, timingConfig)
      );
      
      // Set up a timeout to call the completion handler after exactly 0.3 second
      const timeout = setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, delay + 300); // 0.3 second duration as requested
      
      return () => clearTimeout(timeout);
    } catch (error) {
      console.warn('Particle animation error:', error);
      // Fallback in case of animation error
      setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 300); // 0.3 second duration as requested
      return () => {};
    }
  }, [delay, onAnimationComplete, rotation]);
  
  // Create animated style
  const animatedStyle = useAnimatedStyle(() => {
    try {
      return {
        opacity: opacity.value,
        transform: [
          { translateY: translateY.value },
          { rotate: `${rotate.value}deg` },
          { scale: scale.value }
        ]
      };
    } catch (error) {
      console.warn('Particle style error:', error);
      return {};
    }
  });
  
  // Fixed the type error by using a type assertion
  const AnimatedView = Animated;
  
  return (
    <View style={[styles.particleWrapper, { left: x, top: y }]} key={`particle-${x}-${y}-${rotation}`}>
      <AnimatedView style={[styles.particle, animatedStyle, { width: size, height: size }]}>
        <View style={styles.iconContainer}>
          {renderIcon(icon, color, size)}
        </View>
      </AnimatedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5, // Lower than button (20) to ensure it doesn't overlap
    pointerEvents: 'none',
  },
  particleWrapper: {
    position: 'absolute',
    zIndex: 5,
  },
  particle: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  iconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  webParticle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    zIndex: 5,
  }
});