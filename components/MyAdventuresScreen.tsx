import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, MapPin, Calendar, DollarSign, Trash2, Info, Map } from 'lucide-react';
import { Adventure, User } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AdventureDetailView } from './AdventureDetailView';
import { MapItineraryView } from './MapItineraryView';

interface MyAdventuresScreenProps {
  user: User;
  savedAdventures: Array<{ adventure: Adventure; rating: number }>;
  onRemoveAdventure: (adventureId: string) => void;
}

export const MyAdventuresScreen: React.FC<MyAdventuresScreenProps> = ({
  user,
  savedAdventures,
  onRemoveAdventure,
}) => {
  const [detailAdventure, setDetailAdventure] = useState<Adventure | null>(null);
  const [mapAdventure, setMapAdventure] = useState<Adventure | null>(null);

  return (
    <div className="flex-1 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-pink-100 p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-rose-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-md">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent">
              My Adventures
            </h1>
            <p className="text-xs text-gray-600">Your saved collection</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto p-6">
          {savedAdventures.length === 0 ? (
            <div className="text-center py-20">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl flex items-center justify-center"
              >
                <Heart className="w-10 h-10 text-pink-400" />
              </motion.div>
              <h3 className="text-2xl text-gray-900 mb-3">No saved adventures yet</h3>
              <p className="text-gray-600 mb-4">
                Start exploring and save adventures you love!
              </p>
              <p className="text-sm text-gray-500">
                Adventures you save will appear here for easy access
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedAdventures.map(({ adventure, rating }) => (
                <motion.div
                  key={adventure.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-pink-100 group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={adventure.images[0]}
                      alt={adventure.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-pink-500 text-white px-3 py-1.5 shadow-lg">
                        <Heart className="w-3 h-3 mr-1 fill-current" />
                        {rating}%
                      </Badge>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-1.5 shadow-lg">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {adventure.price}
                      </Badge>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white text-lg mb-1">{adventure.title}</h3>
                      <div className="flex items-center gap-3 text-white/90 text-xs">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {adventure.destination}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {adventure.duration}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Description */}
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {adventure.description}
                    </p>

                    {/* Activities */}
                    <div className="flex flex-wrap gap-1.5">
                      {adventure.activities.slice(0, 3).map((activity) => (
                        <Badge key={activity} variant="secondary" className="text-xs">
                          {activity}
                        </Badge>
                      ))}
                      {adventure.activities.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{adventure.activities.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setDetailAdventure(adventure)}
                        className="flex-1 hover:bg-purple-50 hover:border-purple-300 text-xs"
                        size="sm"
                      >
                        <Info className="w-3 h-3 mr-1" />
                        Details
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setMapAdventure(adventure)}
                        className="flex-1 hover:bg-blue-50 hover:border-blue-300 text-xs"
                        size="sm"
                      >
                        <Map className="w-3 h-3 mr-1" />
                        Map
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => onRemoveAdventure(adventure.id)}
                        className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-xs"
                        size="sm"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Adventure Detail Modal */}
      {detailAdventure && (
        <AdventureDetailView
          adventure={detailAdventure}
          onClose={() => setDetailAdventure(null)}
          onSave={() => setDetailAdventure(null)}
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
