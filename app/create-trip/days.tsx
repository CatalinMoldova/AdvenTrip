import { ThemedButton } from '@/components/themed-button';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TripDaysScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams<{ tripName: string | string[]; startingLocation: string | string[]; activities: string | string[]; timePeriod: string | string[]; transportation: string | string[] }>();
  const tripName = String(Array.isArray(params.tripName) ? (params.tripName[0] || '') : (params.tripName || ''));
  const startingLocation = String(Array.isArray(params.startingLocation) ? (params.startingLocation[0] || '') : (params.startingLocation || ''));
  const activities = String(Array.isArray(params.activities) ? (params.activities[0] || '') : (params.activities || ''));
  const timePeriod = String(Array.isArray(params.timePeriod) ? (params.timePeriod[0] || '') : (params.timePeriod || ''));
  const transportation = String(Array.isArray(params.transportation) ? (params.transportation[0] || '') : (params.transportation || ''));
  const [days, setDays] = useState(7);

  const handleDecrease = () => {
    if (days > 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setDays(days - 1);
    }
  };

  const handleIncrease = () => {
    if (days < 365) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setDays(days + 1);
    }
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/create-trip/destination',
      params: {
        tripName: String(tripName || ''),
        startingLocation: String(startingLocation || ''),
        activities: String(activities || ''),
        timePeriod: String(timePeriod || ''),
        transportation: String(transportation || ''),
        days: days.toString(),
      },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            Trip Duration
          </Text>
          <View style={styles.backButton} /> {/* Spacer */}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              How many days?
            </Text>
            <Text style={[styles.subtitle, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
              Select the duration of your trip
            </Text>

            <View style={styles.daysContainer}>
              <Pressable
                onPress={handleDecrease}
                style={({ pressed }) => [
                  styles.daysButton,
                  {
                    backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                disabled={days <= 1}
              >
                <IconSymbol name="minus" size={24} color={days <= 1 ? (isDark ? '#8E8E93' : '#8E8E93') : (isDark ? '#FFFFFF' : '#000000')} />
              </Pressable>

              <View style={[styles.daysDisplay, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
                <Text style={[styles.daysNumber, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                  {days}
                </Text>
                <Text style={[styles.daysLabel, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
                  {days === 1 ? 'day' : 'days'}
                </Text>
              </View>

              <Pressable
                onPress={handleIncrease}
                style={({ pressed }) => [
                  styles.daysButton,
                  {
                    backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                disabled={days >= 365}
              >
                <IconSymbol name="plus" size={24} color={days >= 365 ? (isDark ? '#8E8E93' : '#8E8E93') : (isDark ? '#FFFFFF' : '#000000')} />
              </Pressable>
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
    paddingBottom: 100,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 48,
    lineHeight: 22,
    textAlign: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  daysButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  daysDisplay: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  daysNumber: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  daysLabel: {
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  nextButton: {
    width: '100%',
  },
});

