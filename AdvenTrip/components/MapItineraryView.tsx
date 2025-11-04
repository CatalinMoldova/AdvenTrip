import { Adventure } from '../types';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { X, MapPin, Navigation } from 'lucide-react';

interface MapItineraryViewProps {
  adventure: Adventure;
  onClose: () => void;
}

export function MapItineraryView({ adventure, onClose }: MapItineraryViewProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50">
      <div className="h-full flex flex-col md:flex-row">
        {/* Map Area */}
        <div className="flex-1 relative bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
          {/* Mock Map - In real app, this would be Google Maps or Mapbox */}
          <div className="w-full h-full flex items-center justify-center animate-gradient">
            <div className="text-center bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border-2 border-purple-200">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Interactive Map</h3>
              <p className="text-gray-600 max-w-md">
                In a production app, this would show an interactive map with markers for each day's activities
              </p>
            </div>
          </div>

          {/* Map Overlay with Points */}
          <div className="absolute top-8 left-8 space-y-3">
            {adventure.itinerary.map((day, index) => (
              <div key={day.day} className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-4 flex items-center gap-3 max-w-xs border-2 border-purple-100 hover:scale-105 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                  {day.day}
                </div>
                <div>
                  <div className="text-sm text-gray-900">{day.title}</div>
                  <div className="text-xs text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {day.location.name}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-96 bg-white overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-gray-900 mb-2">{adventure.title}</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                {adventure.destination}
              </div>
            </div>

            {/* Itinerary Details */}
            <div className="space-y-4">
              <h3 className="text-gray-900">Travel Itinerary</h3>
              {adventure.itinerary.map((day) => (
                <Card key={day.day} className="p-5 bg-gradient-to-br from-slate-50 to-purple-50 border-purple-100">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                      {day.day}
                    </div>
                    <div>
                      <h4 className="text-gray-900 mb-1">{day.title}</h4>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Navigation className="w-3.5 h-3.5" />
                        {day.location.name}
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-1.5 ml-13">
                    {day.activities.map((activity, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <Button variant="outline" size="sm" className="w-full">
                      Get Directions
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Activities Summary */}
            <div>
              <h3 className="text-gray-900 mb-3">Activities Included</h3>
              <div className="flex flex-wrap gap-2">
                {adventure.activities.map((activity) => (
                  <Badge key={activity} variant="secondary">
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md">
                Export Itinerary
              </Button>
              <Button variant="outline" className="w-full border-purple-200 hover:bg-purple-50" onClick={onClose}>
                Close Map
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
