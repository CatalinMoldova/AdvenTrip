import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const ROTATION_ANGLE = 60;

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  index: number;
  totalCards: number;
  onSwipeProgress?: (progress: number) => void;
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  index,
  totalCards,
  onSwipeProgress,
}: SwipeableCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const handleSwipeLeft = useCallback(() => {
    if (onSwipeLeft) {
      onSwipeLeft();
    }
  }, [onSwipeLeft]);

  const handleSwipeRight = useCallback(() => {
    if (onSwipeRight) {
      onSwipeRight();
    }
  }, [onSwipeRight]);

  const updateProgress = useCallback((value: number) => {
    if (onSwipeProgress) {
      onSwipeProgress(value);
    }
  }, [onSwipeProgress]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      scale.value = withSpring(0.95);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      
      // Update progress callback with normalized value (-1 to 1)
      const progress = Math.max(-1, Math.min(1, event.translationX / SWIPE_THRESHOLD));
      runOnJS(updateProgress)(progress);
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        // Swipe detected
        const direction = event.translationX > 0 ? 1 : -1;
        
        // Trigger haptic feedback
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);

        // Animate off screen
        translateX.value = withTiming(direction * SCREEN_WIDTH * 1.5, { duration: 300 });
        translateY.value = withTiming(event.translationY, { duration: 300 });
        
        // Call the appropriate callback
        if (direction === 1) {
          runOnJS(handleSwipeRight)();
        } else {
          runOnJS(handleSwipeLeft)();
        }
      } else {
        // Return to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        runOnJS(updateProgress)(0);
      }
      scale.value = withSpring(1);
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-ROTATION_ANGLE, 0, ROTATION_ANGLE]
    );

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [1, 0.8]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
        { scale: scale.value },
      ],
      opacity,
    };
  });

  // Style for cards behind the top card
  const cardScale = 1 - index * 0.05;
  const cardTranslateY = index * 10;

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [
            { scale: cardScale },
            { translateY: cardTranslateY },
          ],
          zIndex: totalCards - index,
        },
      ]}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, animatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH - 32,
    height: SCREEN_HEIGHT * 0.72,
    top: 64,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
});

