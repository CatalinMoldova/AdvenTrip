import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AdventureRequest, User, GroupMember } from '../types';
import { ChevronLeft, Check, Share2, Copy, X, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { LocationAutocomplete } from './LocationAutocomplete';
import { Calendar } from './ui/calendar';

interface CreateAdventureWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAdventure: (request: AdventureRequest) => void;
  user: User | null;
}

const transportOptions = [
  { id: 'all', label: 'All means of transport', icon: '🌍' },
  { id: 'car', label: 'Car', icon: '🚗' },
  { id: 'plane', label: 'Plane', icon: '✈️' },
  { id: 'train', label: 'Train', icon: '🚆' },
  { id: 'bus', label: 'Bus', icon: '🚌' },
  { id: 'bike', label: 'Bike', icon: '🚴' },
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
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [transport, setTransport] = useState<string>('');
  const [mode, setMode] = useState<'individual' | 'group' | null>(null);
  const [inviteLink, setInviteLink] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const totalSteps = 6;

  const handleClose = () => {
    setStep(0);
    setAdventureName('');
    setLocation(user?.location || '');
    setSelectedLocation(null);
    setIsLocationValid(false);
    setActivities([]);
    setSeason('');
    setStartDate(undefined);
    setEndDate(undefined);
    setTransport('');
    setMode(null);
    setInviteLink('');
    setIsCreating(false);
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
    if (step === 4 && (!startDate || !endDate)) {
      toast.error('Please select both departure and return dates');
      return;
    }
    if (step === 4 && startDate && endDate && startDate >= endDate) {
      toast.error('Return date must be after departure date');
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

  const handleModeSelection = (selectedMode: 'individual' | 'group') => {
    if (isCreating) return; // Prevent multiple calls
    
    setIsCreating(true);
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
        numberOfDays: startDate && endDate ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        activities: activities.map(a => a.replace(/[^\w\s]/g, '').trim()),
        customActivities: [],
        transportation: transport,
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
    } else {
      // Create adventure immediately for individual mode
      const request: AdventureRequest = {
        id: Math.random().toString(36).substring(7),
        name: adventureName.trim(),
        userId: user?.id || '1',
        mode: 'individual',
        numberOfDays: startDate && endDate ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        activities: activities.map(a => a.replace(/[^\w\s]/g, '').trim()),
        customActivities: [],
        transportation: transport,
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
        title: 'Join my NOMADIQ adventure!',
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
              <h2 className="text-2xl text-black mb-2">What's your adventure called?</h2>
              <p className="text-sm text-black/60">Give your adventure a memorable name</p>
            </div>
            <Input
              value={adventureName}
              onChange={(e) => setAdventureName(e.target.value)}
              placeholder="e.g., Summer Road Trip, Beach Getaway"
              className="text-center text-lg border-0 bg-black/5 rounded-xl px-6 py-4 text-black"
              autoFocus
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl text-black mb-2">Where are you?</h2>
              <p className="text-sm text-black/60">Your starting point</p>
            </div>
            <LocationAutocomplete
              value={location}
              onChange={handleLocationChange}
              onSelect={handleLocationSelect}
              onValidationChange={handleLocationValidationChange}
              placeholder="Start typing a city or location..."
              className="text-center text-lg border-0 bg-black/5 rounded-xl px-6 py-4 text-black"
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
              <h2 className="text-2xl text-black mb-2">What activities do you want to do?</h2>
              <p className="text-sm text-black/60">Select all that apply</p>
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
                        ? 'bg-black text-white border-black scale-105'
                        : 'bg-white text-black border-black/20'
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
              <h2 className="text-2xl text-black mb-2">What time of year?</h2>
              <p className="text-sm text-black/60">Choose your preferred season</p>
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
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-black/10'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{s.icon}</span>
                        <div>
                          <div className={isSelected ? 'text-white' : 'text-black'}>
                            {s.label}
                          </div>
                          <div className={`text-xs ${isSelected ? 'text-white/70' : 'text-black/60'}`}>
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
            <div className="text-center mb-6">
              <h2 className="text-2xl text-black mb-2">When do you want to travel?</h2>
              <p className="text-sm text-black/60">Select your departure and return dates</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-black/60" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-black">Departure Date</p>
                  <p className="text-xs text-black/60">
                    {startDate ? startDate.toLocaleDateString() : 'Select departure date'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-black/60" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-black">Return Date</p>
                  <p className="text-xs text-black/60">
                    {endDate ? endDate.toLocaleDateString() : 'Select return date'}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-black/10 rounded-xl p-4">
              <Calendar
                mode="range"
                selected={{ from: startDate, to: endDate }}
                onSelect={(range) => {
                  if (range?.from) {
                    setStartDate(range.from);
                  }
                  if (range?.to) {
                    setEndDate(range.to);
                  }
                }}
                disabled={(date) => date < new Date()}
                className="w-full"
              />
            </div>

            {startDate && endDate && (
              <div className="text-center p-3 bg-black/5 rounded-xl">
                <p className="text-sm text-black">
                  <span className="font-semibold">
                    {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} 
                    {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) === 1 ? ' day' : ' days'}
                  </span>
                  {' '}trip selected
                </p>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl text-black mb-2">What means of transportation?</h2>
              <p className="text-sm text-black/60">Choose how you want to travel</p>
            </div>
            <div className="space-y-2">
              {transportOptions.map((t) => {
                const isSelected = transport === t.id;
                return (
                  <motion.button
                    key={t.id}
                    onClick={() => {
                      setTransport(t.id);
                    }}
                    className={`w-full p-4 rounded-2xl text-left transition-all border ${
                      isSelected
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-black/10'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{t.icon}</span>
                        <span>{t.label}</span>
                      </div>
                      {isSelected && <Check className="w-5 h-5" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
            
            {transport && (
              <div className="pt-4">
                <Button
                  onClick={() => {
                    if (isCreating) return;
                    handleModeSelection('group');
                    handleClose(); // Close the wizard after creation
                  }}
                  disabled={isCreating}
                  className="w-full bg-black hover:bg-black/80 text-white rounded-xl h-12"
                >
                  {isCreating ? 'Creating...' : 'Create Adventure'}
                </Button>
              </div>
            )}
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
            {step > 0 && step < totalSteps - 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="rounded-full text-black"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            <div className="flex-1 text-center">
              <div className="text-xs text-black/60">
                {step < totalSteps - 1 ? `Step ${step + 1} of ${totalSteps}` : 'Final Step'}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="rounded-full text-black hover:bg-black/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          {step < totalSteps - 1 && (
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

        {step < totalSteps - 1 && (
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
