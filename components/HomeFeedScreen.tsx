import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from './ui/scroll-area';
import { Compass, Sparkles } from 'lucide-react';
import { Adventure, User } from '../types';
import { AdventureFeedCard } from './AdventureFeedCard';
import { AdventureDetailView } from './AdventureDetailView';
import { MapItineraryView } from './MapItineraryView';
import { mockAdventures } from '../data/mockData';

interface HomeFeedScreenProps {
  user: User;
  onSaveAdventure: (adventure: Adventure, rating: number) => void;
  onPassAdventure: (adventure: Adventure, rating: number) => void;
}

export const HomeFeedScreen: React.FC<HomeFeedScreenProps> = ({
  user,
  onSaveAdventure,
  onPassAdventure,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedAdventures, setFeedAdventures] = useState<Adventure[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [detailAdventure, setDetailAdventure] = useState<Adventure | null>(null);
  const [mapAdventure, setMapAdventure] = useState<Adventure | null>(null);

  // Initialize feed with general recommendations
  useEffect(() => {
    const initialFeed = mockAdventures
      .map(adv => ({
        ...adv,
        id: `home-${adv.id}-${Math.random()}`,
        userRating: 50,
      }))
      .slice(0, 10);
    setFeedAdventures(initialFeed);
  }, []);

  const handleRating = (adventureId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [adventureId]: rating }));
  };

  const handleSave = (adventure: Adventure) => {
    const rating = ratings[adventure.id] || 50;
    onSaveAdventure(adventure, rating);
    advanceToNext();
  };

  const handlePass = (adventure: Adventure) => {
    const rating = ratings[adventure.id] || 50;
    onPassAdventure(adventure, rating);
    advanceToNext();
  };

  const advanceToNext = () => {
    if (currentIndex < feedAdventures.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Load more adventures when reaching the end
      const moreAdventures = mockAdventures
        .map(adv => ({
          ...adv,
          id: `home-${adv.id}-${Math.random()}`,
          userRating: 50,
        }))
        .slice(0, 5);
      setFeedAdventures([...feedAdventures, ...moreAdventures]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentAdventure = feedAdventures[currentIndex];

  return (
    <div className="flex-1 bg-[var(--ios-gray6)] flex flex-col">
      {/* Header - iOS Style */}
      <div className="ios-blur-light border-b border-[var(--border)] px-4 py-3 ios-shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--ios-blue)] rounded-[12px] flex items-center justify-center ios-shadow">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-[var(--foreground)]">
              Home Feed
            </h1>
            <p className="text-xs text-[var(--ios-gray)]">Explore & learn from endless adventures</p>
          </div>
        </div>
      </div>

      {/* Feed */}
      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto p-6">
          {!currentAdventure ? (
            <div className="h-full flex items-center justify-center py-20">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 mx-auto mb-4 bg-[var(--ios-gray5)] rounded-[16px] flex items-center justify-center"
                >
                  <Sparkles className="w-8 h-8 text-[var(--ios-blue)]" />
                </motion.div>
                <p className="text-[var(--ios-gray)]">Loading more adventures...</p>
              </div>
            </div>
          ) : (
            <motion.div
              key={currentAdventure.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <AdventureFeedCard
                adventure={currentAdventure}
                onRate={(rating) => handleRating(currentAdventure.id, rating)}
                onSave={() => handleSave(currentAdventure)}
                onPass={() => handlePass(currentAdventure)}
                onViewDetails={() => setDetailAdventure(currentAdventure)}
                onViewMap={() => setMapAdventure(currentAdventure)}
              />
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mt-4 text-sm text-[var(--ios-gray)]"
              >
                Adventure {currentIndex + 1} of {feedAdventures.length}
              </motion.div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Adventure Detail Modal */}
      {detailAdventure && (
        <AdventureDetailView
          adventure={detailAdventure}
          onClose={() => setDetailAdventure(null)}
          onSave={() => {
            handleSave(detailAdventure);
            setDetailAdventure(null);
          }}
          onViewMap={() => {
            setMapAdventure(detailAdventure);
            setDetailAdventure(null);
          }}
        />
      )}

      {/* Map View Modal */}
      {mapAdventure && (
        <MapItineraryView
          adventure={mapAdventure}
          onClose={() => setMapAdventure(null)}
        />
      )}
    </div>
  );
};