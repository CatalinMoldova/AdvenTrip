import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  MapPin,
  Clock,
  DollarSign,
  Star,
  Heart,
  X,
  Calendar,
  Hotel,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
} from 'lucide-react';
import { Adventure } from '../types';

interface DiscoveryScreenProps {
  adventures: Adventure[];
  user: {
    name: string;
    location: string;
    activities: string[];
  };
  onSaveAdventure: (adventure: Adventure, rating: number) => void;
  onDiscardAdventure: (adventure: Adventure, rating: number) => void;
  savedCount?: number;
  discardedCount?: number;
}

export const DiscoveryScreen: React.FC<DiscoveryScreenProps> = ({
  adventures,
  user,
  onSaveAdventure,
  onDiscardAdventure,
  savedCount = 0,
  discardedCount = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rating, setRating] = useState<number | null>(null);
  const [expandedView, setExpandedView] = useState(false);

  const currentAdventure = adventures[currentIndex];

  const handleRate = (stars: number) => {
    setRating(stars);
  };

  const handleSave = () => {
    if (rating === null) return;
    onSaveAdventure(currentAdventure, rating);
    moveToNext();
  };

  const handleDiscard = () => {
    if (rating === null) return;
    onDiscardAdventure(currentAdventure, rating);
    moveToNext();
  };

  const moveToNext = () => {
    setRating(null);
    setExpandedView(false);
    if (currentIndex < adventures.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (!currentAdventure) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4">
        <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-white via-purple-50 to-pink-50 border-2 border-purple-100 max-w-md">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl animate-float">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-gray-900 mb-2">All Caught Up! 🎉</h3>
          <p className="text-gray-600 mb-6">
            You've reviewed all available adventures. Check your saved adventures in the sidebar!
          </p>
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 text-pink-500" />
              <span>{savedCount} saved</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ThumbsDown className="w-4 h-4 text-gray-400" />
              <span>{discardedCount} passed</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 md:p-8">
      {/* Main Card */}
      <div className="w-full max-w-4xl md:ml-0 ml-0">
        <Card className="overflow-hidden bg-white/95 backdrop-blur-xl border-2 border-purple-100 shadow-2xl">
          {/* Image Header */}
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
            <ImageWithFallback
              src={currentAdventure.images[0]}
              alt={currentAdventure.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            {/* Counter */}
            <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-gray-900">
                {currentIndex + 1} / {adventures.length}
              </span>
            </div>

            {/* Price Tag */}
            <div className="absolute top-6 right-6 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg">
              <DollarSign className="w-5 h-5" />
              <span>{currentAdventure.price}</span>
            </div>

            {/* Title & Location */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-white mb-3 drop-shadow-lg">{currentAdventure.title}</h1>
              <div className="flex items-center gap-4 text-white/95 mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {currentAdventure.destination}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {currentAdventure.duration}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {currentAdventure.activities.slice(0, 3).map((activity) => (
                  <Badge key={activity} className="bg-white/20 backdrop-blur-sm border-white/30">
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 md:p-8 space-y-6">
            {/* Quick Info */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="text-sm text-gray-600">Duration</div>
                <div className="text-gray-900">{currentAdventure.duration}</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                <Hotel className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <div className="text-sm text-gray-600">Hotel</div>
                <div className="text-gray-900 flex items-center justify-center gap-1">
                  {currentAdventure.hotel.rating} <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
                <Star className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                <div className="text-sm text-gray-600">Rating</div>
                <div className="text-gray-900">{currentAdventure.rating} ⭐</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-gray-900 mb-3">About This Adventure</h3>
              <p className="text-gray-600 leading-relaxed">{currentAdventure.description}</p>
            </div>

            {/* Show More Details Button */}
            {!expandedView && (
              <Button
                variant="outline"
                className="w-full border-purple-200 hover:bg-purple-50"
                onClick={() => setExpandedView(true)}
              >
                View Full Itinerary & Details
              </Button>
            )}

            {/* Expanded Details */}
            {expandedView && (
              <div className="space-y-6 border-t border-purple-100 pt-6">
                {/* Itinerary */}
                <div>
                  <h3 className="text-gray-900 mb-4">Day-by-Day Itinerary</h3>
                  <div className="space-y-3">
                    {currentAdventure.itinerary.map((day) => (
                      <Card key={day.day} className="p-5 bg-gradient-to-br from-slate-50 to-purple-50 border-purple-100">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                            {day.day}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-gray-900 mb-2">{day.title}</h4>
                            <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                              <MapPin className="w-3.5 h-3.5" />
                              {day.location.name}
                            </div>
                            <ul className="space-y-1">
                              {day.activities.map((activity, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="text-purple-600 mt-1">•</span>
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Hotel Details */}
                <div>
                  <h3 className="text-gray-900 mb-4">Accommodation</h3>
                  <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-gray-900 mb-1">{currentAdventure.hotel.name}</h4>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3.5 h-3.5" />
                          {currentAdventure.hotel.location}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < currentAdventure.hotel.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{currentAdventure.hotel.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {currentAdventure.hotel.amenities.map((amenity) => (
                        <div key={amenity} className="text-xs text-gray-600 flex items-center gap-1">
                          <span className="text-purple-600">✓</span>
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Rating Section */}
            <div className="border-t border-purple-100 pt-6">
              <h3 className="text-gray-900 mb-4 text-center">How do you feel about this adventure?</h3>
              <div className="flex justify-center gap-2 sm:gap-3 mb-6">
                {[1, 2, 3, 4, 5].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => handleRate(stars)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      rating === stars
                        ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl scale-110 rotate-12'
                        : rating !== null && stars <= rating
                        ? 'bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 shadow-md scale-105'
                        : 'bg-gradient-to-br from-slate-100 to-purple-100 hover:scale-105 hover:shadow-md'
                    }`}
                  >
                    <Star
                      className={`w-5 h-5 sm:w-6 sm:h-6 transition-all ${
                        rating !== null && stars <= rating
                          ? 'fill-white text-white'
                          : 'fill-purple-400 text-purple-400'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {rating !== null && (
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">
                    {rating === 5 && '🤩 Amazing! This is perfect!'}
                    {rating === 4 && '😊 Love it! Great choice!'}
                    {rating === 3 && '👍 Not bad, could work!'}
                    {rating === 2 && '😐 Meh, not really feeling it'}
                    {rating === 1 && '😞 Not for me'}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  onClick={handleDiscard}
                  disabled={rating === null}
                  variant="outline"
                  className="flex-1 h-12 sm:h-14 border-2 border-red-200 hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
                  size="lg"
                >
                  <ThumbsDown className="w-5 h-5 mr-2" />
                  Pass
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={rating === null}
                  className="flex-1 h-12 sm:h-14 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  size="lg"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Save Adventure
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Helper Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Rate each adventure to help us find your perfect match! 
            <span className="block mt-1">✨ The more you rate, the better the recommendations</span>
          </p>
        </div>
      </div>
    </div>
  );
};
