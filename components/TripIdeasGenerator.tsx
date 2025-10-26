import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sparkles, MapPin, Calendar, DollarSign, Loader2, Plus, X, Plane, Hotel, ExternalLink } from 'lucide-react';
import { getTripIdeas, TripIdea } from '../src/services/tripIdeasApi';

interface TripIdeasGeneratorProps {
  interests?: string[]; // Optional - can be provided or user can input
  onSelect?: (idea: TripIdea) => void;
}

export const TripIdeasGenerator: React.FC<TripIdeasGeneratorProps> = ({ 
  interests: propInterests, 
  onSelect 
}) => {
  const [interests, setInterests] = useState<string[]>(propInterests || []);
  const [customInterest, setCustomInterest] = useState('');
  const [ideas, setIdeas] = useState<TripIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addInterest = (interest: string) => {
    if (interest && !interests.includes(interest)) {
      setInterests([...interests, interest]);
      setCustomInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const generateIdeas = async () => {
    if (!interests || interests.length === 0) {
      setError('Please select at least one interest');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getTripIdeas({ interests, useRealTimeData: true });
      setIdeas(response.ideas);
    } catch (err) {
      setError('Failed to generate trip ideas. Please try again.');
      console.error('Trip ideas error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--ios-blue)]" />
            Trip Ideas Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Get personalized trip ideas based on your interests
            </p>
            
            {/* Add Custom Interest */}
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Add your interests:</p>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g., Diving, Surfing, Hiking"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addInterest(customInterest);
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={() => addInterest(customInterest)}
                  size="icon"
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Selected Interests */}
            {interests.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Your interests:</p>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <Badge 
                      key={interest} 
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80"
                    >
                      {interest}
                      <button
                        onClick={() => removeInterest(interest)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={generateIdeas} 
              disabled={loading || interests.length === 0}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Ideas...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Trip Ideas
                </>
              )}
            </Button>

            {error && (
              <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {ideas.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Your Personalized Trip Ideas</h3>
          {ideas.map((idea) => (
            <Card 
              key={idea.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onSelect?.(idea)}
            >
              <CardContent className="p-0">
                {/* Image Collage */}
                {idea.images && idea.images.length > 0 && (
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img 
                      src={idea.images[0]} 
                      alt={idea.destination}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://picsum.photos/seed/${idea.destination}/800/600`;
                      }}
                    />
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">{idea.activity}</h4>
                        {idea.priority === 'high' && (
                          <Badge variant="default" className="text-xs">Recommended</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4" />
                        {idea.destination}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {idea.reason}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{idea.bestSeason}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold">${idea.estimatedPrice}</span>
                        </div>
                      </div>
                    </div>
                    
                    {idea.priority === 'high' && (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        ⭐
                      </div>
                    )}
                  </div>
                  
                  {/* Additional Images Grid */}
                  {idea.images && idea.images.length > 1 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {idea.images.slice(1, 4).map((image, idx) => (
                        <img 
                          key={idx}
                          src={image} 
                          alt={`${idea.destination} ${idx + 2}`}
                          className="w-full h-20 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = `https://picsum.photos/seed/${idea.destination}-${idx}/400/300`;
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Booking Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const flightUrl = `https://www.google.com/flights?q=flights+to+${encodeURIComponent(idea.destination)}&departure_date=anytime`;
                        window.open(flightUrl, '_blank');
                      }}
                      className="w-full flex items-center justify-center"
                    >
                      <Plane className="w-3.5 h-3.5 mr-1" />
                      Book Flight
                    </Button>
                    {idea.bookingUrl ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(idea.bookingUrl, '_blank')}
                        className="w-full flex items-center justify-center"
                      >
                        <Hotel className="w-3.5 h-3.5 mr-1" />
                        Book Hotel
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const hotelUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(idea.destination)}`;
                          window.open(hotelUrl, '_blank');
                        }}
                        className="w-full flex items-center justify-center"
                      >
                        <Hotel className="w-3.5 h-3.5 mr-1" />
                        Book Hotel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
