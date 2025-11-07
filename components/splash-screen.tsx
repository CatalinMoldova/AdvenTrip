import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export function SplashScreen() {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Animate in
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withRepeat(
      withSpring(1, {
        damping: 2,
        stiffness: 80,
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        {/* App Logo/Icon */}
        <Animated.View style={[styles.logoContainer, animatedStyle]}>
          {/* Replace with your app logo */}
          <View style={styles.logoPlaceholder}>
            <ThemedText style={styles.logoText}>🗺️</ThemedText>
          </View>
        </Animated.View>

        {/* App Name */}
        <ThemedText type="title" style={styles.appName}>
          AdvenTrip
        </ThemedText>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ThemedText style={styles.loadingText}>Loading...</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 24,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 64,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },
  loadingText: {
    fontSize: 14,
    opacity: 0.6,
  },
});


