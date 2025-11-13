import { ThemedButton } from '@/components/themed-button';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TRAVEL_PREFERENCES } from '@/types/user';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TripActivitiesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams<{ tripName: string | string[]; startingLocation: string | string[] }>();
  const tripName = String(Array.isArray(params.tripName) ? (params.tripName[0] || '') : (params.tripName || ''));
  const startingLocation = String(Array.isArray(params.startingLocation) ? (params.startingLocation[0] || '') : (params.startingLocation || ''));
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const toggleActivity = (activity: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(selectedActivities.filter(a => a !== activity));
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const handleNext = () => {
    if (selectedActivities.length === 0) {
      Alert.alert('Activities Required', 'Please select at least one activity preference');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/create-trip/time-period',
      params: {
        tripName: String(tripName || ''),
        startingLocation: String(startingLocation || ''),
        activities: JSON.stringify(selectedActivities),
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
            Activities
          </Text>
          <View style={styles.backButton} /> {/* Spacer */}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              What activities interest you?
            </Text>
            <Text style={[styles.subtitle, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
              Select your travel preferences for this trip
            </Text>

            <View style={styles.activitiesGrid}>
              {TRAVEL_PREFERENCES.map((activity) => {
                const isSelected = selectedActivities.includes(activity);
                return (
                  <Pressable
                    key={activity}
                    onPress={() => toggleActivity(activity)}
                    style={({ pressed }) => [
                      styles.activityChip,
                      {
                        backgroundColor: isSelected
                          ? (isDark ? '#69B6FF' : '#CFEFFF')
                          : (isDark ? '#2C2C2E' : '#F2F2F7'),
                        borderColor: isSelected
                          ? (isDark ? '#007AFF' : '#69B6FF')
                          : (isDark ? '#3A3A3C' : '#DFDFDF'),
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.activityText,
                        { color: isDark ? '#FFFFFF' : '#000000' },
                        isSelected && styles.activityTextSelected
                      ]}
                    >
                      {activity}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {selectedActivities.length > 0 && (
              <Text style={[styles.selectedCount, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
                {selectedActivities.length} {selectedActivities.length === 1 ? 'activity' : 'activities'} selected
              </Text>
            )}
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
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  activityChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
  },
  activityText: {
    fontSize: 15,
    fontWeight: '500',
  },
  activityTextSelected: {
    fontWeight: '600',
  },
  selectedCount: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 24,
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

