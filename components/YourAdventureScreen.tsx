import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from './ui/scroll-area';
import { Sparkles, Loader2, Compass } from 'lucide-react';
import { Adventure, AdventureRequest, User } from '../types';
import { AdventureFeedCard } from './AdventureFeedCard';
import { AdventureDetailView } from './AdventureDetailView';
import { MapItineraryView } from './MapItineraryView';

interface YourAdventureScreenProps {
  user: User;
  adventures: Adventure[];
  adventureRequests: AdventureRequest[];
  onSaveAdventure: (adventure: Adventure, rating: number) => void;
  onPassAdventure: (adventure: Adventure, rating: number) => void;
}

export const YourAdventureScreen: React.FC<YourAdventureScreenProps> = ({
  user,
  adventures,
  adventureRequests,
  onSaveAdventure,
  onPassAdventure,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [detailAdventure, setDetailAdventure] = useState<Adventure | null>(null);
  const [mapAdventure, setMapAdventure] = useState<Adventure | null>(null);

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
    if (currentIndex < adventures.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentAdventure = adventures[currentIndex];
  const currentRequest = currentAdventure ? adventureRequests.find(r => r.id === currentAdventure.requestId) : null;

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-purple-100 p-4 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
              Your Adventure
            </h1>
            <p className="text-xs text-gray-600">Tailored recommendations just for you</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto p-6">
          {adventures.length === 0 ? (
            <div className="text-center py-20">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center"
              >
                <Compass className="w-10 h-10 text-purple-400" />
              </motion.div>
              <h3 className="text-2xl text-gray-900 mb-3">Ready to plan?</h3>
              <p className="text-gray-600 mb-4">
                Create a new adventure to get personalized recommendations tailored to your preferences!
              </p>
              <p className="text-sm text-gray-500">
                Click the <strong className="text-purple-600">+</strong> button in the bottom-right corner to get started.
              </p>
            </div>
          ) : currentRequest?.status === 'pending' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 text-center border border-purple-200 shadow-md"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              </div>
              <h3 className="text-xl text-gray-900 mb-2">Waiting for group input...</h3>
              <p className="text-gray-600 text-sm mb-4">
                This adventure will be generated once all invited members provide their preferences.
              </p>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-700 mb-2">Invited Members:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {currentRequest.groupMembers?.map((member) => (
                    <div
                      key={member.id}
                      className={`px-3 py-1 rounded-full text-sm ${
                        member.hasProvidedInput
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {member.name}
                      {member.hasProvidedInput && ' ✓'}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentAdventure.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ 
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1]
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
              
              {adventures.length > 1 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center mt-4 text-sm text-gray-500"
                >
                  Option {currentIndex + 1} of {adventures.length}
                </motion.div>
              )}
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
