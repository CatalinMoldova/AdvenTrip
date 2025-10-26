import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plane, Clock, DollarSign, ExternalLink, Loader2 } from 'lucide-react';
import { searchFlights, formatFlightTime, formatFlightDate, Flight } from '@/src/services/flightApi';
import { toast } from 'sonner';

interface FlightSearchTabProps {
  origin: string;
  destination: string;
  departureDate?: string;
  returnDate?: string;
  travelers?: number;
}

export function FlightSearchTab({ 
  origin, 
  destination, 
  departureDate, 
  returnDate, 
  travelers = 1 
}: FlightSearchTabProps) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!departureDate) {
      toast.error('Please select a departure date');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const result = await searchFlights({
        origin,
        destination,
        departureDate,
        returnDate,
        travelers,
      });

      setFlights(result.flights);
      
      if (result.flights.length > 0) {
        toast.success(`Found ${result.flights.length} flights! ✈️`);
      } else {
        toast.info('No flights found. Try different dates.');
      }
    } catch (error) {
      console.error('Flight search error:', error);
      toast.error('Failed to search flights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-search when component mounts if dates are provided
  useEffect(() => {
    if (departureDate && !hasSearched) {
      handleSearch();
    }
  }, []);

  return (
    <div className="space-y-4">
      {/* Search Button */}
      {!hasSearched && (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-sm">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold">Search Flights</h3>
              <p className="text-sm text-gray-600">
                Find the best flights from {origin} to {destination}
              </p>
            </div>
          </div>
          <Button
            onClick={handleSearch}
            disabled={isLoading || !departureDate}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Plane className="w-4 h-4 mr-2" />
                Search Flights
              </>
            )}
          </Button>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Flight Results */}
      {!isLoading && flights.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900 font-semibold">
              Available Flights ({flights.length})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSearch}
            >
              Refresh
            </Button>
          </div>

          {flights.map((flight) => (
            <Card
              key={flight.id}
              className="p-5 hover:shadow-lg transition-all border-gray-200"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Airline Info */}
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center overflow-hidden">
                    <img
                      src={flight.airlineLogo}
                      alt={flight.airline}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Cpath fill="%234F46E5" d="M12 2L2 7v10l10 5 10-5V7L12 2z"/%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{flight.airline}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {flight.class}
                      </Badge>
                    </div>

                    {/* Flight Times */}
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">
                          {formatFlightDate(flight.departure.time)}
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {formatFlightTime(flight.departure.time)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {flight.departure.code} • {flight.departure.city}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">
                          {formatFlightDate(flight.arrival.time)}
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {formatFlightTime(flight.arrival.time)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {flight.arrival.code} • {flight.arrival.city}
                        </div>
                      </div>
                    </div>

                    {/* Flight Details */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {flight.duration}
                      </div>
                      <div>{flight.stopsInfo}</div>
                      <div>{flight.aircraft}</div>
                    </div>
                  </div>
                </div>

                {/* Price and Book Button */}
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <div className="text-xs text-gray-600 mb-1">
                      {travelers > 1 ? `${travelers} travelers` : 'Price'}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${flight.price * travelers}
                    </div>
                    <div className="text-xs text-gray-500">
                      {flight.currency}
                    </div>
                  </div>
                  <Button
                    onClick={() => window.open(flight.bookingUrl, '_blank')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    size="sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Book Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && hasSearched && flights.length === 0 && (
        <Card className="p-8 text-center">
          <Plane className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <h3 className="text-gray-900 font-semibold mb-2">No flights found</h3>
          <p className="text-gray-600 text-sm mb-4">
            Try adjusting your dates or destination
          </p>
          <Button onClick={handleSearch} variant="outline">
            Search Again
          </Button>
        </Card>
      )}
    </div>
  );
}

