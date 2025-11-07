import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { getPostById } from '@/services/postsService';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Post {
  id: string;
  title: string;
  destination: string;
  caption: string;
  trip_length: string;
  trip_budget?: string;
  trip_accommodation?: any;
  trip_activities_tags?: any;
  trip_itinerary?: any;
  image_links: string[] | null;
  user_id: string;
  users?: {
    name?: string;
    location?: string;
  };
}

// Helper to parse JSONB arrays
const parseJsonbArray = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value.images)) return value.images;
    if (Array.isArray(value.items)) return value.items;
    if (Array.isArray(value.data)) return value.data;
  }
  return [];
};

// Helper to parse itinerary
const parseItinerary = (value: any): Array<{ day: number; description: string }> => {
  if (!value) return [];
  
  // Handle format: { "day_1": "...", "day_2": "..." }
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const days: Array<{ day: number; description: string }> = [];
    const keys = Object.keys(value).sort();
    
    keys.forEach((key) => {
      // Match day_1, day_2, etc.
      const dayMatch = key.match(/^day_(\d+)$/i);
      if (dayMatch) {
        const dayNumber = parseInt(dayMatch[1], 10);
        const description = typeof value[key] === 'string' ? value[key] : String(value[key]);
        days.push({ day: dayNumber, description });
      }
    });
    
    return days.sort((a, b) => a.day - b.day);
  }
  
  // Fallback for array format
  if (Array.isArray(value)) {
    return value.map((item, index) => {
      if (typeof item === 'string') {
        return { day: index + 1, description: item };
      }
      if (typeof item === 'object' && item !== null) {
        return {
          day: item.day || index + 1,
          description: item.description || item.activities?.[0] || String(item),
        };
      }
      return { day: index + 1, description: String(item) };
    });
  }
  
  return [];
};

