import { ThemedText } from '@/components/themed-text';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import openDatabaseSync from 'expo-sqlite/kv-store';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';


const { width, height } = Dimensions.get('window');

const STORIES = [
  {
    id: 1,
    title: 'Get trips out\nof the group chat.',
    image: require('@/assets/images/onboarding-1.png'),
    background: '#f0ebd7',
  },
  {
    id: 2,
    title: 'Plan your next\nadventure.',
    image: require('@/assets/images/onboarding-2.png'),
    background: '#f3d5c8',
  },
  {
    id: 3,
    title: 'Explore trip ideas.',
    image: require('@/assets/images/onboarding-3.png'),
    background: '#cbdf88',
  },
  {
    id: 4,
    title: 'Explore trip ideas.',
    image: require('@/assets/images/onboarding-4.png'),
    background: '#cbdf88',
  },
  {
    id: 5,
    title: 'Explore trip ideas.',
    image: require('@/assets/images/onboarding-5.png'),
    background: '#cbdf88',
  },
];

const STORY_DURATION = 3000; // 3 seconds

export default function WelcomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Trigger haptic when button is first pressed
  const handleButtonPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // Navigate to home screen
  const handleGetStarted = async () => {
    try {
      await openDatabaseSync.setItem('hasCompletedOnboarding', 'true');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving onboarding:', error);
      router.replace('/(tabs)');
    }
  };

  // Reset timer - call this whenever story changes
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentIndex((prev) => (prev + 1) % STORIES.length);
    }, STORY_DURATION);
  };

  // Change to specific index and reset timer
  const changeStory = (newIndex: number) => {
    // Light haptic feedback for story navigation
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const nextIndex = (newIndex + STORIES.length) % STORIES.length;
    setCurrentIndex(nextIndex);
    resetTimer(); // Reset timer on manual navigation
  };

  // Handle tap on left or right side of screen
  const handleTap = (event: any) => {
    const { locationX } = event.nativeEvent;
    if (locationX < width / 2) {
      changeStory(currentIndex - 1); // Go back
    } else {
      changeStory(currentIndex + 1); // Go forward
    }
  };

  // Set up auto-advance timer when story changes
  useEffect(() => {
    resetTimer();
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex]);

  const currentStory = STORIES[currentIndex];

  return (
    <View style={{backgroundColor: currentStory.background, flex: 1}}>
      {/* Background Image */}
      <Image
        source={currentStory.image}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      
      {/* Dark Overlay */}
      {/* <View style={styles.overlay} /> */}

      {/* Tap Area for Navigation */}
      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={styles.tapArea} />
      </TouchableWithoutFeedback>

      {/* Progress Bars */}
      <View style={styles.progressContainer}>
        {STORIES.map((story, index) => (
          <ProgressBar
            key={story.id}
            isActive={index === currentIndex}
            isPast={index < currentIndex}
            duration={STORY_DURATION}
            currentIndex={currentIndex}
          />
        ))}
      </View>

      {/* Title */}
      <View style={styles.content}>
        {/* <ThemedText style={styles.title} >
          {currentStory.title}
        </ThemedText> */}
      </View>

      {/* Get Started Button */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? '#000000' : '#161616' }
          ]}
          onPressIn={handleButtonPressIn}
          onPress={handleGetStarted}
        >
          <ThemedText style={styles.buttonText}>
            Get Started
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

function ProgressBar({ 
  isActive, 
  isPast, 
  duration, 
  currentIndex 
}: { 
  isActive: boolean; 
  isPast: boolean; 
  duration: number;
  currentIndex: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      // Always restart from 0 when this bar becomes active
      progress.value = 0;
      progress.value = withTiming(1, { duration });
    } else if (isPast) {
      progress.value = 1;
    } else {
      progress.value = 0;
    }
  }, [isActive, isPast, currentIndex]); // Added currentIndex to ensure restart

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground}>
        <Animated.View style={[styles.progressBarFill, animatedStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    width,
    height,
  },
  overlay: {
    position: 'absolute',
    width,
    height,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  tapArea: {
    position: 'absolute',
    width,
    height,
    zIndex: 5,
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 70,
    gap: 4,
    zIndex: 10,
  },
  progressBarContainer: {
    flex: 1,
    height: 5,
  },
  progressBarBackground: {
    flex: 1,
    backgroundColor: 'rgba(96, 96, 96, 0.3)',
    // backgroundColor: '#161616',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#161616',
    borderRadius: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
    lineHeight: 48,
    textAlign: 'left',
    fontFamily: 'ui-rounded',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 60,
    zIndex: 10,
  },
  button: {
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});