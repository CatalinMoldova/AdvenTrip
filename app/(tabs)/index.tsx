import { SwipeableCard } from '@/components/swipeable-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getOptimizedImageUrl, getRandomUnsplashPhoto } from '@/utils/unsplash';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Sample trip data with Unsplash search queries
const INITIAL_TRIPS = [
  {
    id: 1,
    title: 'Tokyo Adventure',
    location: 'Tokyo, Japan',
    description: 'Explore ancient temples and modern city life',
    duration: '7 days',
    gradient: ['#ff6b6b', '#ee5a6f'] as const,
    searchQuery: 'Tokyo Japan temples skyline',
  },
  {
    id: 2,
    title: 'Paris Getaway',
    location: 'Paris, France',
    description: 'Experience the city of lights and romance',
    duration: '5 days',
    gradient: ['#4facfe', '#00f2fe'] as const,
    searchQuery: 'Paris Eiffel Tower city',
  },
  {
    id: 3,
    title: 'Bali Retreat',
    location: 'Bali, Indonesia',
    description: 'Relax on pristine beaches and lush rice terraces',
    duration: '10 days',
    gradient: ['#43e97b', '#38f9d7'] as const,
    searchQuery: 'Bali beach rice terraces',
  },
  {
    id: 4,
    title: 'New York Explorer',
    location: 'New York, USA',
    description: 'Discover the city that never sleeps',
    duration: '4 days',
    gradient: ['#fa709a', '#fee140'] as const,
    searchQuery: 'New York City Manhattan skyline',
  },
  {
    id: 5,
    title: 'Safari Adventure',
    location: 'Serengeti, Tanzania',
    description: 'Witness the great wildlife migration',
    duration: '8 days',
    gradient: ['#ffa751', '#ffe259'] as const,
    searchQuery: 'Tanzania safari wildlife savanna',
  },
];

export default function HomeScreen() {
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch images from Unsplash on mount
  useEffect(() => {
    async function loadImages() {
      setLoading(true);
      
      const tripsWithImages = await Promise.all(
        INITIAL_TRIPS.map(async (trip) => {
          const photo = await getRandomUnsplashPhoto(trip.searchQuery);
          const imageUrl = photo ? getOptimizedImageUrl(photo) : null;
          
          return {
            ...trip,
            image: imageUrl ? { uri: imageUrl } : require('@/assets/images/react-logo.png'),
            unsplashPhoto: photo, // Store photo data for attribution
          };
        })
      );

      setCards(tripsWithImages);
      setLoading(false);
    }

    loadImages();
  }, []);

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

  const visibleCards = cards.slice(currentIndex, currentIndex + 3);

  // Show loading state
  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007aff" />
          <ThemedText style={styles.loadingText}>Loading trips...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Discover Trips
        </ThemedText>
        {/* <ThemedText style={styles.headerSubtitle}>
          Swipe right to save • Swipe left to pass
        </ThemedText> */}
      </View>

      {/* Card Stack */}
      <View style={styles.cardStack}>
        {visibleCards.length > 0 ? (
          visibleCards.map((card, index) => (
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
                <Image
                  source={card.image}
                  style={styles.cardImage}
                  contentFit="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.cardOverlay}
                >
                  <View style={styles.cardContent}>
                    <ThemedText style={styles.cardTitle}>{card.title}</ThemedText>
                    <View style={styles.locationRow}>
                      <IconSymbol name="mappin" size={16} color="#fff" />
                      <ThemedText style={styles.cardLocation}>{card.location}</ThemedText>
                    </View>
                    <ThemedText style={styles.cardDescription}>
                      {card.description}
                    </ThemedText>
                    <View style={styles.durationBadge}>
                      <IconSymbol name="clock" size={14} color="#fff" />
                      <ThemedText style={styles.durationText}>{card.duration}</ThemedText>
                    </View>
                  </View>
                </LinearGradient>
              </LinearGradient>
            </SwipeableCard>
          ))
        ) : (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>No more trips!</ThemedText>
            <ThemedText style={styles.emptySubtext}>Check back later for new adventures</ThemedText>
          </View>
        )}
      </View>

      {/* Swipe Progress Slider */}
      {visibleCards.length > 0 && (
        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            {/* Pass Side (Left) */}
            <View style={styles.sliderSide}>
              <IconSymbol name="xmark" size={20} color="#ff6b6b" />
              <ThemedText style={styles.sliderLabel}>Pass</ThemedText>
            </View>
            
            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                {/* Negative (left) progress */}
                {swipeProgress < 0 && (
                  <View 
                    style={[
                      styles.progressFillLeft,
                      { width: `${Math.abs(swipeProgress) * 100}%` }
                    ]} 
                  />
                )}
                {/* Positive (right) progress */}
                {swipeProgress > 0 && (
                  <View 
                    style={[
                      styles.progressFillRight,
                      { width: `${swipeProgress * 100}%` }
                    ]} 
                  />
                )}
                {/* Center indicator */}
                <View 
                  style={[
                    styles.progressIndicator,
                    { 
                      left: `${(swipeProgress + 1) * 50}%`,
                      backgroundColor: swipeProgress < -0.3 ? '#ff6b6b' 
                        : swipeProgress > 0.3 ? '#4facfe' 
                        : '#666'
                    }
                  ]} 
                />
              </View>
            </View>

            {/* Like Side (Right) */}
            <View style={styles.sliderSide}>
              <IconSymbol name="heart.fill" size={20} color="#4facfe" />
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
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.6,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 20,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  cardStack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 20,
  },
  cardImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  cardOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    borderRadius: 20,
  },
  cardContent: {
    gap: 8,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 28,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardLocation: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  cardDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  durationText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  sliderContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    paddingTop: 20,
  },
  sliderTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderSide: {
    alignItems: 'center',
    gap: 4,
    width: 60,
  },
  sliderLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
  },
  progressBar: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  progressFillLeft: {
    position: 'absolute',
    right: '50%',
    height: '100%',
    backgroundColor: '#ff6b6b',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  progressFillRight: {
    position: 'absolute',
    left: '50%',
    height: '100%',
    backgroundColor: '#4facfe',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
});
