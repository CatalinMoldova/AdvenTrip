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
    toast.success('Saved! 🎉', {
      description: `${adventure.title} added to your adventures`,
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
      <div className="h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-4 bg-black/5 rounded-full flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-black/40" />
          </div>
          <h3 className="text-xl text-black mb-2">All caught up!</h3>
          <p className="text-black/60">
            You've seen all available adventures. Check your saved trips or create a new adventure plan!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
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

      {/* Counter */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/90 text-white px-4 py-2 rounded-full text-sm">
        {currentIndex + 1} / {adventures.length}
      </div>
    </div>
  );
}
