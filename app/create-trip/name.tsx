import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TripNameScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [tripName, setTripName] = useState('');

  const handleNext = () => {
    if (!tripName.trim()) {
      Alert.alert('Trip Name Required', 'Please enter a name for your trip');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/create-trip/location',
      params: { tripName: String(tripName.trim() || '') },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <IconSymbol name="chevron.left" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
            </Pressable>
            <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Create Trip
            </Text>
            <View style={styles.backButton} /> {/* Spacer */}
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                What's the name of your trip?
              </Text>
              <Text style={[styles.subtitle, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
                Give your adventure a memorable name
              </Text>

              <View style={styles.inputContainer}>
                <ThemedInput
                  label="Trip Name"
                  value={tripName}
                  onChangeText={setTripName}
                  placeholder="e.g., Summer Trip, Europe Adventure"
                  autoCapitalize="words"
                  autoFocus
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }]}>
            <ThemedButton
              title="Next"
              onPress={handleNext}
              style={styles.nextButton}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    lineHeight: 22,
  },
  inputContainer: {
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  nextButton: {
    width: '100%',
  },
});

