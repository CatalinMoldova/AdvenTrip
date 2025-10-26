import { useState } from 'react';
import { Adventure } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X, MapPin, Clock, DollarSign, Hotel, Star, Calendar, Map, Plane } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { FlightSearchTab } from './FlightSearchTab';

interface AdventureDetailViewProps {
  adventure: Adventure;
  onClose: () => void;
  onSave: () => void;
}

export function AdventureDetailView({ adventure, onClose, onSave }: AdventureDetailViewProps) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showHotelDialog, setShowHotelDialog] = useState(false);
  const [customHotel, setCustomHotel] = useState(adventure.hotel.name);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen p-4 flex items-start justify-center py-8">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border-2 border-purple-100">
          {/* Header */}
          <div className="relative">
            <div className="h-80 overflow-hidden">
              <ImageWithFallback
                src={adventure.images[0]}
                alt={adventure.title}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-all shadow-lg hover:shadow-xl hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8">
              <h1 className="text-white mb-2 drop-shadow-lg">{adventure.title}</h1>
              <div className="flex items-center gap-2 text-white/95 drop-shadow-md">
                <MapPin className="w-5 h-5" />
                {adventure.destination}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Key Info */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-5 text-center bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100 hover:shadow-lg transition-shadow">
                <Clock className="w-7 h-7 mx-auto mb-2 text-blue-600" />
                <div className="text-gray-600 text-sm">Duration</div>
                <div className="text-gray-900">{adventure.duration}</div>
              </Card>
              <Card className="p-5 text-center bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100 hover:shadow-lg transition-shadow">
                <DollarSign className="w-7 h-7 mx-auto mb-2 text-emerald-600" />
                <div className="text-gray-600 text-sm">Price</div>
                <div className="text-gray-900">${adventure.price}</div>
              </Card>
              <Card className="p-5 text-center bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 hover:shadow-lg transition-shadow">
                <Hotel className="w-7 h-7 mx-auto mb-2 text-purple-600" />
                <div className="text-gray-600 text-sm">Hotel Rating</div>
                <div className="text-gray-900 flex items-center justify-center gap-1">
                  {adventure.hotel.rating} <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
              </Card>
            </div>

            {/* Date Selection */}
            <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-sm">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-gray-900">Select Your Travel Dates</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Or leave dates flexible and decide later!
              </p>
            </Card>

            {/* Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="hotel">Hotel</TabsTrigger>
                <TabsTrigger value="flights">
                  <Plane className="w-4 h-4 mr-1" />
                  Flights
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div>
                  <h3 className="text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{adventure.description}</p>
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2">Activities Included</h3>
                  <div className="flex flex-wrap gap-2">
                    {adventure.activities.map((activity) => (
                      <Badge key={activity} variant="secondary">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="itinerary" className="space-y-4 mt-4">
                <div className="flex items-center gap-2 mb-4">
                  <Map className="w-5 h-5 text-blue-600" />
                  <h3 className="text-gray-900">Day by Day Plan</h3>
                </div>
                {adventure.itinerary.map((day) => (
                  <Card key={day.day} className="p-5 bg-gradient-to-br from-slate-50 to-purple-50 border-purple-100 hover:shadow-md transition-all">
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
                              <span className="text-blue-600 mt-1">•</span>
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="hotel" className="space-y-4 mt-4">
                <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-gray-900 mb-1">{adventure.hotel.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {adventure.hotel.rating} rating
                        </div>
                        <span>•</span>
                        <div>${adventure.hotel.pricePerNight}/night</div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHotelDialog(true)}
                    >
                      Change Hotel
                    </Button>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Comfortable accommodations with modern amenities, perfect for relaxing after a day of adventures.
                  </p>
                </Card>
              </TabsContent>

              <TabsContent value="flights" className="space-y-4 mt-4">
                <FlightSearchTab
                  origin="New York"
                  destination={adventure.destination}
                  departureDate={startDate}
                  returnDate={endDate}
                  travelers={1}
                />
              </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={onSave}
                className="flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all"
              >
                Save Adventure 💫
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1 border-purple-200 hover:bg-purple-50">
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Hotel Dialog */}
      <Dialog open={showHotelDialog} onOpenChange={setShowHotelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Hotel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="hotel-name">Hotel Name</Label>
              <Input
                id="hotel-name"
                value={customHotel}
                onChange={(e) => setCustomHotel(e.target.value)}
                placeholder="Enter preferred hotel name"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowHotelDialog(false)} className="flex-1">
                Update Hotel
              </Button>
              <Button variant="outline" onClick={() => setShowHotelDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
