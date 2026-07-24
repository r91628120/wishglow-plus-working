import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { colors } from '@/constants/colors';

// Import Reanimated conditionally to avoid web issues
let Animated = View;
let withTiming: any = (value: any) => value;
let useSharedValue: any = (value: any) => ({ value });
let useAnimatedStyle: any = () => ({});

// Only import Reanimated if not on web
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

type AnimatedPlusProps = {
  value: number;
  animationId: number;
  onAnimationComplete?: (id: number) => void;
  color?: string;
  position: { x: number, y: number };
};

export const AnimatedPlus: React.FC<AnimatedPlusProps> = ({ 
  value, 
  animationId,
  onAnimationComplete,
  color = colors.primary,
  position
}) => {
  // For web, use a simpler approach without animations
  if (Platform.OS === 'web') {
    useEffect(() => {
      // Call animation complete after exactly 0.3 second
      const timeout = setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete(animationId);
        }
      }, 300); // 0.3 second duration as requested
      
      return () => clearTimeout(timeout);
    }, [value, onAnimationComplete, animationId]);
    
    return (
      <View 
        style={[
          styles.webContainer,
          {
            left: position.x,
            top: position.y,
          }
        ]}
      >
        <View style={[styles.plusContainer, { backgroundColor: color }]}>
          <Text style={styles.text}>+{value}</Text>
        </View>
      </View>
    );
  }
  
  // Safe initialization with fallbacks
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1); // Start at normal size
  const translateY = useSharedValue(0);
  
  useEffect(() => {
    // Reset values for immediate response
    opacity.value = 1;
    scale.value = 1;
    translateY.value = 0;
    
    // Start animation sequence - optimized for exactly 0.3 second duration
    try {
      // Scale up immediately to 150%
      scale.value = withTiming(1.5, {
        duration: 100, // Adjusted for shorter total duration
      });
      
      // Move up 80px
      translateY.value = withTiming(-80, {
        duration: 300, // 0.3 second duration as requested
      });
      
      // Fade out
      opacity.value = withTiming(0, {
        duration: 300, // 0.3 second duration as requested
      });
      
      // Set up a timeout to call the completion handler after exactly 0.3 second
      const completionTimeout = setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete(animationId);
        }
      }, 300); // 0.3 second duration as requested
      
      return () => clearTimeout(completionTimeout);
    } catch (error) {
      console.warn('Animation error:', error);
      // Fallback in case of animation error
      setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete(animationId);
        }
      }, 300); // 0.3 second duration as requested
      return () => {};
    }
  }, [value, onAnimationComplete, animationId]);
  
  // Create animated style
  const animatedStyle = useAnimatedStyle(() => {
    try {
      return {
        opacity: opacity.value,
        transform: [
          { scale: scale.value },
          { translateY: translateY.value }
        ]
      };
    } catch (error) {
      console.warn('Animation style error:', error);
      return {};
    }
  });
  
  // Fixed the type error by using a type assertion
  const AnimatedView = Animated;
  
  return (
    <View 
      style={[
        styles.container, 
        {
          position: 'absolute',
          left: position.x,
          top: position.y,
          zIndex: 5, // Lower zIndex to ensure it doesn't overlap button (which has zIndex 20)
        }
      ]}
      key={`animated-plus-${animationId}`}
    >
      <AnimatedView 
        style={[
          styles.plusContainer, 
          { backgroundColor: color },
          animatedStyle
        ]}
      >
        <Text style={styles.text}>+{value}</Text>
      </AnimatedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
    zIndex: 5, // Lower than button (20)
    width: 80, // Fixed width for positioning
    height: 80, // Fixed height for positioning
  },
  webContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
    zIndex: 5,
    width: 80,
    height: 80,
  },
  plusContainer: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});