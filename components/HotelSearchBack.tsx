import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Hotel, Star, ExternalLink, Loader2, RotateCcw, Bed, DollarSign } from 'lucide-react';
import { searchHotels, calculateTotalPrice, calculateNights, Hotel as HotelType } from '@/src/services/hotelApi';
import { toast } from 'sonner';

interface HotelSearchBackProps {
  destination: string;
  onFlipBack: () => void;
}

export function HotelSearchBack({ destination, onFlipBack }: HotelSearchBackProps) {
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [bestDates, setBestDates] = useState<{ checkIn: string; checkOut: string; nights: number } | null>(null);
  
  // Calculate multiple date ranges for the next 3 months to find cheapest prices
  const generateDateRanges = () => {
    const today = new Date();
    const ranges = [];
    
    // Generate date ranges for the next 3 months (90 days)
    for (let daysAhead = 7; daysAhead <= 90; daysAhead += 7) {
      const checkIn = new Date(today);
      checkIn.setDate(today.getDate() + daysAhead);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkIn.getDate() + 3); // 3-night stay
      
      ranges.push({
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        nights: 3
      });
    }
    
    return ranges;
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      const dateRanges = generateDateRanges();
      
      // Search a few sample dates to find the best prices
      const samplesToSearch = dateRanges.slice(0, 4); // Check 4 different weeks
      const searchPromises = samplesToSearch.map(range => 
        searchHotels({
          destination,
          checkIn: range.checkIn,
          checkOut: range.checkOut,
          guests: 2,
        })
      );
      
      const results = await Promise.all(searchPromises);
      
      // Find the cheapest option across all date ranges
      let cheapestHotels: HotelType[] = [];
      let cheapestRange = samplesToSearch[0];
      let lowestPrice = Infinity;
      
      results.forEach((result, index) => {
        if (result.hotels.length > 0) {
          // Find the cheapest hotel in this date range
          const cheapestInRange = result.hotels.reduce((prev, curr) => 
            curr.pricePerNight < prev.pricePerNight ? curr : prev
          );
          
          if (cheapestInRange.pricePerNight < lowestPrice) {
            lowestPrice = cheapestInRange.pricePerNight;
            cheapestHotels = result.hotels;
            cheapestRange = samplesToSearch[index];
          }
        }
      });
      
      // Use the range with cheapest hotels, or fallback to first result
      if (cheapestHotels.length > 0) {
        setHotels(cheapestHotels);
        setBestDates(cheapestRange);
      } else if (results[0].hotels.length > 0) {
        setHotels(results[0].hotels);
        setBestDates(samplesToSearch[0]);
      }
      
      if (cheapestHotels.length > 0 || results[0].hotels.length > 0) {
        toast.success(`Found hotels with best prices! 🏨`);
      } else {
        toast.info('No hotels found.');
      }
    } catch (error) {
      console.error('Hotel search error:', error);
      toast.error('Failed to search hotels. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-search when component mounts
  useEffect(() => {
    if (!hasSearched) {
      handleSearch();
    }
  }, []);

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Hotel className="w-5 h-5 text-[var(--ios-blue)]" />
              <h3 className="text-[var(--foreground)] font-semibold">Hotels in {destination}</h3>
            </div>
            {bestDates && (
              <p className="text-xs text-[var(--ios-gray)]">
                Best price: {bestDates.checkIn} to {bestDates.checkOut} • {bestDates.nights} nights
              </p>
            )}
            {!bestDates && (
              <p className="text-xs text-[var(--ios-gray)]">
                Searching best dates...
              </p>
            )}
          </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onFlipBack}
          className="shrink-0 rounded-full"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      {/* Search Button */}
      {!hasSearched && (
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Hotel className="w-4 h-4 mr-2" />
                Search Hotels
              </>
            )}
          </Button>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--ios-blue)]" />
        </div>
      )}

      {/* Hotel Results */}
      {!isLoading && hotels.length > 0 && (
        <div className="space-y-3 flex-1 overflow-y-auto">
          {hotels.map((hotel) => (
            <Card
              key={hotel.id}
              className="p-4 hover:shadow-md transition-all border-gray-200"
            >
              <div className="flex gap-3">
                {/* Hotel Image */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={hotel.imageUrl}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Cpath fill="%23CBD5E1" d="M12 2L2 7v10l10 5 10-5V7L12 2z"/%3E%3C/svg%3E';
                    }}
                  />
                </div>
                
                {/* Hotel Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-[var(--foreground)] truncate">
                      {hotel.name}
                    </h4>
                    <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-medium">{hotel.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-[var(--ios-gray)] mb-2 truncate">
                    {hotel.address}
                  </p>
                  
                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {hotel.amenities.slice(0, 3).map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{hotel.amenities.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div>
                      {bestDates && (
                        <>
                          <div className="text-xs text-[var(--ios-gray)]">Total for {bestDates.nights} nights</div>
                          <div className="text-lg font-bold text-[var(--foreground)]">
                            ${calculateTotalPrice(hotel.pricePerNight, bestDates.nights)}
                          </div>
                        </>
                      )}
                      <div className="text-xs text-[var(--ios-gray)]">
                        ${hotel.pricePerNight}/night
                      </div>
                    </div>
                    <Button
                      onClick={() => window.open(hotel.bookingUrl, '_blank')}
                      className="bg-[var(--ios-blue)] hover:bg-[#0051D5] text-white"
                      size="sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1" />
                      Book
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && hasSearched && hotels.length === 0 && (
        <Card className="p-8 text-center">
          <Hotel className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <h3 className="text-[var(--foreground)] font-semibold mb-2">No hotels found</h3>
          <p className="text-[var(--ios-gray)] text-sm mb-4">
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

