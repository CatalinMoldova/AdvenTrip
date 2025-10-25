import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Sparkles, ArrowRight, Compass, Plus, X as XIcon } from 'lucide-react';
import { User } from '../types';
import { LocationAutocomplete } from './LocationAutocomplete';

interface OnboardingScreenProps {
  onComplete: (user: User) => void;
}

const availableActivities = [
  'Hiking', 'Beach', 'Museums', 'Food Tours', 'Nightlife',
  'Shopping', 'Photography', 'Adventure Sports', 'Wildlife',
  'Cultural Sites', 'Water Sports', 'Mountains', 'Spa & Wellness',
  'Local Markets', 'Art Galleries', 'Theme Parks', 'Skiing',
  'Diving', 'Surfing', 'Camping'
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'location' | 'activities' | 'transition'>('location');
  const [location, setLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isLocationValid, setIsLocationValid] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [customActivity, setCustomActivity] = useState('');
  const [customActivities, setCustomActivities] = useState<string[]>([]);

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
    if (selectedActivities.length > 0) {
      setStep('transition');
      setTimeout(() => {
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: 'Traveler',
          location: location,
          interests: selectedActivities,
        };
        onComplete(user);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {step === 'location' && (
          <Card className="w-full">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary rounded-2xl flex items-center justify-center">
                <Compass className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl">NOMADIQ</CardTitle>
                <p className="text-muted-foreground">
                  Your journey begins here
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleLocationSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Where are you from?
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
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl">What interests you?</CardTitle>
                <p className="text-muted-foreground">
                  Select activities you'd love to experience
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {availableActivities.map((activity) => (
                  <Button
                    key={activity}
                    type="button"
                    variant={selectedActivities.includes(activity) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleActivity(activity)}
                  >
                    {activity}
                  </Button>
                ))}
              </div>

              {/* Custom Activities */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add your own activities
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={customActivity}
                    onChange={(e) => setCustomActivity(e.target.value)}
                    placeholder="e.g., Wine Tasting, Rock Climbing"
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomActivity())}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={addCustomActivity}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {customActivities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {customActivities.map((activity) => (
                      <Badge
                        key={activity}
                        variant="secondary"
                        className="pr-1"
                      >
                        {activity}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCustomActivity(activity)}
                          className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                        >
                          <XIcon className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleComplete}
                  disabled={selectedActivities.length === 0}
                  className="w-full"
                >
                  Start Exploring
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
                
                {selectedActivities.length > 0 && (
                  <p className="text-center text-sm text-muted-foreground">
                    {selectedActivities.length} {selectedActivities.length === 1 ? 'activity' : 'activities'} selected
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'transition' && (
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-primary rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight text-foreground">
                    Curating adventures just for you...
                  </h3>
                  <div className="flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};