export default function TripDetailScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (tripId) {
      fetchTripDetail();
    }
  }, [tripId]);

  const fetchTripDetail = async () => {
    if (!tripId) return;
    
    setLoading(true);
    try {
      const result = await getPostById(tripId);
      if (result.success && result.data && result.data.length > 0) {
        setPost(result.data[0]);
      }
    } catch (error) {
      console.error('Error fetching trip detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const images = post ? parseJsonbArray(post.image_links) : [];
  const activities = post ? parseJsonbArray(post.trip_activities_tags) : [];
  const accommodation = post?.trip_accommodation;
  const itinerary = post ? parseItinerary(post.trip_itinerary) : [];
  
  // Parse accommodation object
  const accommodationData = accommodation && typeof accommodation === 'object' && !Array.isArray(accommodation)
    ? accommodation
    : null;

  const navigateImage = (direction: 'next' | 'prev') => {
    if (images.length <= 1) return;
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    } else {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <ThemedText style={styles.loadingText}>Loading trip details...</ThemedText>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (!post) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>Trip not found</ThemedText>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <IconSymbol name="chevron.left" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            Trip Details
          </Text>
          <View style={styles.headerButton} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Image Gallery */}
          {images.length > 0 && (
            <View style={styles.imageGallery}>
              <Image
                source={{ uri: images[currentImageIndex] }}
                style={styles.mainImage}
                contentFit="cover"
              />
              
              {/* Image navigation */}
              {images.length > 1 && (
                <>
                  <Pressable
                    style={styles.imageNavLeft}
                    onPress={() => navigateImage('prev')}
                  >
                    <IconSymbol name="chevron.left" size={24} color="#fff" />
                  </Pressable>
                  <Pressable
                    style={styles.imageNavRight}
                    onPress={() => navigateImage('next')}
                  >
                    <IconSymbol name="chevron.right" size={24} color="#fff" />
                  </Pressable>
                  
                  {/* Image indicator */}
                  <View style={styles.imageIndicatorContainer}>
                    {images.map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.imageIndicatorDot,
                          currentImageIndex === index && styles.imageIndicatorDotActive
                        ]}
                      />
                    ))}
                  </View>
                </>
              )}
            </View>
          )}

          {/* Title and Location */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              {post.title}
            </Text>
            <View style={styles.locationRow}>
              <IconSymbol name="mappin" size={18} color={isDark ? '#8E8E93' : '#666'} />
              <Text style={[styles.location, { color: isDark ? '#8E8E93' : '#666' }]}>
                {post.destination || 'Unknown Location'}
              </Text>
            </View>
          </View>

          {/* Description */}
          {post.caption && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                About
              </Text>
              <Text style={[styles.description, { color: isDark ? '#E5E5EA' : '#333' }]}>
                {post.caption}
              </Text>
            </View>
          )}

          {/* Trip Info Grid */}
          <View style={styles.infoGrid}>
            {post.trip_length && (
              <View style={[styles.infoCard, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
                <IconSymbol name="clock" size={20} color={isDark ? '#8E8E93' : '#666'} />
                <Text style={[styles.infoLabel, { color: isDark ? '#8E8E93' : '#666' }]}>
                  Duration
                </Text>
                <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                  {post.trip_length}
                </Text>
              </View>
            )}
            
            {post.trip_budget && (
              <View style={[styles.infoCard, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
                <IconSymbol name="dollarsign.circle" size={20} color={isDark ? '#8E8E93' : '#666'} />
                <Text style={[styles.infoLabel, { color: isDark ? '#8E8E93' : '#666' }]}>
                  Budget
                </Text>
                <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                  {post.trip_budget}
                </Text>
              </View>
            )}
          </View>

          {/* Accommodation */}
          {accommodationData && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                Accommodation
              </Text>
              <View style={[styles.accommodationCard, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
                {accommodationData.hotel && (
                  <View style={styles.accommodationRow}>
                    <IconSymbol name="building.2" size={20} color={isDark ? '#8E8E93' : '#666'} />
                    <Text style={[styles.accommodationLabel, { color: isDark ? '#8E8E93' : '#666' }]}>
                      Hotel:
                    </Text>
                    <Text style={[styles.accommodationValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                      {accommodationData.hotel}
                    </Text>
                  </View>
                )}
                {accommodationData.rating && (
                  <View style={styles.accommodationRow}>
                    <IconSymbol name="star.fill" size={20} color="#FFD700" />
                    <Text style={[styles.accommodationLabel, { color: isDark ? '#8E8E93' : '#666' }]}>
                      Rating:
                    </Text>
                    <Text style={[styles.accommodationValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                      {accommodationData.rating}/5.0
                    </Text>
                  </View>
                )}
                {accommodationData.price_per_night && (
                  <View style={styles.accommodationRow}>
                    <IconSymbol name="dollarsign.circle" size={20} color={isDark ? '#8E8E93' : '#666'} />
                    <Text style={[styles.accommodationLabel, { color: isDark ? '#8E8E93' : '#666' }]}>
                      Price per night:
                    </Text>
                    <Text style={[styles.accommodationValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                      ${accommodationData.price_per_night}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Activities */}
          {activities.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                Activities
              </Text>
              <View style={styles.activitiesContainer}>
                {activities.map((activity, index) => (
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

          {/* Itinerary */}
          {itinerary.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                Day-by-Day Itinerary
              </Text>
              {itinerary.map((day, index) => (
                <View
                  key={index}
                  style={[styles.dayCard, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}
                >
                  <View style={styles.dayHeader}>
                    <View style={[styles.dayNumber, { backgroundColor: isDark ? '#1C1C1E' : '#E5E5EA' }]}>
                      <Text style={[styles.dayNumberText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                        Day {day.day}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dayDescription}>
                    <Text style={[styles.dayDescriptionText, { color: isDark ? '#E5E5EA' : '#333' }]}>
                      {day.description}
                    </Text>
                  </View>
                </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerButton: {
    padding: 8,
    minWidth: 44,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.6,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#007AFF',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageGallery: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageNavLeft: {
    position: 'absolute',
    left: 16,
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  imageNavRight: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  imageIndicatorContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    zIndex: 10,
  },
  imageIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  imageIndicatorDotActive: {
    backgroundColor: '#fff',
    width: 20,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'NewSpirit-SemiBold',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  location: {
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 12,
  },
  infoCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accommodationCard: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  accommodationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accommodationLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  accommodationValue: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
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
  dayCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  dayHeader: {
    marginBottom: 12,
  },
  dayNumber: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  dayNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  dayDescription: {
    marginTop: 8,
  },
  dayDescriptionText: {
    fontSize: 15,
    lineHeight: 22,
  },
});

