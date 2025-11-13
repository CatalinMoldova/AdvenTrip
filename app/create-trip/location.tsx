import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TripLocationScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams<{ tripName: string | string[] }>();
  const tripName = String(Array.isArray(params.tripName) ? (params.tripName[0] || '') : (params.tripName || ''));
  const [startingLocation, setStartingLocation] = useState('');

  const handleNext = () => {
    if (!startingLocation.trim()) {
      Alert.alert('Location Required', 'Please enter a starting location for your trip');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/create-trip/activities',
      params: { 
        tripName: String(tripName || ''),
        startingLocation: String(startingLocation.trim() || ''),
      },
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
              Starting Location
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
                Where will your trip start?
              </Text>
              <Text style={[styles.subtitle, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
                Enter the city or location where you'll begin your adventure
              </Text>

              <View style={styles.inputContainer}>
                <ThemedInput
                  label="Starting Location"
                  value={startingLocation}
                  onChangeText={setStartingLocation}
                  placeholder="e.g., New York, San Francisco"
                  autoCapitalize="words"
                  autoFocus
                  icon={<IconSymbol name="location" size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />}
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

