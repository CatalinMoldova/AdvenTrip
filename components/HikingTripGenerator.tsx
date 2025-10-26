import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Calendar, DollarSign, Loader2, Mountain, Route, Plane, Hotel } from 'lucide-react';

interface HikingTrip {
  id: string;
  activity: string;
  destination: string;
  location: string;
  distance: string;
  difficulty: string;
  reason: string;
  description: string;
  estimatedPrice: number;
  bestSeason: string;
  images?: string[];
  bookingUrl?: string;
  dataSource: string;
  trailInfo: {
    length: string;
    elevation: string;
    type: string;
  };
}

export const HikingTripGenerator: React.FC = () => {
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState(100);
  const [trips, setTrips] = useState<HikingTrip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateHikingTrips = async () => {
    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/hiking-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location, radius }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate hiking trips');
      }

      const data = await response.json();
      setTrips(data.hikingTrips || []);
    } catch (err) {
      setError('Failed to generate hiking trips. Please try again.');
      console.error('Hiking trips error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mountain className="w-5 h-5 text-green-600" />
            Find Hiking Trails Near You
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="location" className="text-sm font-medium mb-2 block">
              Your Location
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="e.g., New York, San Francisco"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && generateHikingTrips()}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="radius" className="text-sm font-medium mb-2 block">
              Search Radius: {radius} miles
            </Label>
            <input
              id="radius"
              type="range"
              min="10"
              max="200"
              step="10"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10 mi</span>
              <span>200 mi</span>
            </div>
          </div>

          <Button 
            onClick={generateHikingTrips} 
            disabled={loading || !location.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Finding Hiking Trails...
              </>
            ) : (
              <>
                <Mountain className="w-4 h-4 mr-2" />
                Find Hiking Trails
              </>
            )}
          </Button>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </CardContent>
      </Card>

      {trips.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Hiking Trails Near {location}</h3>
          {trips.map((trip) => (
            <Card key={trip.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Trail Image */}
                {trip.images && trip.images.length > 0 && (
                  <div className="relative h-48 overflow-hidden rounded-t-lg -mx-6 -mt-6 mb-4">
                    <img 
                      src={trip.images[0]} 
                      alt={trip.destination}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://picsum.photos/seed/${trip.destination}/800/600`;
                      }}
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{trip.destination}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        {trip.location} • {trip.distance} away
                      </div>
                    </div>
                    <Badge className={`${getDifficultyColor(trip.difficulty)} text-white`}>
                      {trip.difficulty}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-700">{trip.description}</p>

                  {/* Trail Info */}
                  <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <Route className="w-4 h-4 mx-auto text-gray-600 mb-1" />
                      <p className="text-xs text-gray-600">Length</p>
                      <p className="text-sm font-semibold">{trip.trailInfo.length}</p>
                    </div>
                    <div className="text-center">
                      <Mountain className="w-4 h-4 mx-auto text-gray-600 mb-1" />
                      <p className="text-xs text-gray-600">Elevation</p>
                      <p className="text-sm font-semibold">{trip.trailInfo.elevation}</p>
                    </div>
                    <div className="text-center">
                      <Route className="w-4 h-4 mx-auto text-gray-600 mb-1" />
                      <p className="text-xs text-gray-600">Type</p>
                      <p className="text-sm font-semibold">{trip.trailInfo.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{trip.bestSeason}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold">${trip.estimatedPrice}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          const flightUrl = `https://www.google.com/flights?q=flights+to+${encodeURIComponent(trip.destination)}&departure_date=anytime`;
                          window.open(flightUrl, '_blank');
                        }}
                      >
                        <Plane className="w-3.5 h-3.5 mr-1" />
                        Flight
                      </Button>
                      {trip.bookingUrl ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(trip.bookingUrl, '_blank')}
                        >
                          <Hotel className="w-3.5 h-3.5 mr-1" />
                          Hotel
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            const hotelUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(trip.destination)}`;
                            window.open(hotelUrl, '_blank');
                          }}
                        >
                          <Hotel className="w-3.5 h-3.5 mr-1" />
                          Hotel
                        </Button>
                      )}
                    </div>
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
