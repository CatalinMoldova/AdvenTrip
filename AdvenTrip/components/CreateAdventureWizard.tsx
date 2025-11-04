import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { AdventureRequest, User, GroupMember } from '../types';
import { ChevronLeft, Check, Share2, Copy, MapPin, Shuffle } from 'lucide-react';
import { toast } from 'sonner';
import { LocationAutocomplete } from './LocationAutocomplete';

interface CreateAdventureWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAdventure: (request: AdventureRequest) => void;
  user: User | null;
}

const tripTypeOptions = [
  { id: 'road-trip', label: 'Road trip', icon: '🛣️', description: 'Drive from city to city' },
  { id: 'city-to-city', label: 'City-to-city travel', icon: '🚆', description: 'Train, car, or plane between cities' },
  { id: 'stay-one-city', label: 'Stay in one city', icon: '🏨', description: 'Local hotel or resort' },
];

const activityOptions = [
  '🏖️ Beach', '🥾 Hiking', '🏛️ Museums', '🍜 Food Tours',
  '🎉 Nightlife', '🛍️ Shopping', '📸 Photography', '🪂 Adventure Sports',
  '🦁 Wildlife', '🏰 Cultural Sites', '🏄 Water Sports', '⛰️ Mountains',
  '🧖 Spa & Wellness', '🎨 Art Galleries', '🎢 Theme Parks'
];

const seasonOptions = [
  { id: 'spring', label: 'Spring', icon: '🌸', months: 'Mar-May' },
  { id: 'summer', label: 'Summer', icon: '☀️', months: 'Jun-Aug' },
  { id: 'fall', label: 'Fall', icon: '🍂', months: 'Sep-Nov' },
  { id: 'winter', label: 'Winter', icon: '❄️', months: 'Dec-Feb' },
  { id: 'anytime', label: 'Anytime', icon: '🌍', months: 'Flexible' },
];

