import { Adventure } from '../types';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Star, Clock, DollarSign, MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AdventureCardProps {
  adventure: Adventure;
  onRate?: (rating: number) => void;
  onClick?: () => void;
  userRating?: number;
}

export function AdventureCard({ adventure, onRate, onClick, userRating }: AdventureCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-green-200/50 transition-all duration-500 group border-0 bg-green-50/90 backdrop-blur-sm hover:-translate-y-2"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <ImageWithFallback
          src={adventure.images[0]}
          alt={adventure.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full flex items-center gap-1 shadow-lg">
          <DollarSign className="w-4 h-4" />
          <span>{adventure.price}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Title & Location */}
        <div>
          <h3 className="text-green-800 mb-1">{adventure.title}</h3>
          <div className="flex items-center gap-1 text-green-600 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            {adventure.destination}
          </div>
        </div>

        {/* Description */}
        <p className="text-green-600 text-sm line-clamp-2">
          {adventure.description}
        </p>

        {/* Duration & Hotel Rating */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-green-600">
            <Clock className="w-4 h-4" />
            {adventure.duration}
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {adventure.hotel.rating}
          </div>
        </div>

        {/* Activities */}
        <div className="flex flex-wrap gap-1.5">
          {adventure.activities.slice(0, 3).map((activity) => (
            <Badge key={activity} variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
              {activity}
            </Badge>
          ))}
          {adventure.activities.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
              +{adventure.activities.length - 3}
            </Badge>
          )}
        </div>

        {/* Rating Controls */}
        {onRate && (
          <div className="flex items-center gap-1 pt-2 border-t border-green-200">
            <span className="text-sm text-green-600 mr-2">Rate:</span>
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={(e) => {
                  e.stopPropagation();
                  onRate(rating);
                }}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-5 h-5 ${
                    userRating && rating <= userRating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-green-300'
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
