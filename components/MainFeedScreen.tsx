import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Plus, Compass, Loader2 } from 'lucide-react';
import { Adventure, AdventureRequest, User } from '../types';
import { AdventureFeedCard } from './AdventureFeedCard';
import { CreateAdventureModal } from './CreateAdventureModal';
import { AdventureDetailView } from './AdventureDetailView';
import { MapItineraryView } from './MapItineraryView';
import { AdvenTripLogo } from './ui/AdvenTripLogo';

interface MainFeedScreenProps {
  user: User;
  adventures: Adventure[];
  adventureRequests: AdventureRequest[];
  onSaveAdventure: (adventure: Adventure, rating: number) => void;
  onPassAdventure: (adventure: Adventure, rating: number) => void;
  onCreateAdventureRequest: (request: AdventureRequest) => void;
  friends: any[];
}

export const MainFeedScreen: React.FC<MainFeedScreenProps> = ({
  user,
  adventures,
  adventureRequests,
  onSaveAdventure,
  onPassAdventure,
  onCreateAdventureRequest,
  friends,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [detailAdventure, setDetailAdventure] = useState<Adventure | null>(null);
  const [mapAdventure, setMapAdventure] = useState<Adventure | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState('adventure-0');

  const handleRating = (adventureId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [adventureId]: rating }));
  };

  const handleSave = (adventure: Adventure) => {
    const rating = ratings[adventure.id] || 50;
    onSaveAdventure(adventure, rating);
  };

  const handlePass = (adventure: Adventure) => {
    const rating = ratings[adventure.id] || 50;
    onPassAdventure(adventure, rating);
  };

  // Group adventures by request or show individual ones
  const adventureTabs = adventures.map((adventure, index) => ({
    id: `adventure-${index}`,
    title: adventure.title,
    adventure,
    request: adventureRequests.find(r => r.id === adventure.requestId),
  }));

  return (
    <div className="flex-1 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-green-100 p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-md">
              <AdvenTripLogo size="md" className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black font-display tracking-tight bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                AdvenTrip
              </h1>
              <p className="text-xs text-gray-600">Welcome back, {user.name}</p>
            </div>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Adventure
          </Button>
        </div>
      </div>

      {/* Adventure Tabs */}
      <div className="flex-1 overflow-hidden">
        {adventures.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md px-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center"
              >
                <Compass className="w-10 h-10 text-purple-400" />
              </motion.div>
              <h3 className="text-2xl text-gray-900 mb-3">Ready for an adventure?</h3>
              <p className="text-gray-600 mb-6">
                Create your first personalized adventure by clicking the button above!
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Adventure
              </Button>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="bg-white/50 backdrop-blur border-b border-purple-100 px-4">
              <ScrollArea className="w-full">
                <TabsList className="inline-flex h-12 items-center justify-start bg-transparent border-none">
                  {adventureTabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-t-lg px-4 whitespace-nowrap"
                    >
                      {tab.title}
                      {tab.request?.mode === 'group' && (
                        <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                          Group
                        </span>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </div>

            <ScrollArea className="flex-1">
              <div className="max-w-3xl mx-auto p-6">
                {adventureTabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="mt-0">
                    {tab.request?.status === 'pending' ? (
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
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <p className="text-sm text-gray-700 mb-2">Invited Members:</p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {tab.request.groupMembers?.map((member) => (
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
                      <AdventureFeedCard
                        adventure={tab.adventure}
                        onRate={(rating) => handleRating(tab.adventure.id, rating)}
                        onSave={() => handleSave(tab.adventure)}
                        onPass={() => handlePass(tab.adventure)}
                        onViewDetails={() => setDetailAdventure(tab.adventure)}
                        onViewMap={() => setMapAdventure(tab.adventure)}
                      />
                    )}
                  </TabsContent>
                ))}
              </div>
            </ScrollArea>
          </Tabs>
        )}
      </div>

      {/* Create Adventure Modal */}
      <CreateAdventureModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateAdventure={onCreateAdventureRequest}
        friends={friends}
      />

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
