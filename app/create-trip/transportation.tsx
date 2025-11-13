import { ThemedButton } from '@/components/themed-button';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Transportation = 'Road trip' | 'City to city' | 'Stay in the same city';

const TRANSPORTATION_OPTIONS: Transportation[] = ['Road trip', 'City to city', 'Stay in the same city'];

export default function TripTransportationScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams<{ tripName: string | string[]; startingLocation: string | string[]; activities: string | string[]; timePeriod: string | string[] }>();
  const tripName = String(Array.isArray(params.tripName) ? (params.tripName[0] || '') : (params.tripName || ''));
  const startingLocation = String(Array.isArray(params.startingLocation) ? (params.startingLocation[0] || '') : (params.startingLocation || ''));
  const activities = String(Array.isArray(params.activities) ? (params.activities[0] || '') : (params.activities || ''));
  const timePeriod = String(Array.isArray(params.timePeriod) ? (params.timePeriod[0] || '') : (params.timePeriod || ''));
  const [selectedTransport, setSelectedTransport] = useState<Transportation | null>(null);

  const handleSelect = (transport: Transportation) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTransport(transport);
  };

  const handleNext = () => {
    if (!selectedTransport) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/create-trip/days',
      params: {
        tripName: String(tripName || ''),
        startingLocation: String(startingLocation || ''),
        activities: String(activities || ''),
        timePeriod: String(timePeriod || ''),
        transportation: String(selectedTransport || ''),
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
            Transportation
          </Text>
          <View style={styles.backButton} /> {/* Spacer */}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              How do you want to travel?
            </Text>
            <Text style={[styles.subtitle, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
              Select your preferred means of transport
            </Text>

            <View style={styles.optionsContainer}>
              {TRANSPORTATION_OPTIONS.map((transport) => {
                const isSelected = selectedTransport === transport;
                return (
                  <Pressable
                    key={transport}
                    onPress={() => handleSelect(transport)}
                    style={({ pressed }) => [
                      styles.optionButton,
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
                    <View style={styles.optionContent}>
                      <IconSymbol 
                        name={transport === 'Road trip' ? 'car.fill' : transport === 'City to city' ? 'airplane' : 'building.2.fill'} 
                        size={24} 
                        color={isSelected ? (isDark ? '#007AFF' : '#69B6FF') : (isDark ? '#8E8E93' : '#8E8E93')} 
                      />
                      <Text
                        style={[
                          styles.optionText,
                          { color: isDark ? '#FFFFFF' : '#000000' },
                          isSelected && styles.optionTextSelected
                        ]}
                      >
                        {transport}
                      </Text>
                    </View>
                    {isSelected && (
                      <IconSymbol name="checkmark.circle.fill" size={24} color={isDark ? '#007AFF' : '#69B6FF'} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }]}>
          <ThemedButton
            title="Next"
            onPress={handleNext}
            disabled={!selectedTransport}
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
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
  },
  optionTextSelected: {
    fontWeight: '600',
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

