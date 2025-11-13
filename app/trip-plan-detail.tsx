import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/contexts/AuthContext';
import { getTripById, getTripMembers, updateTripBudget, deleteTrip, Trip, TripMember } from '@/services/tripsService';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Share, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TripPlanDetailScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [members, setMembers] = useState<TripMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState<string>('');
  const [savingBudget, setSavingBudget] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchTripData = useCallback(async () => {
    if (!id) return;

    try {
      const [tripResult, membersResult] = await Promise.all([
        getTripById(id),
        getTripMembers(id),
      ]);

      if (tripResult.success && tripResult.data) {
        setTrip(tripResult.data);
        setBudget(tripResult.data.budget?.toString() || '');
      }

      if (membersResult.success && membersResult.data) {
        setMembers(membersResult.data);
      }
    } catch (error) {
      console.error('Error fetching trip data:', error);
      Alert.alert('Error', 'Failed to load trip details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTripData();
  }, [fetchTripData]);

  const handleSaveBudget = async () => {
    if (!trip || !id) return;

    const budgetValue = budget.trim() === '' ? 0 : parseFloat(budget);
    if (isNaN(budgetValue) || budgetValue < 0) {
      Alert.alert('Invalid Budget', 'Please enter a valid budget amount');
      return;
    }

    setSavingBudget(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const result = await updateTripBudget(id, budgetValue);
      if (result.success && result.data) {
        setTrip(result.data);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Budget updated successfully');
      } else {
        Alert.alert('Error', result.msg || 'Failed to update budget');
      }
    } catch (error) {
      console.error('Error updating budget:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setSavingBudget(false);
    }
  };

  const handleShare = async () => {
    if (!trip) return;

    try {
      const shareUrl = `adventrip://trip/${trip.share_link}`;
      await Share.share({
        message: `Join my trip "${trip.name}"! Use this link: ${shareUrl}`,
        url: shareUrl,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopyLink = () => {
    if (!trip) return;
    Alert.alert('Link Copied', `Share link: ${trip.share_link}`);
  };

  const handleDeleteTrip = () => {
    if (!trip || !id) return;

    Alert.alert(
      'Delete Trip',
      `Are you sure you want to delete "${trip.name}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

            try {
              const result = await deleteTrip(id);
              if (result.success) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                router.replace('/(tabs)/adventures');
              } else {
                Alert.alert('Error', result.msg || 'Failed to delete trip');
                setDeleting(false);
              }
            } catch (error) {
              console.error('Error deleting trip:', error);
              Alert.alert('Error', 'Something went wrong');
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text style={[styles.loadingText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Loading trip details...
            </Text>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (!trip) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Trip not found
            </Text>
            <ThemedButton
              title="Go Back"
              onPress={() => router.back()}
              style={styles.backButton}
            />
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const activitiesArray = Array.isArray(trip.activities) ? trip.activities : [];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }]}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <IconSymbol name="chevron.left" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
            </Pressable>
            <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Trip Details
            </Text>
            <Pressable 
              onPress={handleDeleteTrip} 
              style={styles.settingsButton}
              disabled={deleting}
            >
              <IconSymbol 
                name="gearshape" 
                size={24} 
                color={isDark ? '#FFFFFF' : '#000000'} 
              />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: 20 + insets.bottom + 49 }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Trip Name */}
            <View style={styles.section}>
              <Text style={[styles.tripName, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                {trip.name}
              </Text>
            </View>

            {/* Share Link Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                Share Link
              </Text>
              <View style={[styles.shareCard, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
                <Text style={[styles.shareLink, { color: isDark ? '#69B6FF' : '#007AFF' }]}>
                  {trip.share_link}
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
                    <IconSymbol name="square.and.arrow.up" size={18} color={isDark ? '#FFFFFF' : '#000000'} />
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
                    <IconSymbol name="doc.on.doc" size={18} color={isDark ? '#FFFFFF' : '#000000'} />
                    <Text style={[styles.shareButtonText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                      Copy
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Trip Details */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                Trip Information
              </Text>
              <View style={[styles.detailsCard, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
                <View style={styles.detailRow}>
                  <IconSymbol name="location" size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />
                  <View style={styles.detailContent}>
                    <Text style={[styles.detailLabel, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
                      Starting Location
                    </Text>
                    <Text style={[styles.detailValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                      {trip.starting_location}
                    </Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <IconSymbol name="clock" size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />
                  <View style={styles.detailContent}>
                    <Text style={[styles.detailLabel, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
                      Duration & Time
                    </Text>
                    <Text style={[styles.detailValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                      {String(trip.days || '')} days in {String(trip.time_period || '')}
                    </Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <IconSymbol name="car.fill" size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />
                  <View style={styles.detailContent}>
                    <Text style={[styles.detailLabel, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
                      Transportation
                    </Text>
                    <Text style={[styles.detailValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                      {trip.transportation}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Activities */}
            {activitiesArray.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                  Activities
                </Text>
                <View style={styles.activitiesContainer}>
                  {activitiesArray.map((activity, index) => (
                    <View
                      key={index}
                      style={[styles.activityChip, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}
                    >
                      <Text style={[styles.activityText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                        {activity}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Budget */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                Maximum Budget
              </Text>
              <View style={[styles.budgetCard, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
                <ThemedInput
                  label="Budget (USD)"
                  value={budget}
                  onChangeText={setBudget}
                  placeholder="Enter budget amount"
                  keyboardType="numeric"
                  icon={<IconSymbol name="dollarsign.circle" size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />}
                />
                <ThemedButton
                  title="Save Budget"
                  onPress={handleSaveBudget}
                  loading={savingBudget}
                  variant="outline"
                  style={styles.saveBudgetButton}
                />
              </View>
            </View>

            {/* Group Members */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                Group Members ({String(members.length)})
              </Text>
              {members.length === 0 ? (
                <View style={[styles.emptyMembers, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
                  <Text style={[styles.emptyMembersText, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
                    No members yet. Share the link to invite friends!
                  </Text>
                </View>
              ) : (
                <View style={styles.membersList}>
                  {members.map((member) => (
                    <View
                      key={member.id}
                      style={[styles.memberCard, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}
                    >
                      <View style={[styles.memberAvatar, { backgroundColor: isDark ? '#1C1C1E' : '#E5E5EA' }]}>
                        <Text style={[styles.memberInitial, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                          {(member.users?.name || member.users?.email || 'U')[0].toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.memberInfo}>
                        <Text style={[styles.memberName, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                          {member.users?.name || member.users?.email || 'Unknown User'}
                        </Text>
                        {member.user_id === user?.user?.id && (
                          <Text style={[styles.memberLabel, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
                            You
                          </Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
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
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 24,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  tripName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  shareCard: {
    borderRadius: 16,
    padding: 20,
    gap: 16,
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
  detailsCard: {
    borderRadius: 16,
    padding: 20,
    gap: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailContent: {
    flex: 1,
    gap: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  activityChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  budgetCard: {
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  saveBudgetButton: {
    marginTop: 8,
  },
  membersList: {
    gap: 12,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInitial: {
    fontSize: 20,
    fontWeight: '600',
  },
  memberInfo: {
    flex: 1,
    gap: 4,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
  },
  memberLabel: {
    fontSize: 14,
  },
  emptyMembers: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  emptyMembersText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

