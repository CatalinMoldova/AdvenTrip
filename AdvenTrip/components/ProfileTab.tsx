import { useState, useEffect } from 'react';
import { User, Adventure } from '../types';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { ProfilePicturePicker } from './ProfilePicturePicker';
import { LocationAutocomplete } from './LocationAutocomplete';
import { MapPin, User as UserIcon, Bookmark, Trash2, Edit2, Check, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AdventureDetailView } from './AdventureDetailView';

interface ProfileTabProps {
  user: User | null;
  onUpdateUser: (user: User) => void;
  savedTrips?: Array<{ adventure: Adventure; rating: number }>;
  onRemoveSavedTrip?: (adventureId: string) => void;
}

const preferenceOptions = [
  'Beach', 'Hiking', 'Nightlife', 'Scuba Diving', 'Culture', 'Food', 
  'Wellness', 'Snow Sports', 'Shopping', 'Adventure', 'Museums', 
  'Photography', 'Wildlife', 'Water Sports', 'Mountains', 'Art Galleries',
  'Theme Parks', 'Skiing', 'Diving', 'Surfing', 'Camping', 'Local Markets'
];

export function ProfileTab({ user, onUpdateUser, savedTrips = [], onRemoveSavedTrip }: ProfileTabProps) {
  const [location, setLocation] = useState(user?.location || '');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isLocationValid, setIsLocationValid] = useState(true); // Assume valid if location exists
  const [tripRangeDistance, setTripRangeDistance] = useState<number | undefined>(user?.tripRangeDistance);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(user?.interests || []);
  const [showPreferencesDialog, setShowPreferencesDialog] = useState(false);
  const [showProfilePicturePicker, setShowProfilePicturePicker] = useState(false);
  const [selectedAdventure, setSelectedAdventure] = useState<Adventure | null>(null);

  useEffect(() => {
    if (user) {
      setLocation(user.location);
      setSelectedLocation(null); // Reset selected location
      setIsLocationValid(!!user.location); // Valid if location exists
      setTripRangeDistance(user.tripRangeDistance);
      setSelectedPreferences(user.interests || []);
    }
  }, [user]);

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
    if (!newLocation) {
      setSelectedLocation(null);
      setIsLocationValid(false);
    }
  };

  const handleLocationSelect = (locationData: any) => {
    setSelectedLocation(locationData);
    setIsLocationValid(true);
  };

  const handleLocationValidationChange = (isValid: boolean) => {
    setIsLocationValid(isValid);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const togglePreference = (preference: string) => {
    setSelectedPreferences(prev =>
      prev.includes(preference)
        ? prev.filter(p => p !== preference)
        : [...prev, preference]
    );
  };

  const handleSave = () => {
    if (!location.trim()) {
      toast.error('Please enter your location');
      return;
    }
    if (!isLocationValid) {
      toast.error('Please select a valid location from the suggestions');
      return;
    }

    const updatedUser: User = {
      id: user?.id || '1',
      name: user?.name || 'Traveler',
      location: location.trim(),
      interests: selectedPreferences,
      tripRangeDistance: tripRangeDistance,
      avatar: user?.avatar, // Preserve avatar when saving
    };

    onUpdateUser(updatedUser);
    toast.success('Profile updated successfully! ✅');
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    const updatedUser: User = {
      ...user!,
      avatar: avatarUrl,
    };
    onUpdateUser(updatedUser);
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
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-green-600">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-green-600 text-white text-2xl">
                {getInitials(user?.name || 'Traveler')}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => setShowProfilePicturePicker(true)}
              className="absolute bottom-0 right-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors shadow-lg"
              type="button"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <p className="text-lg font-semibold text-black mt-3">{user?.name || 'Traveler'}</p>
          <p className="text-xs text-gray-600">AdvenTrip Traveler</p>
        </div>

        {/* Form */}
        <div className="space-y-6 mb-8">
          {/* Location Section */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <Label className="text-xs text-gray-600 mb-2 block">LOCATION</Label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <LocationAutocomplete
                value={location}
                onChange={handleLocationChange}
                onSelect={handleLocationSelect}
                onValidationChange={handleLocationValidationChange}
                placeholder="Where do you live?"
                className="pl-11"
              />
              {location && !isLocationValid && (
                <p className="text-xs text-red-500 mt-1">
                  Please select a location from the suggestions above
                </p>
              )}
            </div>
          </div>

          {/* Trip Range Distance Section */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <Label className="text-xs text-gray-600 mb-3 block">TRIP RANGE DISTANCE</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {tripRangeDistance === undefined ? 'No limit' : `Range: ${tripRangeDistance.toLocaleString()} km`}
                </span>
              </div>
              <Slider
                value={tripRangeDistance === undefined ? [20000] : [tripRangeDistance]}
                onValueChange={(value) => {
                  const newValue = value[0];
                  // If slider is at max (20000), it means "No limit" (undefined)
                  if (newValue >= 20000) {
                    setTripRangeDistance(undefined);
                  } else {
                    setTripRangeDistance(newValue);
                  }
                }}
                min={100}
                max={20000}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>100 km</span>
                <span>No limit</span>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-xs text-gray-600">PREFERENCES</Label>
              <Button
                onClick={() => setShowPreferencesDialog(true)}
                variant="ghost"
                size="sm"
                className="text-xs text-green-600 hover:text-green-700 p-0 h-auto"
              >
                <Edit2 className="w-3 h-3 mr-1" />
                Edit Preferences
              </Button>
            </div>
            {selectedPreferences.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No preferences selected</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedPreferences.map((preference) => (
                  <span
                    key={preference}
                    className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 border border-green-200"
                  >
                    {preference}
                  </span>
                ))}
              </div>
            )}
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
                  onClick={() => setSelectedAdventure(item.adventure)}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
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

      {/* Profile Picture Picker */}
      <ProfilePicturePicker
        currentAvatar={user?.avatar}
        userName={user?.name || 'Traveler'}
        isOpen={showProfilePicturePicker}
        onClose={() => setShowProfilePicturePicker(false)}
        onSelectPicture={handleAvatarSelect}
      />

      {/* Preferences Edit Dialog */}
      <Dialog open={showPreferencesDialog} onOpenChange={setShowPreferencesDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-green-800">Edit Preferences</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-green-600 mb-3 block">
                Select Your Preferences
              </Label>
              <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto">
                {preferenceOptions.map((preference) => {
                  const isSelected = selectedPreferences.includes(preference);
                  return (
                    <motion.button
                      key={preference}
                      onClick={() => togglePreference(preference)}
                      className={`px-4 py-2 rounded-full text-sm transition-all border ${
                        isSelected
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                      }`}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                    >
                      {preference}
                      {isSelected && <Check className="inline w-4 h-4 ml-2" />}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {selectedPreferences.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-green-600 mb-2 block">
                  Selected Preferences ({selectedPreferences.length})
                </Label>
                <div className="flex flex-wrap gap-2">
                  {selectedPreferences.map((preference) => (
                    <span
                      key={preference}
                      className="px-3 py-1 rounded-full text-xs bg-green-500 text-white"
                    >
                      {preference}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                onClick={() => setShowPreferencesDialog(false)}
                variant="outline"
                className="border-green-200 text-green-600"
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Adventure Detail Modal */}
      {selectedAdventure && (
        <AdventureDetailView
          adventure={selectedAdventure}
          onClose={() => setSelectedAdventure(null)}
          onSave={() => {
            setSelectedAdventure(null);
            toast.success('Adventure updated!');
          }}
        />
      )}
    </div>
  );
}
