import { SplashScreen } from '@/components/splash-screen';
import { UserProvider } from '@/contexts/UserContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { getUserData } from '@/services/userService';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Session } from '@supabase/supabase-js';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreenExpo from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import '../global.css';

// Keep the splash screen visible while we fetch resources
SplashScreenExpo.preventAutoHideAsync();

const _layout = () => {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  )
}


const RootLayout = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const {setAuth, setUserData, user} = useAuth();
  
  const [authLoading, setAuthLoading] = useState(true);
  
  // Load custom fonts
  const [fontsLoaded, fontError] = useFonts({
    'NewSpirit': require('../assets/fonts/New-Spirit.otf'),
    'NewSpirit-SemiBold': require('../assets/fonts/New-Spirit-Semi-Bold.otf'),
    // Add other font weights if you have them:
    // 'NewSpirit-Bold': require('../assets/fonts/NewSpirit-Bold.ttf'),
  });

  useEffect(() => {
    // Check for existing session on app start
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session check:', session?.user?.id);
        setAuth(session);
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        // Give a small delay for smooth transition
        setTimeout(() => {
          setAuthLoading(false);
        }, 1000);
      }
    };

    checkSession();

    // Set up auth state listener for subsequent changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.id);
      setAuth(session);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateUserData = async (user: Session['user'] | undefined) => {
    if (!user?.id) return;
    
    let res = await getUserData(user.id);
    // console.log('got user data:', res);
    if (res.success) setUserData(res.data);
    return res;
  }

  // Handle navigation based on auth state
  useEffect(() => {
    if (authLoading) return; // Don't navigate while checking auth

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'signup' || segments[0] === 'welcome';
    const inOnboarding = segments[0] === 'onboarding';
    const isOnboardingLoading = segments[1] === 'loading';

    if (user) {
      // User is authenticated
      if (inAuthGroup) {
        // Coming from auth screens - check onboarding status
        const checkOnboardingStatus = async () => {
          const userData = await updateUserData(user.user);
          
          // If user hasn't completed onboarding (or no user data exists yet), send to onboarding
          // New signups won't have a users table row yet, so treat that as not completed
          if (!userData?.success || !userData.data || !userData.data?.onboarding_completed) {
            router.replace('/onboarding/location');
          } else {
            // User has completed onboarding, go to home
            router.replace('/(tabs)');
          }
        };
        
        checkOnboardingStatus();
      }
      // If already in onboarding (including loading screen), let them continue
      // Don't redirect if they're on the loading screen
      if (isOnboardingLoading) {
        return; // Let the loading screen handle its own navigation
      }
    } else {
      // User is not authenticated - redirect to welcome if trying to access app
      if (!inAuthGroup && !inOnboarding && segments[0] !== 'modal') {
        router.replace('/welcome');
      }
    }
  }, [user, segments, authLoading]);

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreenExpo.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Show splash screen while checking authentication or loading fonts
  if (authLoading || !fontsLoaded) {
    return <SplashScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding/location" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding/interests" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding/loading" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="edit-profile" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_right'
              }} 
            />
            <Stack.Screen 
              name="settings" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_right'
              }} 
            />
            <Stack.Screen 
              name="trip-detail" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_right'
              }} 
            />
            <Stack.Screen 
              name="trip-plan-detail" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_right'
              }} 
            />
            <Stack.Screen 
              name="create-trip/name" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_right'
              }} 
            />
            <Stack.Screen 
              name="create-trip/location" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_right'
              }} 
            />
            <Stack.Screen 
              name="create-trip/activities" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_right'
              }} 
            />
            <Stack.Screen 
              name="create-trip/time-period" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_right'
              }} 
            />
            <Stack.Screen 
              name="create-trip/transportation" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_right'
              }} 
            />
            <Stack.Screen 
              name="create-trip/days" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_right'
              }} 
            />
            <Stack.Screen 
              name="create-trip/destination" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_right'
              }} 
            />
            <Stack.Screen 
              name="create-trip/confirmation" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_right'
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

export default _layout;