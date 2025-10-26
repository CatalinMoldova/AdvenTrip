import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Sparkles, ArrowRight, Compass, Plus, X as XIcon, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';
import { LocationAutocomplete } from './LocationAutocomplete';

interface InviteOnboardingScreenProps {
  inviteId: string;
  onComplete: (user: User, adventureId: string) => void;
}

const availableActivities = [
  'Hiking', 'Beach', 'Museums', 'Food Tours', 'Nightlife',
  'Shopping', 'Photography', 'Adventure Sports', 'Wildlife',
  'Cultural Sites', 'Water Sports', 'Mountains', 'Spa & Wellness',
  'Local Markets', 'Art Galleries', 'Theme Parks', 'Skiing',
  'Diving', 'Surfing', 'Camping'
];

export const InviteOnboardingScreen: React.FC<InviteOnboardingScreenProps> = ({ 
  inviteId, 
  onComplete 
}) => {
  const [step, setStep] = useState<'name' | 'location' | 'activities'>('name');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isLocationValid, setIsLocationValid] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [customActivity, setCustomActivity] = useState('');
  const [customActivities, setCustomActivities] = useState<string[]>([]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setStep('location');
    }
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim() && isLocationValid) {
      setStep('activities');
    }
  };

  const handleLocationSelect = (locationData: any) => {
    setSelectedLocation(locationData);
  };

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
    if (!newLocation) {
      setSelectedLocation(null);
      setIsLocationValid(false);
    }
  };

  const handleLocationValidationChange = (isValid: boolean) => {
    setIsLocationValid(isValid);
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const addCustomActivity = () => {
    if (customActivity.trim() && !customActivities.includes(customActivity.trim()) && !selectedActivities.includes(customActivity.trim())) {
      setCustomActivities([...customActivities, customActivity.trim()]);
      setSelectedActivities([...selectedActivities, customActivity.trim()]);
      setCustomActivity('');
    }
  };

  const removeCustomActivity = (activity: string) => {
    setCustomActivities(customActivities.filter(a => a !== activity));
    setSelectedActivities(selectedActivities.filter(a => a !== activity));
  };

  const handleComplete = () => {
    console.log('handleComplete called, selectedActivities:', selectedActivities);
    if (selectedActivities.length === 0) {
      console.log('No activities selected, returning');
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      name: name.trim(),
      email: '',
      avatar: '',
      location: location.trim(),
      interests: selectedActivities,
      budget: 1000,
      travelStyle: 'balanced',
      createdAt: new Date().toISOString(),
    };

    console.log('Calling onComplete with:', newUser, inviteId);
    onComplete(newUser, inviteId);
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {step === 'name' && (
          <Card className="w-full">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl">Join Adventure</CardTitle>
                <p className="text-muted-foreground">
                  You've been invited to plan an adventure together
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleNameSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    What's your name?
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!name.trim()}
                  className="w-full"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'location' && (
          <Card className="w-full">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary rounded-2xl flex items-center justify-center">
                <MapPin className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">Where are you from?</CardTitle>
                <p className="text-muted-foreground">
                  This helps us plan your adventure
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleLocationSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Your location
                  </label>
                  <LocationAutocomplete
                    value={location}
                    onChange={handleLocationChange}
                    onSelect={handleLocationSelect}
                    onValidationChange={handleLocationValidationChange}
                    placeholder="Start typing a city or location..."
                  />
                  {location && !isLocationValid && (
                    <p className="text-sm text-red-500">
                      Please select a location from the suggestions above
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={!location.trim() || !isLocationValid}
                  className="w-full"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'activities' && (
          <Card className="w-full">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">What do you enjoy?</CardTitle>
                <p className="text-muted-foreground">
                  Select activities you're interested in
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {availableActivities.map((activity) => {
                    const isSelected = selectedActivities.includes(activity);
                    return (
                      <motion.button
                        key={activity}
                        onClick={() => toggleActivity(activity)}
                        className={`px-3 py-2 rounded-full text-sm transition-all border ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background text-foreground border-border hover:border-primary'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        {activity}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Add custom activity
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={customActivity}
                      onChange={(e) => setCustomActivity(e.target.value)}
                      placeholder="Enter custom activity"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCustomActivity();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addCustomActivity}
                      disabled={!customActivity.trim()}
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {customActivities.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Custom activities
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {customActivities.map((activity) => (
                        <Badge
                          key={activity}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {activity}
                          <button
                            onClick={() => removeCustomActivity(activity)}
                            className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                          >
                            <XIcon className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleComplete}
                  disabled={selectedActivities.length === 0}
                  className="w-full"
                >
                  Join Adventure
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
