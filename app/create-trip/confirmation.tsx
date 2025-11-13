import { ThemedButton } from '@/components/themed-button';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/contexts/AuthContext';
import { createTrip } from '@/services/tripsService';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TripConfirmationScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user } = useAuth();
  const params = useLocalSearchParams<{
    tripName: string | string[];
    startingLocation: string | string[];
    activities: string | string[];
    timePeriod: string | string[];
    transportation: string | string[];
    days: string | string[];
    destinationType: string | string[];
    destinationArea: string | string[];
    maxDistance: string | string[];
  }>();
  
  const tripName = String(Array.isArray(params.tripName) ? (params.tripName[0] || '') : (params.tripName || ''));
  const startingLocation = String(Array.isArray(params.startingLocation) ? (params.startingLocation[0] || '') : (params.startingLocation || ''));
  const activities = String(Array.isArray(params.activities) ? (params.activities[0] || '') : (params.activities || ''));
  const timePeriod = String(Array.isArray(params.timePeriod) ? (params.timePeriod[0] || '') : (params.timePeriod || ''));
  const transportation = String(Array.isArray(params.transportation) ? (params.transportation[0] || '') : (params.transportation || ''));
  const days = String(Array.isArray(params.days) ? (params.days[0] || '') : (params.days || ''));
  const destinationType = String(Array.isArray(params.destinationType) ? (params.destinationType[0] || '') : (params.destinationType || ''));
  const destinationArea = String(Array.isArray(params.destinationArea) ? (params.destinationArea[0] || '') : (params.destinationArea || ''));
  const maxDistance = String(Array.isArray(params.maxDistance) ? (params.maxDistance[0] || '') : (params.maxDistance || ''));

  const [loading, setLoading] = useState(false);
  const [tripId, setTripId] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);

  const handleCreateTrip = async () => {
    if (!user?.user?.id) {
      Alert.alert('Error', 'User not found. Please try logging in again.');
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const activitiesArray = JSON.parse(activities || '[]') as string[];

      const result = await createTrip(user.user.id, {
        name: tripName,
        starting_location: startingLocation,
        activities: activitiesArray,
        time_period: timePeriod as any,
        transportation: transportation as 'Road trip' | 'City to city' | 'Stay in the same city',
        days: parseInt(days, 10),
        destination_type: destinationType as 'specific' | 'random' | 'distance',
        destination_area: destinationType === 'specific' ? destinationArea : undefined,
        max_distance_miles: destinationType === 'distance' ? parseInt(maxDistance, 10) : undefined,
      });

      if (!result.success || !result.data) {
        Alert.alert('Error', result.msg || 'Failed to create trip. Please try again.');
        setLoading(false);
        return;
      }

      setTripId(result.data.id);
      setShareLink(result.data.share_link);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error creating trip:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!shareLink) return;

    try {
      const shareUrl = `adventrip://trip/${shareLink}`;
      await Share.share({
        message: `Join my trip "${tripName}"! Use this link: ${shareUrl}`,
        url: shareUrl,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopyLink = () => {
    if (!shareLink) return;
    // In a real app, you'd use Clipboard API here
    Alert.alert('Link Copied', `Share link: ${shareLink}`);
  };

  const handleFinish = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(tabs)/adventures');
  };

  if (!tripId || !shareLink) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <IconSymbol name="chevron.left" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
            </Pressable>
            <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Review
            </Text>
            <View style={styles.backButton} /> {/* Spacer */}
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.content}>
              <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                Review Your Trip
              </Text>
              <Text style={[styles.subtitle, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
                Confirm the details and create your adventure
              </Text>

              <View style={[styles.reviewCard, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
                <View style={styles.reviewRow}>
                  <Text style={[styles.reviewLabel, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>Trip Name:</Text>
                  <Text style={[styles.reviewValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>{tripName}</Text>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={[styles.reviewLabel, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>Starting Location:</Text>
                  <Text style={[styles.reviewValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>{startingLocation}</Text>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={[styles.reviewLabel, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>Duration:</Text>
                  <Text style={[styles.reviewValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>{String(days || '')} days</Text>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={[styles.reviewLabel, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>Time Period:</Text>
                  <Text style={[styles.reviewValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>{timePeriod}</Text>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={[styles.reviewLabel, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>Transportation:</Text>
                  <Text style={[styles.reviewValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>{transportation}</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }]}>
            <ThemedButton
              title="Create Adventure"
              onPress={handleCreateTrip}
              loading={loading}
              style={styles.createButton}
            />
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.successContent}>
            <View style={[styles.successIcon, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
              <IconSymbol name="checkmark.circle.fill" size={64} color="#34C759" />
            </View>
            <Text style={[styles.successTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Adventure Created!
            </Text>
            <Text style={[styles.successSubtitle, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
              Your trip "{tripName}" has been created successfully
            </Text>

            <View style={[styles.shareCard, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
              <Text style={[styles.shareTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                Share with Friends
              </Text>
              <Text style={[styles.shareLink, { color: isDark ? '#69B6FF' : '#007AFF' }]}>
                {shareLink}
              </Text>
              <View style={styles.shareButtons}>
                <Pressable
                  onPress={handleShare}
                  style={({ pressed }) => [
                    styles.shareButton,
                    {
                      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <IconSymbol name="square.and.arrow.up" size={20} color={isDark ? '#FFFFFF' : '#000000'} />
                  <Text style={[styles.shareButtonText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                    Share
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleCopyLink}
                  style={({ pressed }) => [
                    styles.shareButton,
                    {
                      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <IconSymbol name="doc.on.doc" size={20} color={isDark ? '#FFFFFF' : '#000000'} />
                  <Text style={[styles.shareButtonText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                    Copy
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }]}>
          <ThemedButton
            title="Done"
            onPress={handleFinish}
            style={styles.doneButton}
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
  reviewCard: {
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  reviewValue: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  successContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  shareCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  shareTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  shareLink: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  shareButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  shareButtonText: {
    fontSize: 16,
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
  createButton: {
    width: '100%',
  },
  doneButton: {
    width: '100%',
  },
});

