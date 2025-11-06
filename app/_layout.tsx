import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import openDatabaseSync from 'expo-sqlite/kv-store';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { UserProvider } from '@/contexts/UserContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import '../global.css';

// 🚧 DEVELOPMENT MODE TOGGLE
// Set to true to always start at welcome screen for testing
// Set to false for production behavior (normal onboarding flow)
const DEV_MODE_ALWAYS_SHOW_WELCOME = true;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const router = useRouter();
  const segments = useSegments();
  const hasNavigated = useRef(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const checkOnboarding = async () => {
      try {
        const completed = await openDatabaseSync.getItem('hasCompletedOnboarding');
        setHasCompletedOnboarding(completed === 'true');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setIsReady(true);
      }
    };

    checkOnboarding();
  }, []);

  useEffect(() => {
    if (!isReady || hasNavigated.current) return;

    const inTabsGroup = segments[0] === '(tabs)';
    const onWelcome = segments[0] === 'welcome';

    if (DEV_MODE_ALWAYS_SHOW_WELCOME) {
      // 🚧 DEVELOPMENT MODE: Always start at welcome screen
      if (!onWelcome) {
        router.replace('/welcome');
        hasNavigated.current = true;
      }
    } else {
      // 📱 PRODUCTION MODE: Normal onboarding flow
      // Redirect to welcome if not completed onboarding and not already on welcome
      if (!hasCompletedOnboarding && !onWelcome) {
        router.replace('/welcome');
        hasNavigated.current = true;
      } 
      // Redirect to tabs if completed onboarding and on welcome
      else if (hasCompletedOnboarding && onWelcome) {
        router.replace('/(tabs)');
        hasNavigated.current = true;
      }
    }
  }, [isReady, hasCompletedOnboarding, segments]);

  if (!isReady) {
    return null; // Or return a splash screen component
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="edit-profile" 
              options={{ 
                presentation: 'modal', 
                headerShown: false,
                animation: 'slide_from_bottom'
              }} 
            />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
}
