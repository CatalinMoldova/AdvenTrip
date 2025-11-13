import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/contexts/AuthContext';
import { getUserTrips, Trip } from '@/services/tripsService';
import * as Haptics from 'expo-haptics';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdventuresScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = useCallback(async () => {
    if (!user?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      const result = await getUserTrips(user.user.id);
      if (result.success && result.data) {
        setTrips(result.data);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      if (user?.user?.id) {
        fetchTrips();
      }
    }, [user, fetchTrips])
  );

  const handleCreateTrip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/create-trip/name');
  };

  const handleTripPress = (tripId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/trip-plan-detail?id=${tripId}`);
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <ThemedText style={styles.loadingText}>Loading trips...</ThemedText>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Trip Planner
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Plan and organize your adventures
          </ThemedText>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 20 + insets.bottom + 49 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Create New Trip Button */}
          <Pressable
            onPress={handleCreateTrip}
            style={({ pressed }) => [
              styles.createButton,
              {
                backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View style={styles.createButtonContent}>
              <View style={[styles.createIconContainer, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
                <IconSymbol name="plus" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
              </View>
              <View style={styles.createButtonText}>
                <Text style={[styles.createButtonTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                  Create New Adventure
                </Text>
                <Text style={[styles.createButtonSubtitle, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
                  Plan your next trip
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />
            </View>
          </Pressable>

          {/* Trips List */}
          {trips.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="map" size={64} color={isDark ? '#8E8E93' : '#8E8E93'} />
              <Text style={[styles.emptyStateTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                No trips yet
              </Text>
              <Text style={[styles.emptyStateText, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
                Create your first adventure to get started!
              </Text>
            </View>
          ) : (
            <View style={styles.tripsList}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                Your Trips
              </Text>
              {trips.map((trip) => (
                <Pressable
                  key={trip.id}
                  onPress={() => handleTripPress(trip.id)}
                  style={({ pressed }) => [
                    styles.tripCard,
                    {
                      backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <View style={styles.tripCardContent}>
                    <View style={styles.tripCardHeader}>
                      <IconSymbol name="map.fill" size={24} color={isDark ? '#69B6FF' : '#007AFF'} />
                      <Text style={[styles.tripName, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                        {trip.name}
                      </Text>
                    </View>
                    <View style={styles.tripDetails}>
                      <View style={styles.tripDetailRow}>
                        <IconSymbol name="location" size={16} color={isDark ? '#8E8E93' : '#8E8E93'} />
                        <Text style={[styles.tripDetailText, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
                          {trip.starting_location}
                        </Text>
                      </View>
                      <View style={styles.tripDetailRow}>
                        <IconSymbol name="clock" size={16} color={isDark ? '#8E8E93' : '#8E8E93'} />
                        <Text style={[styles.tripDetailText, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
                          {trip.days} days • {trip.time_period || ''}
                        </Text>
                      </View>
                      <View style={styles.tripDetailRow}>
                        <IconSymbol name="car.fill" size={16} color={isDark ? '#8E8E93' : '#8E8E93'} />
                        <Text style={[styles.tripDetailText, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
                          {trip.transportation}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <IconSymbol name="chevron.right" size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
  createButton: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  createButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  createIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    flex: 1,
  },
  createButtonTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  createButtonSubtitle: {
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 280,
  },
  tripsList: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  tripCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tripCardContent: {
    flex: 1,
    gap: 12,
  },
  tripCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tripName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  tripDetails: {
    gap: 8,
    marginLeft: 36,
  },
  tripDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tripDetailText: {
    fontSize: 14,
  },
});
