import { useState } from 'react';
import { Adventure, AdventureRequest } from '../types';
import { SwipeableAdventureCard } from './SwipeableAdventureCard';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Sparkles, Compass, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface FeedTabProps {
  adventures: Adventure[];
  onSaveTrip?: (adventure: Adventure, rating: number, feedType?: string, adventureRequest?: AdventureRequest) => void;
  onDiscardTrip?: (adventure: Adventure) => void;
  startLocation?: string;
  currentFeed?: string;
  currentAdventureRequest?: AdventureRequest;
  adventureRequests?: AdventureRequest[];
  onFeedChange?: (feedType: string, adventureRequest?: AdventureRequest) => void;
}

export function FeedTab({ 
  adventures, 
  onSaveTrip, 
  onDiscardTrip,
  startLocation,
  currentFeed = 'for-you',
  currentAdventureRequest,
  adventureRequests = [],
  onFeedChange
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
    onSaveTrip?.(adventure, rating, currentFeed, currentAdventureRequest);
    
    const saveMessage = currentFeed === 'for-you' 
      ? `${adventure.title} added to your saved trips` 
      : `${adventure.title} added to ${currentAdventureRequest?.name || 'adventure'}`;
    
    toast.success('Saved! 🎉', {
      description: saveMessage,
    });
    
    setRemovedCards(prev => [...prev, adventure.id]);
    
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

  const handleFeedSelect = (value: string) => {
    if (value === 'for-you') {
      onFeedChange?.('for-you', undefined);
      setCurrentIndex(0);
      setRemovedCards([]);
    } else {
      const selectedAdventure = adventureRequests.find(req => req.id === value);
      if (selectedAdventure) {
        onFeedChange?.('adventure', selectedAdventure);
        setCurrentIndex(0);
        setRemovedCards([]);
      }
    }
  };

  const getCurrentFeedValue = () => {
    if (currentFeed === 'for-you') {
      return 'for-you';
    }
    return currentAdventureRequest?.id || 'for-you';
  };

  const visibleAdventures = adventures.filter(
    (adv, idx) => idx >= currentIndex && !removedCards.includes(adv.id)
  );

  if (visibleAdventures.length === 0) {
    return (
      <div className="h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
        {/* Dropdown Menu - Top Left */}
        <div className="absolute top-4 left-4 z-20">
          <Select value={getCurrentFeedValue()} onValueChange={handleFeedSelect}>
            <SelectTrigger className="w-48 bg-white/95 backdrop-blur-sm border-green-200 text-green-800 hover:bg-white shadow-md">
              <SelectValue>
                {currentFeed === 'for-you' ? (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-green-600" />
                    <span>For You Trips</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {currentAdventureRequest?.mode === 'group' ? (
                      <Users className="w-4 h-4 text-green-600" />
                    ) : (
                      <Compass className="w-4 h-4 text-green-600" />
                    )}
                    <span className="truncate">{currentAdventureRequest?.name || 'Adventure'}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white border-green-200">
              <SelectItem value="for-you">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span>For You Trips</span>
                </div>
              </SelectItem>
              {adventureRequests.map((req) => (
                <SelectItem key={req.id} value={req.id}>
                  <div className="flex items-center gap-2">
                    {req.mode === 'group' ? (
                      <Users className="w-4 h-4 text-green-600" />
                    ) : (
                      <Compass className="w-4 h-4 text-green-600" />
                    )}
                    <span>{req.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Empty State - Centered */}
        <div className="absolute inset-0 flex items-center justify-center">
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
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Dropdown Menu - Top Left (Absolute positioned, doesn't affect card) */}
      <div className="absolute top-4 left-4 z-20">
        <Select value={getCurrentFeedValue()} onValueChange={handleFeedSelect}>
          <SelectTrigger className="w-48 bg-white/95 backdrop-blur-sm border-green-200 text-green-800 hover:bg-white shadow-md">
            <SelectValue>
              {currentFeed === 'for-you' ? (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span>For You Trips</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {currentAdventureRequest?.mode === 'group' ? (
                    <Users className="w-4 h-4 text-green-600" />
                  ) : (
                    <Compass className="w-4 h-4 text-green-600" />
                  )}
                  <span className="truncate">{currentAdventureRequest?.name || 'Adventure'}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white border-green-200">
            <SelectItem value="for-you">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-600" />
                <span>For You Trips</span>
              </div>
            </SelectItem>
            {adventureRequests.map((req) => (
              <SelectItem key={req.id} value={req.id}>
                <div className="flex items-center gap-2">
                  {req.mode === 'group' ? (
                    <Users className="w-4 h-4 text-green-600" />
                  ) : (
                    <Compass className="w-4 h-4 text-green-600" />
                  )}
                  <span>{req.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Centered Card Container - Fixed Aspect Ratio */}
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <AnimatePresence>
          {visibleAdventures.length > 0 && (
            <div className="relative w-full max-w-sm sm:max-w-md" style={{ aspectRatio: '3/4', maxHeight: '90vh' }}>
              {/* Card */}
              <SwipeableAdventureCard
                key={visibleAdventures[0].id}
                adventure={visibleAdventures[0]}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onSliderDecision={handleSliderDecision}
                startLocation={startLocation}
              />
              
              {/* Title Overlay - On top of card */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/30 shadow-lg">
                  {currentFeed === 'for-you' ? (
                    <>
                      <Sparkles className="w-4 h-4 text-white" />
                      <span className="text-sm font-medium text-white drop-shadow-md">For You Trips</span>
                    </>
                  ) : (
                    <>
                      {currentAdventureRequest?.mode === 'group' ? (
                        <Users className="w-4 h-4 text-white" />
                      ) : (
                        <Compass className="w-4 h-4 text-white" />
                      )}
                      <span className="text-sm font-medium text-white drop-shadow-md">
                        {currentAdventureRequest?.name || 'Adventure'}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Counter Overlay - Bottom of card */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-black/60 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full text-sm shadow-lg">
                  {currentIndex + 1} / {adventures.length}
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
