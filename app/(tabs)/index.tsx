import { SwipeableCard } from '@/components/swipeable-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getPosts } from '@/services/postsService';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Gradient colors for cards (cycling through)
const GRADIENT_COLORS = [
  ['#ff6b6b', '#ee5a6f'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#ffa751', '#ffe259'],
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
] as const;

interface Post {
  id: string;
  title: string;
  destination: string;
  caption: string;
  trip_length: string;
  trip_budget?: string;
  image_links: string[] | null;
  user_id: string;
  users?: {
    name?: string;
    location?: string;
  };
}

interface TripCard {
  id: string;
  title: string;
  location: string;
  description: string;
  duration: string;
  budget?: string;
  gradient: readonly [string, string];
  imageUri?: string;
  // Full post data for detail screen
  postData: Post;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [trips, setTrips] = useState<TripCard[]>([]);
  const [loading, setLoading] = useState(true);
  // Track current image index for each card (by card id)
  const [cardImageIndices, setCardImageIndices] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const result = await getPosts(50);
      if (result.success && result.data) {
        // Transform posts into trip cards
        const transformedTrips: TripCard[] = result.data.map((post: Post, index: number) => {
          // Get first image from image_links JSONB array
          let imageUri: string | undefined;
          if (post.image_links) {
            if (Array.isArray(post.image_links)) {
              imageUri = post.image_links[0] || undefined;
            } else if (typeof post.image_links === 'object' && 'images' in post.image_links) {
              // Handle object format with images array
              const images = (post.image_links as any).images;
              imageUri = Array.isArray(images) && images.length > 0 ? images[0] : undefined;
            }
          }

          // Get location from destination or user location
          const location = post.destination || post.users?.location || 'Unknown Location';
          
          // Get description from caption
          const description = post.caption || '';

          // Get duration from trip_length
          const duration = post.trip_length || '';

          // Get budget from trip_budget
          const budget = post.trip_budget || undefined;

          // Cycle through gradient colors
          const gradient = GRADIENT_COLORS[index % GRADIENT_COLORS.length];

          return {
            id: post.id,
            title: post.title || 'Untitled Trip',
            location,
            description,
            duration,
            budget,
            gradient,
            imageUri,
            postData: post, // Store full post data
          };
        });

        setTrips(transformedTrips);
      } else {
        console.error('Failed to fetch posts:', result.msg);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipeLeft = () => {
    console.log('Swiped left (Pass)');
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setSwipeProgress(0);
    }, 300);
  };

  const handleSwipeRight = () => {
    console.log('Swiped right (Like)');
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setSwipeProgress(0);
    }, 300);
  };

  const handleSwipeProgress = (progress: number) => {
    setSwipeProgress(progress);
  };

  // Get all images for a card
  const getCardImages = (card: TripCard): string[] => {
    if (!card.postData.image_links) return [];
    if (Array.isArray(card.postData.image_links)) {
      return card.postData.image_links;
    }
    if (typeof card.postData.image_links === 'object' && 'images' in card.postData.image_links) {
      return (card.postData.image_links as any).images || [];
    }
    return [];
  };

  // Get current image for a card
  const getCurrentImage = (card: TripCard): string | undefined => {
    const images = getCardImages(card);
    if (images.length === 0) return undefined;
    const imageIndex = cardImageIndices[card.id] || 0;
    return images[imageIndex];
  };

  // Navigate to next/previous image
  const navigateImage = (cardId: string, direction: 'next' | 'prev') => {
    const card = trips.find(t => t.id === cardId);
    if (!card) return;
    
    const images = getCardImages(card);
    if (images.length <= 1) return;
    
    const currentIndex = cardImageIndices[cardId] || 0;
    let newIndex: number;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % images.length;
    } else {
      newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    }
    
    setCardImageIndices(prev => ({ ...prev, [cardId]: newIndex }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Navigate to trip detail screen
  const handleCardInfoTap = (card: TripCard) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/trip-detail?tripId=${card.id}` as any);
  };

  const visibleCards = trips.slice(currentIndex, currentIndex + 3);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.loadingText}>Loading trips...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Card Stack */}
      <View style={styles.cardStack}>
        {/* Title Overlay - Centered over card */}
        {visibleCards.length > 0 && (
          <View style={styles.titleOverlay}>
            {/* <Text style={styles.headerTitle}>
              Discover Trips
            </Text> */}
          </View>
        )}
        {visibleCards.length > 0 ? (
          visibleCards.map((card, index) => {
            const currentImage = getCurrentImage(card);
            const images = getCardImages(card);
            const hasMultipleImages = images.length > 1;
            
            return (
              <SwipeableCard
                key={card.id}
                index={index}
                totalCards={visibleCards.length}
                onSwipeLeft={index === 0 ? handleSwipeLeft : undefined}
                onSwipeRight={index === 0 ? handleSwipeRight : undefined}
                onSwipeProgress={index === 0 ? handleSwipeProgress : undefined}
              >
                <LinearGradient
                  colors={card.gradient}
                  style={styles.cardGradient}
                >
                  {/* Image area with left/right tap zones */}
                  <View style={styles.imageContainer}>
                    {currentImage ? (
                      <Image
                        source={{ uri: currentImage }}
                        style={styles.cardImage}
                        contentFit="cover"
                        placeholderContentFit="cover"
                      />
                    ) : (
                      <View style={[styles.cardImage, styles.placeholderImage]} />
                    )}
                    
                    {/* Left tap zone for previous image */}
                    {hasMultipleImages && index === 0 && (
                      <Pressable
                        style={styles.imageTapZoneLeft}
                        onPress={() => navigateImage(card.id, 'prev')}
                      />
                    )}
                    
                    {/* Right tap zone for next image */}
                    {hasMultipleImages && index === 0 && (
                      <Pressable
                        style={styles.imageTapZoneRight}
                        onPress={() => navigateImage(card.id, 'next')}
                      />
                    )}
                    
                    {/* Image indicator dots */}
                    {hasMultipleImages && index === 0 && images.length > 1 && (
                      <View style={styles.imageIndicatorContainer}>
                        {images.map((_, imgIndex) => (
                          <View
                            key={imgIndex}
                            style={[
                              styles.imageIndicatorDot,
                              (cardImageIndices[card.id] || 0) === imgIndex && styles.imageIndicatorDotActive
                            ]}
                          />
                        ))}
                      </View>
                    )}
                  </View>
                  
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.cardOverlay}
                  >
                    {/* Info section - tappable to navigate to detail */}
                    <Pressable
                      style={styles.cardContent}
                      onPress={() => index === 0 && handleCardInfoTap(card)}
                    >
                      <ThemedText style={styles.cardTitle}>{card.title}</ThemedText>
                      <View style={styles.locationRow}>
                        <IconSymbol name="mappin" size={16} color="#fff" />
                        <ThemedText style={styles.cardLocation}>{card.location}</ThemedText>
                      </View>
                      {card.description && (
                        <ThemedText style={styles.cardDescription}>
                          {card.description}
                        </ThemedText>
                      )}
                      <View style={styles.badgesRow}>
                        {card.duration && (
                          <View style={styles.durationBadge}>
                            <IconSymbol name="clock" size={14} color="#fff" />
                            <ThemedText style={styles.durationText}>
                              {(() => {
                                const durationStr = String(card.duration);
                                return durationStr.toLowerCase().includes('day') 
                                  ? durationStr 
                                  : `${durationStr} days`;
                              })()}
                            </ThemedText>
                          </View>
                        )}
                        {card.budget && (
                          <View style={styles.budgetBadge}>
                            <IconSymbol name="dollarsign.circle" size={14} color="#fff" />
                            <ThemedText style={styles.budgetText}>{card.budget}</ThemedText>
                          </View>
                        )}
                      </View>
                    </Pressable>
                  </LinearGradient>
                </LinearGradient>
              </SwipeableCard>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>No trips available</ThemedText>
            <ThemedText style={styles.emptySubtext}>Check back later for new adventures</ThemedText>
          </View>
        )}
      </View>

      {/* Swipe Progress Slider */}
      {visibleCards.length > 0 && (
        <View style={[styles.sliderContainer, { paddingBottom: 16 + insets.bottom + 49 }]}>
          <View style={styles.sliderTrack}>
            {/* Pass Side (Left) */}
            <View style={styles.sliderSide}>
              <IconSymbol name="xmark" size={16} color="#ff6b6b" />
              <ThemedText style={styles.sliderLabel}>Pass</ThemedText>
            </View>
            
            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                {/* Calculate indicator position (0% to 100%) */}
                {(() => {
                  const indicatorPosition = (swipeProgress + 1) * 50;
                  const isLeft = swipeProgress < 0;
                  const isRight = swipeProgress > 0;
                  
                  return (
                    <>
                      {/* Left fill - only extends from center to indicator when swiping left */}
                      {isLeft && (
                        <View 
                          style={[
                            styles.progressFillLeft,
                            { 
                              width: `${50 - indicatorPosition}%`,
                              left: `${indicatorPosition}%`
                            }
                          ]} 
                        />
                      )}
                      {/* Right fill - only extends from center to indicator when swiping right */}
                      {isRight && (
                        <View 
                          style={[
                            styles.progressFillRight,
                            { 
                              width: `${indicatorPosition - 50}%`,
                              left: '50%'
                            }
                          ]} 
                        />
                      )}
                      {/* Center indicator */}
                      <View 
                        style={[
                          styles.progressIndicator,
                          { 
                            left: `${indicatorPosition}%`,
                            backgroundColor: swipeProgress < -0.3 ? '#ff6b6b' 
                              : swipeProgress > 0.3 ? '#4facfe' 
                              : '#999'
                          }
                        ]} 
                      />
                    </>
                  );
                })()}
              </View>
            </View>

            {/* Like Side (Right) */}
            <View style={styles.sliderSide}>
              <IconSymbol name="heart.fill" size={16} color="#4facfe" />
              <ThemedText style={styles.sliderLabel}>Save</ThemedText>
            </View>
          </View>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleOverlay: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
    pointerEvents: 'none',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'semibold',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  cardStack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  imageContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  imageTapZoneLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '50%',
    height: '60%', // Above the info section
    zIndex: 5,
  },
  imageTapZoneRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '50%',
    height: '60%', // Above the info section
    zIndex: 5,
  },
  imageIndicatorContainer: {
    position: 'absolute',
    top: 16,
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
  cardOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
    borderRadius: 24,
  },
  cardContent: {
    gap: 10,
    minHeight: 120, // Ensure tap target is large enough
  },
  cardTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 36,
    fontFamily: 'NewSpirit-SemiBold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  cardLocation: {
    fontSize: 17,
    color: '#fff',
    opacity: 0.95,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardDescription: {
    fontSize: 15,
    color: '#fff',
    opacity: 0.85,
    marginTop: 6,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  durationText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  budgetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  budgetText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  sliderContainer: {
    paddingHorizontal: 20,
    paddingTop: 0,
    backgroundColor: 'transparent',
  },
  sliderTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  sliderSide: {
    alignItems: 'center',
    gap: 4,
    width: 56,
  },
  sliderLabel: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.7,
  },
  progressBarContainer: {
    flex: 1,
    height: 6,
  },
  progressBar: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 3,
    overflow: 'visible',
    position: 'relative',
    justifyContent: 'center',
    height: 6,
  },
  progressFillLeft: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#ff6b6b',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  progressFillRight: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#4facfe',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  progressIndicator: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: -8,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
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
  placeholderImage: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});
