import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type DestinationType = 'specific' | 'random' | 'distance';

export default function TripDestinationScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams<{ tripName: string | string[]; startingLocation: string | string[]; activities: string | string[]; timePeriod: string | string[]; transportation: string | string[]; days: string | string[] }>();
  const tripName = String(Array.isArray(params.tripName) ? (params.tripName[0] || '') : (params.tripName || ''));
  const startingLocation = String(Array.isArray(params.startingLocation) ? (params.startingLocation[0] || '') : (params.startingLocation || ''));
  const activities = String(Array.isArray(params.activities) ? (params.activities[0] || '') : (params.activities || ''));
  const timePeriod = String(Array.isArray(params.timePeriod) ? (params.timePeriod[0] || '') : (params.timePeriod || ''));
  const transportation = String(Array.isArray(params.transportation) ? (params.transportation[0] || '') : (params.transportation || ''));
  const days = String(Array.isArray(params.days) ? (params.days[0] || '') : (params.days || ''));
  const [destinationType, setDestinationType] = useState<DestinationType | null>(null);
  const [specificArea, setSpecificArea] = useState('');
  const [maxDistance, setMaxDistance] = useState(100);

  const handleSelectType = (type: DestinationType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDestinationType(type);
  };

  const handleNext = () => {
    if (!destinationType) return;
    
    if (destinationType === 'specific' && !specificArea.trim()) {
      Alert.alert('Area Required', 'Please enter a specific destination area');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/create-trip/confirmation',
      params: {
        tripName: String(tripName || ''),
        startingLocation: String(startingLocation || ''),
        activities: String(activities || ''),
        timePeriod: String(timePeriod || ''),
        transportation: String(transportation || ''),
        days: String(days || ''),
        destinationType: String(destinationType || ''),
        destinationArea: String(destinationType === 'specific' ? specificArea.trim() : ''),
        maxDistance: String(destinationType === 'distance' ? maxDistance.toString() : ''),
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
              Destination
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
                Where do you want to go?
              </Text>
              <Text style={[styles.subtitle, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
                Choose how you want to select your destination
              </Text>

              <View style={styles.optionsContainer}>
                {/* Specific Area Option */}
                <Pressable
                  onPress={() => handleSelectType('specific')}
                  style={({ pressed }) => [
                    styles.optionButton,
                    {
                      backgroundColor: destinationType === 'specific'
                        ? (isDark ? '#69B6FF' : '#CFEFFF')
                        : (isDark ? '#2C2C2E' : '#F2F2F7'),
                      borderColor: destinationType === 'specific'
                        ? (isDark ? '#007AFF' : '#69B6FF')
                        : (isDark ? '#3A3A3C' : '#DFDFDF'),
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <View style={styles.optionContent}>
                    <IconSymbol name="location.fill" size={24} color={destinationType === 'specific' ? (isDark ? '#007AFF' : '#69B6FF') : (isDark ? '#8E8E93' : '#8E8E93')} />
                    <Text
                      style={[
                        styles.optionText,
                        { color: isDark ? '#FFFFFF' : '#000000' },
                        destinationType === 'specific' && styles.optionTextSelected
                      ]}
                    >
                      Type in a specific area
                    </Text>
                  </View>
                  {destinationType === 'specific' && (
                    <IconSymbol name="checkmark.circle.fill" size={24} color={isDark ? '#007AFF' : '#69B6FF'} />
                  )}
                </Pressable>

                {destinationType === 'specific' && (
                  <View style={styles.inputWrapper}>
                    <ThemedInput
                      label="Destination Area"
                      value={specificArea}
                      onChangeText={setSpecificArea}
                      placeholder="e.g., Paris, France"
                      autoCapitalize="words"
                      autoFocus
                    />
                  </View>
                )}

                {/* Random Location Option */}
                <Pressable
                  onPress={() => handleSelectType('random')}
                  style={({ pressed }) => [
                    styles.optionButton,
                    {
                      backgroundColor: destinationType === 'random'
                        ? (isDark ? '#69B6FF' : '#CFEFFF')
                        : (isDark ? '#2C2C2E' : '#F2F2F7'),
                      borderColor: destinationType === 'random'
                        ? (isDark ? '#007AFF' : '#69B6FF')
                        : (isDark ? '#3A3A3C' : '#DFDFDF'),
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <View style={styles.optionContent}>
                    <IconSymbol name="shuffle" size={24} color={destinationType === 'random' ? (isDark ? '#007AFF' : '#69B6FF') : (isDark ? '#8E8E93' : '#8E8E93')} />
                    <Text
                      style={[
                        styles.optionText,
                        { color: isDark ? '#FFFFFF' : '#000000' },
                        destinationType === 'random' && styles.optionTextSelected
                      ]}
                    >
                      Random location
                    </Text>
                  </View>
                  {destinationType === 'random' && (
                    <IconSymbol name="checkmark.circle.fill" size={24} color={isDark ? '#007AFF' : '#69B6FF'} />
                  )}
                </Pressable>

                {/* Distance Slider Option */}
                <Pressable
                  onPress={() => handleSelectType('distance')}
                  style={({ pressed }) => [
                    styles.optionButton,
                    {
                      backgroundColor: destinationType === 'distance'
                        ? (isDark ? '#69B6FF' : '#CFEFFF')
                        : (isDark ? '#2C2C2E' : '#F2F2F7'),
                      borderColor: destinationType === 'distance'
                        ? (isDark ? '#007AFF' : '#69B6FF')
                        : (isDark ? '#3A3A3C' : '#DFDFDF'),
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <View style={styles.optionContent}>
                    <IconSymbol name="slider.horizontal.3" size={24} color={destinationType === 'distance' ? (isDark ? '#007AFF' : '#69B6FF') : (isDark ? '#8E8E93' : '#8E8E93')} />
                    <Text
                      style={[
                        styles.optionText,
                        { color: isDark ? '#FFFFFF' : '#000000' },
                        destinationType === 'distance' && styles.optionTextSelected
                      ]}
                    >
                      Custom Maximum distance
                    </Text>
                  </View>
                  {destinationType === 'distance' && (
                    <IconSymbol name="checkmark.circle.fill" size={24} color={isDark ? '#007AFF' : '#69B6FF'} />
                  )}
                </Pressable>

                {destinationType === 'distance' && (
                  <View style={styles.distanceWrapper}>
                    <View style={[styles.distanceContainer, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
                      <Text style={[styles.distanceLabel, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                        Maximum Distance: {maxDistance} miles
                      </Text>
                      <View style={styles.distanceControls}>
                        <Pressable
                          onPress={() => {
                            if (maxDistance > 10) {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              setMaxDistance(maxDistance - 10);
                            }
                          }}
                          style={({ pressed }) => [
                            styles.distanceButton,
                            {
                              backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                              opacity: pressed ? 0.7 : 1,
                            },
                          ]}
                          disabled={maxDistance <= 10}
                        >
                          <IconSymbol name="minus" size={20} color={maxDistance <= 10 ? (isDark ? '#8E8E93' : '#8E8E93') : (isDark ? '#FFFFFF' : '#000000')} />
                        </Pressable>
                        <View style={[styles.distanceDisplay, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
                          <Text style={[styles.distanceValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                            {maxDistance}
                          </Text>
                          <Text style={[styles.distanceUnit, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
                            miles
                          </Text>
                        </View>
                        <Pressable
                          onPress={() => {
                            if (maxDistance < 500) {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              setMaxDistance(maxDistance + 10);
                            }
                          }}
                          style={({ pressed }) => [
                            styles.distanceButton,
                            {
                              backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                              opacity: pressed ? 0.7 : 1,
                            },
                          ]}
                          disabled={maxDistance >= 500}
                        >
                          <IconSymbol name="plus" size={20} color={maxDistance >= 500 ? (isDark ? '#8E8E93' : '#8E8E93') : (isDark ? '#FFFFFF' : '#000000')} />
                        </Pressable>
                      </View>
                      <View style={styles.distanceRange}>
                        <Text style={[styles.distanceRangeText, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>10 mi</Text>
                        <Text style={[styles.distanceRangeText, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>500 mi</Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }]}>
            <ThemedButton
              title="Next"
              onPress={handleNext}
              disabled={!destinationType || (destinationType === 'specific' && !specificArea.trim())}
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
  inputWrapper: {
    marginTop: 8,
    marginBottom: 8,
  },
  distanceWrapper: {
    marginTop: 8,
    marginBottom: 8,
  },
  distanceContainer: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  distanceLabel: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  distanceControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  distanceButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  distanceDisplay: {
    width: 100,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  distanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  distanceUnit: {
    fontSize: 14,
  },
  distanceRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  distanceRangeText: {
    fontSize: 12,
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

