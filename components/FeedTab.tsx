import { useState } from 'react';
import { Adventure } from '../types';
import { SwipeableAdventureCard } from './SwipeableAdventureCard';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';

interface FeedTabProps {
  adventures: Adventure[];
  onSaveTrip?: (adventure: Adventure, rating: number) => void;
  onDiscardTrip?: (adventure: Adventure) => void;
  startLocation?: string;
}

export function FeedTab({ 
  adventures, 
  onSaveTrip, 
  onDiscardTrip,
  startLocation 
}: FeedTabProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [removedCards, setRemovedCards] = useState<string[]>([]);

  const handleSwipeLeft = (adventure: Adventure) => {
    onDiscardTrip?.(adventure);
    setRemovedCards(prev => [...prev, adventure.id]);
    toast.info('Passed', {
      description: 'Finding you better matches...',
    });
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 300);
  };

  const handleSwipeRight = (adventure: Adventure, rating: number) => {
    onSaveTrip?.(adventure, rating);
    setRemovedCards(prev => [...prev, adventure.id]);
    toast.success('Saved to your profile!', {
      description: `${adventure.title} saved to your profile`,
    });
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 300);
  };

  const handleSliderDecision = (adventure: Adventure, rating: number, isLike: boolean) => {
    if (isLike) {
      handleSwipeRight(adventure, rating);
    } else {
      handleSwipeLeft(adventure);
    }
  };

  const visibleAdventures = adventures.filter(
    (adv, idx) => idx >= currentIndex && !removedCards.includes(adv.id)
  );

  if (visibleAdventures.length === 0) {
    return (
      <div className="h-screen bg-green-50/30 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-green-400" />
          </div>
          <h3 className="text-xl text-green-800 mb-2">All caught up!</h3>
          <p className="text-green-600">
            You've seen all available adventures. Check your saved trips or create a new adventure plan!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-green-50/30 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Card Stack - only show current card */}
      <div className="relative w-full max-w-lg" style={{ height: '75vh' }}>
        <AnimatePresence>
          {visibleAdventures.length > 0 && (
            <SwipeableAdventureCard
              key={visibleAdventures[0].id}
              adventure={visibleAdventures[0]}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onSliderDecision={handleSliderDecision}
              startLocation={startLocation}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
