import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AdventureRequest, User, GroupMember } from '../types';
import { ChevronLeft, Check, Share2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { LocationAutocomplete } from './LocationAutocomplete';

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
  const [name, setName] = useState(user?.name || '');
  const [location, setLocation] = useState(user?.location || '');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isLocationValid, setIsLocationValid] = useState(false);
  const [activities, setActivities] = useState<string[]>([]);
  const [season, setSeason] = useState<string>('');
  const [duration, setDuration] = useState('');
  const [transport, setTransport] = useState<string>(
    user?.interests?.find(i => transportOptions.some(t => t.id === i.toLowerCase())) || ''
  );
  const [mode, setMode] = useState<'individual' | 'group' | null>(null);
  const [inviteLink, setInviteLink] = useState('');

  const totalSteps = 8;

  const handleClose = () => {
    setStep(0);
    setAdventureName('');
    setName(user?.name || '');
    setLocation(user?.location || '');
    setSelectedLocation(null);
    setIsLocationValid(false);
    setActivities([]);
    setSeason('');
    setDuration('');
    setTransport(user?.interests?.[0] || '');
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

  const handleNext = () => {
    console.log('handleNext called, current step:', step, 'transport value:', transport);
    // Validation
    if (step === 0 && !adventureName.trim()) {
      toast.error('Please enter an adventure name');
      return;
    }
    if (step === 1 && !name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (step === 2 && (!location.trim() || !isLocationValid)) {
      toast.error('Please select a valid location from the suggestions');
      return;
    }
    if (step === 3 && activities.length === 0) {
      toast.error('Please select at least one activity');
      return;
    }
    if (step === 4 && !season) {
      toast.error('Please select a season');
      return;
    }
    if (step === 5 && (!duration || parseInt(duration) < 1)) {
      toast.error('Please enter a valid duration');
      return;
    }
    if (step === 6 && !transport) {
      console.log('Transport validation failed, transport value:', transport);
      toast.error('Please select a means of transport');
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
        activities: activities.map(a => a.replace(/[^\w\s]/g, '').trim()),
        customActivities: [],
        transportation: transport,
        inviteLink: link,
        groupMembers: [{
          id: user?.id || '1',
          name: name.trim(),
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
        numberOfDays: parseInt(duration),
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
              <h2 className="text-2xl text-black mb-2">What's your name?</h2>
              <p className="text-sm text-black/60">Let's personalize your adventure</p>
            </div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="text-center text-lg border-0 bg-black/5 rounded-xl px-6 py-4 text-black"
              autoFocus
            />
          </div>
        );

      case 2:
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

      case 3:
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

      case 4:
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

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl text-black mb-2">How long will it last?</h2>
              <p className="text-sm text-black/60">Number of days</p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDuration(String(Math.max(1, parseInt(duration || '1') - 1)))}
                className="w-12 h-12 rounded-full border-black/20 text-black"
              >
                -
              </Button>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="0"
                className="text-center text-3xl border-0 bg-black/5 rounded-xl w-32 h-20 text-black"
                min="1"
                autoFocus
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDuration(String(parseInt(duration || '0') + 1))}
                className="w-12 h-12 rounded-full border-black/20 text-black"
              >
                +
              </Button>
            </div>
            <p className="text-center text-black/60 text-sm">
              {duration ? `${duration} ${parseInt(duration) === 1 ? 'day' : 'days'}` : 'Enter duration'}
            </p>
          </div>
        );

      case 6:
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
                      console.log('Transport selected:', t.id);
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
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl text-black mb-2">Choose your adventure type</h2>
              <p className="text-sm text-black/60">Solo or with friends?</p>
            </div>
            
            {!mode ? (
              <div className="space-y-4">
                <motion.button
                  onClick={() => handleModeSelection('individual')}
                  className="w-full p-6 rounded-2xl bg-white border border-black/10 text-left transition-all hover:border-black"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-2xl">
                      🌍
                    </div>
                    <div className="flex-1">
                      <div className="text-black mb-1">Solo Adventure</div>
                      <div className="text-xs text-black/60">
                        Plan your personal journey
                      </div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => handleModeSelection('group')}
                  className="w-full p-6 rounded-2xl bg-white border border-black/10 text-left transition-all hover:border-black"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-2xl">
                      👥
                    </div>
                    <div className="flex-1">
                      <div className="text-black mb-1">Group Adventure</div>
                      <div className="text-xs text-black/60">
                        Invite friends to plan together
                      </div>
                    </div>
                  </div>
                </motion.button>
              </div>
            ) : mode === 'group' && inviteLink ? (
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

                <div className="bg-black/5 rounded-2xl p-4">
                  <p className="text-xs text-black/60 mb-2">INVITE LINK</p>
                  <div className="bg-white rounded-xl p-3 break-all text-sm text-black border border-black/10">
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
                    className="w-full rounded-xl h-12 border-black/20 text-black"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>

                <Button
                  onClick={handleClose}
                  variant="ghost"
                  className="w-full text-black"
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
            {step > 0 && step < 6 && (
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
                {step < 6 ? `Step ${step + 1} of ${totalSteps}` : 'Final Step'}
              </div>
            </div>
            <div className="w-10" />
          </div>
          
          {/* Progress Bar */}
          {step < 6 && (
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
