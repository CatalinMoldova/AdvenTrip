import { useState, useEffect } from 'react';
import { User, Adventure } from '../types';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { MapPin, User as UserIcon, Bookmark, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProfileTabProps {
  user: User | null;
  onUpdateUser: (user: User) => void;
  savedTrips?: Array<{ adventure: Adventure; rating: number }>;
  onRemoveSavedTrip?: (adventureId: string) => void;
}

const transportOptions = [
  { id: 'all', label: 'All means of transport', icon: '🌍' },
  { id: 'car', label: 'Car', icon: '🚗' },
  { id: 'plane', label: 'Plane', icon: '✈️' },
  { id: 'train', label: 'Train', icon: '🚆' },
  { id: 'bus', label: 'Bus', icon: '🚌' },
  { id: 'bike', label: 'Bike', icon: '🚴' },
];

export function ProfileTab({ user, onUpdateUser, savedTrips = [], onRemoveSavedTrip }: ProfileTabProps) {
  const [name, setName] = useState(user?.name || '');
  const [location, setLocation] = useState(user?.location || '');
  const [selectedTransport, setSelectedTransport] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setLocation(user.location);
      const transportPrefs = user.interests?.filter(i => 
        transportOptions.some(t => t.id === i.toLowerCase())
      ) || [];
      setSelectedTransport(transportPrefs);
    }
  }, [user]);

  const toggleTransport = (transportId: string) => {
    if (transportId === 'all') {
      setSelectedTransport(prev => prev.includes('all') ? [] : ['all']);
    } else {
      setSelectedTransport(prev => {
        const newSelection = prev.filter(t => t !== 'all');
        if (newSelection.includes(transportId)) {
          return newSelection.filter(t => t !== transportId);
        } else {
          return [...newSelection, transportId];
        }
      });
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!location.trim()) {
      toast.error('Please enter your location');
      return;
    }

    const updatedUser: User = {
      id: user?.id || '1',
      name: name.trim(),
      location: location.trim(),
      interests: selectedTransport,
    };

    onUpdateUser(updatedUser);
    toast.success('Profile updated successfully! ✅');
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200 px-6 py-4">
        <h1 className="text-black">Profile</h1>
      </div>

      <div className="max-w-lg mx-auto px-6 py-6">
        {/* Profile Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mb-3">
            <UserIcon className="w-12 h-12 text-white" />
          </div>
          <p className="text-xs text-gray-600">AdvenTrip Traveler</p>
        </div>

        {/* Form */}
        <div className="space-y-6 mb-8">
          {/* Name Section */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <Label className="text-xs text-gray-600 mb-2 block">NAME</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="border-0 bg-white rounded-xl px-4 py-3 text-black"
            />
          </div>

          {/* Location Section */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <Label className="text-xs text-gray-600 mb-2 block">LOCATION</Label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where do you live?"
                className="border-0 bg-white rounded-xl pl-11 pr-4 py-3 text-black"
              />
            </div>
          </div>

          {/* Transportation Preferences */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <Label className="text-xs text-gray-600 mb-3 block">PREFERRED TRANSPORTATION</Label>
            <div className="flex flex-wrap gap-2">
              {transportOptions.map((transport) => {
                const isSelected = selectedTransport.includes(transport.id);
                return (
                  <motion.button
                    key={transport.id}
                    onClick={() => toggleTransport(transport.id)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors border ${
                      isSelected
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-black border-gray-200'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="mr-2">{transport.icon}</span>
                    {transport.label}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl h-14"
          >
            Save Profile
          </Button>
        </div>

        {/* Saved Trips Section */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-4">
            <Bookmark className="w-5 h-5 text-gray-600" />
            <h2 className="text-black">Saved Trips</h2>
            <span className="text-sm text-gray-600">({savedTrips.length})</span>
          </div>

          {savedTrips.length === 0 ? (
            <div className="text-center py-12 border border-gray-200 rounded-2xl bg-gray-50">
              <Bookmark className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-600 text-sm">
                No saved trips yet. Browse the feed to save your favorites!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedTrips.map((item) => (
                <motion.div
                  key={item.adventure.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0">
                      <ImageWithFallback
                        src={item.adventure.images[0]}
                        alt={item.adventure.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 py-3 pr-3">
                      <h3 className="text-black mb-1">{item.adventure.title}</h3>
                      <p className="text-xs text-gray-600 mb-2">
                        {item.adventure.destination} • {item.adventure.duration}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-600">
                          Rating: {item.rating}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start p-3">
                      <button
                        onClick={() => onRemoveSavedTrip?.(item.adventure.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
