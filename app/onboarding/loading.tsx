import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const OnboardingLoading = () => {
  const router = useRouter();

  useEffect(() => {
    // Navigate to home screen after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.text}>Curating adventures just for you</Text>
          <ActivityIndicator 
            size="large" 
            color="#006AC0" 
            style={styles.loader}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default OnboardingLoading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#97D2EE',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#97D2EE',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  text: {
    fontSize: 42,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'NewSpirit-SemiBold',
  },
  loader: {
    marginTop: 20,
  },
});