export function CreateAdventureWizard({ isOpen, onClose, onCreateAdventure, user }: CreateAdventureWizardProps) {
  const [step, setStep] = useState(0);
  const [adventureName, setAdventureName] = useState('');
  const [location, setLocation] = useState(user?.location || '');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isLocationValid, setIsLocationValid] = useState(false);
  const [activities, setActivities] = useState<string[]>([]);
  const [season, setSeason] = useState<string>('');
  const [focusLocation, setFocusLocation] = useState('');
  const [selectedFocusLocation, setSelectedFocusLocation] = useState<any>(null);
  const [isFocusLocationValid, setIsFocusLocationValid] = useState(false);
  const [isRandomLocation, setIsRandomLocation] = useState(false);
  const [focusLocationRadius, setFocusLocationRadius] = useState<number | undefined>(undefined);
  const [duration, setDuration] = useState('');
  const [tripTypes, setTripTypes] = useState<string[]>([]);
  const [mode, setMode] = useState<'individual' | 'group' | null>(null);
  const [inviteLink, setInviteLink] = useState('');

  const totalSteps = 8; // Adventure name, location, activities, season, focus location, duration, trip types, success

  const handleClose = () => {
    setStep(0);
    setAdventureName('');
    setLocation(user?.location || '');
    setSelectedLocation(null);
    setIsLocationValid(false);
    setActivities([]);
    setSeason('');
    setFocusLocation('');
    setSelectedFocusLocation(null);
    setIsFocusLocationValid(false);
    setIsRandomLocation(false);
    setFocusLocationRadius(undefined);
    setDuration('');
    setTripTypes([]);
    setMode(null);
    setInviteLink('');
    onClose();
  };

  const handleLocationSelect = (locationData: any) => {
    setSelectedLocation(locationData);
    // You can also store coordinates if needed for future features
    console.log('Selected location:', locationData);
  };

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
    // Clear selectedLocation if user is typing (not selecting from dropdown)
    if (!newLocation) {
      setSelectedLocation(null);
      setIsLocationValid(false);
    }
  };

  const handleLocationValidationChange = (isValid: boolean) => {
    setIsLocationValid(isValid);
  };

  const handleFocusLocationChange = (newLocation: string) => {
    setFocusLocation(newLocation);
    setIsRandomLocation(false);
    if (!newLocation) {
      setSelectedFocusLocation(null);
      setIsFocusLocationValid(false);
    }
  };

  const handleFocusLocationSelect = (locationData: any) => {
    setSelectedFocusLocation(locationData);
    setIsRandomLocation(false);
    setFocusLocationRadius(undefined); // Clear radius when specific location is selected
  };

  const handleFocusLocationValidationChange = (isValid: boolean) => {
    setIsFocusLocationValid(isValid);
  };

  const handleRandomLocation = () => {
    // Use user's base location as the center point
    const userBaseLocation = user?.location || location || '';
    if (!userBaseLocation) {
      toast.error('Please set your location first');
      return;
    }
    setFocusLocation(userBaseLocation);
    setIsRandomLocation(true);
    setIsFocusLocationValid(true);
    setSelectedFocusLocation({ name: userBaseLocation });
    setFocusLocationRadius(undefined); // Start with "No limit"
  };

  const handleNext = () => {
    // Validation
    if (step === 0 && !adventureName.trim()) {
      toast.error('Please enter an adventure name');
      return;
    }
    if (step === 1 && (!location.trim() || !isLocationValid)) {
      toast.error('Please select a valid location from the suggestions');
      return;
    }
    if (step === 2 && activities.length === 0) {
      toast.error('Please select at least one activity');
      return;
    }
    if (step === 3 && !season) {
      toast.error('Please select a season');
      return;
    }
    if (step === 4) {
      // Auto-fallback to user's base location if no location selected
      if (!focusLocation.trim() || !isFocusLocationValid) {
        const userBaseLocation = user?.location || location || '';
        if (userBaseLocation) {
          setFocusLocation(userBaseLocation);
          setIsRandomLocation(true);
          setIsFocusLocationValid(true);
          setSelectedFocusLocation({ name: userBaseLocation });
          setFocusLocationRadius(undefined); // Default to "No limit"
          // Proceed to next step after setting the values
          if (step < totalSteps - 1) {
            setStep(step + 1);
          }
          return;
        } else {
          toast.error('Please select a location or set your base location first');
          return;
        }
      }
    }
    if (step === 5 && (!duration || parseInt(duration) < 1)) {
      toast.error('Please enter a valid duration');
      return;
    }
    if (step === 6 && tripTypes.length === 0) {
      toast.error('Please select at least one trip type');
      return;
    }

    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const toggleActivity = (activity: string) => {
    setActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const toggleTripType = (tripTypeId: string) => {
    setTripTypes(prev =>
      prev.includes(tripTypeId)
        ? prev.filter(t => t !== tripTypeId)
        : [...prev, tripTypeId]
    );
  };

  const handleModeSelection = (selectedMode: 'individual' | 'group') => {
    setMode(selectedMode);
    
    if (selectedMode === 'group') {
      // Generate shareable link
      const linkId = Math.random().toString(36).substring(7);
      const link = `${window.location.origin}/join/${linkId}`;
      setInviteLink(link);
      
      // Create group adventure request
      const request: AdventureRequest = {
        id: linkId, // Use the same ID as the invite link
        name: adventureName.trim(),
        userId: user?.id || '1',
        mode: 'group',
        numberOfDays: parseInt(duration),
        season: season || undefined,
        activities: activities.map(a => a.replace(/[^\w\s]/g, '').trim()),
        customActivities: [],
        transportation: tripTypes.join(','), // Store trip types as comma-separated
        focusLocation: focusLocation.trim(),
        focusLocationRadius: focusLocationRadius,
        inviteLink: link,
        groupMembers: [{
          id: user?.id || '1',
          name: user?.name || 'Traveler',
          email: user?.email || '',
          avatar: user?.avatar || '',
          budget: user?.budget || 1000,
          preferences: activities.map(a => a.replace(/[^\w\s]/g, '').trim())
        }],
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      onCreateAdventure(request);
      // Advance to success screen
      setStep(7);
    } else {
      // Create adventure immediately for individual mode
      const request: AdventureRequest = {
        id: Math.random().toString(36).substring(7),
        name: adventureName.trim(),
        userId: user?.id || '1',
        mode: 'individual',
        numberOfDays: parseInt(duration),
        season: season || undefined,
        activities: activities.map(a => a.replace(/[^\w\s]/g, '').trim()),
        customActivities: [],
        transportation: tripTypes.join(','), // Store trip types as comma-separated
        focusLocation: focusLocation.trim(),
        focusLocationRadius: focusLocationRadius,
        status: 'generating',
        createdAt: new Date().toISOString(),
      };
      
      onCreateAdventure(request);
      handleClose();
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied! 📋');
  };

  const shareInviteLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join my AdvenTrip adventure!',
        text: 'Let\'s plan an adventure together',
        url: inviteLink,
      });
    } else {
      copyInviteLink();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl text-green-800 mb-2">What's your adventure called?</h2>
              <p className="text-sm text-green-600">Give your adventure a memorable name</p>
            </div>
            <Input
              value={adventureName}
              onChange={(e) => setAdventureName(e.target.value)}
              placeholder="e.g., Summer Road Trip, Beach Getaway"
              className="text-center text-lg border-0 bg-green-100 rounded-xl px-6 py-4 text-green-800"
              autoFocus
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl text-green-800 mb-2">Where are you?</h2>
              <p className="text-sm text-green-600">Your starting point</p>
            </div>
            <LocationAutocomplete
              value={location}
              onChange={handleLocationChange}
              onSelect={handleLocationSelect}
              onValidationChange={handleLocationValidationChange}
              placeholder="Start typing a city or location..."
              className="text-center text-lg border-0 bg-green-100 rounded-xl px-6 py-4 text-green-800"
              autoFocus
            />
            {location && !isLocationValid && (
              <div className="text-center">
                <p className="text-sm text-red-500">
                  Please select a location from the suggestions above
                </p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl text-green-800 mb-2">What activities do you want to do?</h2>
              <p className="text-sm text-green-600">Select all that apply</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-h-[400px] overflow-y-auto">
              {activityOptions.map((activity) => {
                const isSelected = activities.includes(activity);
                return (
                  <motion.button
                    key={activity}
                    onClick={() => toggleActivity(activity)}
                    className={`px-4 py-2 rounded-full text-sm transition-all border ${
                      isSelected
                        ? 'bg-green-500 text-white border-green-500 scale-105'
                        : 'bg-green-100 text-green-800 border-green-200'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {activity}
                    {isSelected && <Check className="inline w-4 h-4 ml-2" />}
                  </motion.button>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl text-green-800 mb-2">What time of year?</h2>
              <p className="text-sm text-green-600">Choose your preferred season</p>
            </div>
            <div className="space-y-3">
              {seasonOptions.map((s) => {
                const isSelected = season === s.id;
                return (
                  <motion.button
                    key={s.id}
                    onClick={() => setSeason(s.id)}
                    className={`w-full p-4 rounded-2xl text-left transition-all border ${
                      isSelected
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-green-100 text-green-800 border-green-200'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{s.icon}</span>
                        <div>
                          <div className={isSelected ? 'text-white' : 'text-green-800'}>
                            {s.label}
                          </div>
                          <div className={`text-xs ${isSelected ? 'text-white/70' : 'text-green-600'}`}>
                            {s.months}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-5 h-5" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl text-green-800 mb-2">Where do you want to focus your adventure?</h2>
              <p className="text-sm text-green-600">Choose a specific location or pick a random one</p>
            </div>

            {/* Option 1: Select or type a specific location */}
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium text-green-700">Select or type a specific location</label>
                <LocationAutocomplete
                  value={isRandomLocation ? '' : focusLocation}
                  onChange={handleFocusLocationChange}
                  onSelect={handleFocusLocationSelect}
                  onValidationChange={handleFocusLocationValidationChange}
                  placeholder="e.g., California, London, Iceland"
                  className="border-0 bg-green-100 rounded-xl px-4 py-3 text-green-800"
                  disabled={isRandomLocation}
                />
                {focusLocation && !isRandomLocation && !isFocusLocationValid && (
                  <p className="text-sm text-red-500">
                    Please select a location from the suggestions above
                  </p>
                )}
                {focusLocation && !isRandomLocation && isFocusLocationValid && (
                  <div className="flex items-center gap-2 text-green-700 p-2 bg-green-50 rounded-lg">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{focusLocation}</span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-green-200"></div>
                <span className="text-sm text-green-600">or</span>
                <div className="flex-1 h-px bg-green-200"></div>
              </div>

              {/* Option 2: Random Location */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-green-700">Choose a random location</label>
                <Button
                  onClick={handleRandomLocation}
                  variant="outline"
                  className="w-full border-green-200 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl h-12"
                  disabled={!user?.location && !location}
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Random Location
                </Button>
                {!user?.location && !location && (
                  <p className="text-xs text-green-600 italic">
                    Set your location first to use this feature
                  </p>
                )}

                {/* Show user's location and radius slider when random mode is active */}
                {isRandomLocation && focusLocation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 mt-4 p-4 bg-green-50 rounded-xl border border-green-200"
                  >
                    <div className="flex items-center gap-2 text-green-800">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{focusLocation}</span>
                    </div>

                    {/* Radius Slider - only visible in random mode */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-700">
                          {focusLocationRadius === undefined ? 'No limit' : `Range: ${focusLocationRadius.toLocaleString()} km`}
                        </span>
                      </div>
                      <Slider
                        value={focusLocationRadius === undefined ? [20000] : [focusLocationRadius]}
                        onValueChange={(value) => {
                          const newValue = value[0];
                          // If slider is at max (20000), it means "No limit" (undefined)
                          if (newValue >= 20000) {
                            setFocusLocationRadius(undefined);
                          } else {
                            setFocusLocationRadius(newValue);
                          }
                        }}
                        min={100}
                        max={20000}
                        step={100}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-green-600">
                        <span>100 km</span>
                        <span>No limit</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl text-green-800 mb-2">How long will it last?</h2>
              <p className="text-sm text-green-600">Number of days</p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDuration(String(Math.max(1, parseInt(duration || '1') - 1)))}
                className="w-12 h-12 rounded-full border-green-200 text-green-600"
              >
                -
              </Button>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="0"
                className="text-center text-3xl border-0 bg-green-100 rounded-xl w-32 h-20 text-green-800"
                min="1"
                autoFocus
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDuration(String(parseInt(duration || '0') + 1))}
                className="w-12 h-12 rounded-full border-green-200 text-green-600"
              >
                +
              </Button>
            </div>
            <p className="text-center text-green-600 text-sm">
              {duration ? `${duration} ${parseInt(duration) === 1 ? 'day' : 'days'}` : 'Enter duration'}
            </p>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl text-green-800 mb-2">What type of trip would you like to take?</h2>
              <p className="text-sm text-green-600">Select all that apply</p>
            </div>
            <div className="space-y-2">
              {tripTypeOptions.map((tripType) => {
                const isSelected = tripTypes.includes(tripType.id);
                return (
                  <motion.button
                    key={tripType.id}
                    onClick={() => toggleTripType(tripType.id)}
                    className={`w-full p-4 rounded-2xl text-left transition-all border ${
                      isSelected
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-green-100 text-green-800 border-green-200'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{tripType.icon}</span>
                        <div className="text-left">
                          <div className="font-medium">{tripType.label}</div>
                          <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-green-600'}`}>
                            {tripType.description}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-5 h-5" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
            {tripTypes.length > 0 && (
              <div className="pt-4">
                <Button
                  onClick={() => {
                    // Automatically create group adventure
                    handleModeSelection('group');
                  }}
                  className="w-full bg-black hover:bg-black/80 text-white rounded-xl h-12"
                >
                  Create Adventure
                </Button>
              </div>
            )}
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            {mode === 'group' && inviteLink ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-black rounded-2xl p-6 text-white text-center">
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="text-xl mb-2">Group Adventure Created!</h3>
                  <p className="text-sm opacity-90">Share this link with your friends</p>
                </div>

                <div className="bg-green-100 rounded-2xl p-4">
                  <p className="text-xs text-green-600 mb-2">INVITE LINK</p>
                  <div className="bg-white rounded-xl p-3 break-all text-sm text-green-800 border border-green-200">
                    {inviteLink}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={shareInviteLink}
                    className="w-full bg-black hover:bg-black/80 text-white rounded-xl h-12"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Link
                  </Button>
                  <Button
                    onClick={copyInviteLink}
                    variant="outline"
                    className="w-full rounded-xl h-12 border-green-200 text-green-600"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>

                <Button
                  onClick={handleClose}
                  variant="ghost"
                  className="w-full text-green-600"
                >
                  Done
                </Button>
              </motion.div>
            ) : null}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-0 border-0">
        <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-black/10 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            {step > 0 && step < 7 ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="rounded-full text-green-600"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            ) : (
              <div className="w-10" />
            )}
            <div className="flex-1 text-center">
              <div className="text-xs text-green-600">
                {step < 7 ? `Step ${step + 1} of ${totalSteps}` : 'Adventure Created!'}
              </div>
            </div>
            <div className="w-10" />
          </div>
          
          {/* Progress Bar */}
          {step < 7 && (
            <div className="mt-3 h-1 bg-black/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-black rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </div>

        <div className="px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {step < 6 && (
          <div className="sticky bottom-0 bg-white border-t border-black/10 px-6 py-4">
            <Button
              onClick={handleNext}
              className="w-full bg-black hover:bg-black/80 text-white rounded-xl h-12"
            >
              Continue
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
