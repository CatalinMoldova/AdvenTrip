import { useState } from 'react';
import { Adventure, AdventureRequest } from '../types';
import { SwipeableAdventureCard } from './SwipeableAdventureCard';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Sparkles, Compass, Users } from 'lucide-react';

interface FeedTabProps {
  adventures: Adventure[];
  onSaveTrip?: (adventure: Adventure, rating: number, feedType?: string, adventureRequest?: AdventureRequest) => void;
  onDiscardTrip?: (adventure: Adventure) => void;
  startLocation?: string;
  currentFeed?: string;
  currentAdventureRequest?: AdventureRequest;
}

export function FeedTab({ 
  adventures, 
  onSaveTrip, 
  onDiscardTrip,
  startLocation,
  currentFeed = 'for-you',
  currentAdventureRequest
}: FeedTabProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipeLeft = (adventure: Adventure) => {
    onDiscardTrip?.(adventure);
    toast.info('Passed', {
      description: 'Finding you better matches...',
    });
    
    // Simply advance to next card
    setCurrentIndex(prev => prev + 1);
  };

  const handleSwipeRight = (adventure: Adventure, rating: number) => {
    console.log('handleSwipeRight called:', { adventure: adventure.title, currentFeed, currentAdventureRequest: currentAdventureRequest?.name });
    
    onSaveTrip?.(adventure, rating, currentFeed, currentAdventureRequest);
    
    const saveMessage = currentFeed === 'for-you' 
      ? `${adventure.title} added to your saved trips` 
      : `${adventure.title} added to ${currentAdventureRequest?.name || 'adventure'} folder`;
    
    toast.success('Saved! 🎉', {
      description: saveMessage,
    });
    
    // Simply advance to next card
    setCurrentIndex(prev => {
      console.log('Advancing to next card, current index:', prev);
      return prev + 1;
    });
  };

  const handleSliderDecision = (adventure: Adventure, rating: number, isLike: boolean) => {
    if (isLike) {
      handleSwipeRight(adventure, rating);
    } else {
      handleSwipeLeft(adventure);
    }
  };

  const visibleAdventures = adventures.filter(
    (adv, idx) => idx >= currentIndex
  );
  
  console.log('Feed state:', { 
    currentIndex, 
    totalAdventures: adventures.length, 
    visibleAdventures: visibleAdventures.length 
  });

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
    <div className="h-screen bg-white flex flex-col p-6 relative overflow-hidden">
      {/* Feed Header */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full">
          {currentFeed === 'for-you' ? (
            <>
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-900">For You</span>
            </>
          ) : (
            <>
              {currentAdventureRequest?.mode === 'group' ? (
                <Users className="w-4 h-4 text-blue-500" />
              ) : (
                <Compass className="w-4 h-4 text-blue-500" />
              )}
              <span className="text-sm font-medium text-gray-900">
                {currentAdventureRequest?.name || 'Adventure'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Card Stack - only show current card */}
      <div className="relative w-full max-w-lg flex-1 flex items-center justify-center">
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
