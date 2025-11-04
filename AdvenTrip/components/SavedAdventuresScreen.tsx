import { useState } from 'react';
import { SavedAdventure, Adventure } from '../types';
import { AdventureCard } from './AdventureCard';
import { AdventureDetailView } from './AdventureDetailView';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { ArrowLeft, Bookmark, Users, Calendar } from 'lucide-react';

interface SavedAdventuresScreenProps {
  savedAdventures: SavedAdventure[];
  groupAdventures: Adventure[];
  onBack: () => void;
  onViewMap: (adventure: Adventure) => void;
}

export function SavedAdventuresScreen({ 
  savedAdventures, 
  groupAdventures, 
  onBack,
  onViewMap 
}: SavedAdventuresScreenProps) {
  const [selectedAdventure, setSelectedAdventure] = useState<Adventure | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-purple-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Feed
            </Button>
          </div>
          <h1 className="text-gray-900 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">My Adventures</h1>
          <p className="text-gray-600 text-sm">
            View and manage your saved and group adventures 🌍
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="saved">
          <TabsList className="mb-6">
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              Saved Adventures
            </TabsTrigger>
            <TabsTrigger value="group" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Group Adventures
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Upcoming Trips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved">
            {savedAdventures.length === 0 ? (
              <Card className="p-12 text-center">
                <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-gray-900 mb-2">No Saved Adventures Yet</h3>
                <p className="text-gray-600">
                  Start exploring and save your favorite adventures
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedAdventures.map((adventure) => (
                    <div key={adventure.id}>
                      <AdventureCard
                        adventure={adventure}
                        onClick={() => setSelectedAdventure(adventure)}
                        userRating={adventure.userRating}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2"
                        onClick={() => onViewMap(adventure)}
                      >
                        View on Map
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="group">
            {groupAdventures.length === 0 ? (
              <Card className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-gray-900 mb-2">No Group Adventures Yet</h3>
                <p className="text-gray-600">
                  Create a group and start planning adventures together
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupAdventures.map((adventure) => (
                  <AdventureCard
                    key={adventure.id}
                    adventure={adventure}
                    onClick={() => setSelectedAdventure(adventure)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming">
            <Card className="p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-gray-900 mb-2">No Upcoming Trips</h3>
              <p className="text-gray-600">
                Your scheduled adventures will appear here
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail View */}
      {selectedAdventure && (
        <AdventureDetailView
          adventure={selectedAdventure}
          onClose={() => setSelectedAdventure(null)}
          onSave={() => setSelectedAdventure(null)}
        />
      )}
    </div>
  );
}
