import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Sparkles, ArrowRight, Compass, Plus, X as XIcon, User as UserIcon, Check } from 'lucide-react';
import { User } from '../types';
import { LocationAutocomplete } from './LocationAutocomplete';
import { AdvenTripLogo } from './ui/AdvenTripLogo';

interface OnboardingScreenProps {
  onComplete: (user: User) => void;
}

const preferenceOptions = [
  'Beach', 'Hiking', 'Nightlife', 'Scuba Diving', 'Culture', 'Food',
  'Wellness', 'Snow Sports', 'Shopping', 'Adventure', 'Art Galleries'
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'name' | 'location' | 'preferences' | 'transition'>('name');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isLocationValid, setIsLocationValid] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [customPreference, setCustomPreference] = useState('');
  const [customPreferences, setCustomPreferences] = useState<string[]>([]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setStep('location');
    }
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim() && isLocationValid) {
      setStep('preferences');
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

  const togglePreference = (preference: string) => {
    setSelectedPreferences(prev =>
      prev.includes(preference)
        ? prev.filter(p => p !== preference)
        : [...prev, preference]
    );
  };

  const addCustomPreference = () => {
    if (customPreference.trim() && !customPreferences.includes(customPreference.trim()) && !selectedPreferences.includes(customPreference.trim())) {
      setCustomPreferences([...customPreferences, customPreference.trim()]);
      setSelectedPreferences([...selectedPreferences, customPreference.trim()]);
      setCustomPreference('');
    }
  };

  const removeCustomPreference = (preference: string) => {
    setCustomPreferences(customPreferences.filter(p => p !== preference));
    setSelectedPreferences(selectedPreferences.filter(p => p !== preference));
  };

  const handleComplete = () => {
    if (selectedPreferences.length > 0) {
      setStep('transition');
      setTimeout(() => {
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: name.trim(),
          location: location,
          interests: selectedPreferences,
        };
        onComplete(user);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {step === 'name' && (
          <Card className="w-full">
            <CardHeader className="text-center space-y-0">
              <div className="w-32 h-32 mx-auto flex items-center justify-center">
                <img 
                  src="/AdvenTrip Logo transparent.png" 
                  alt="AdvenTrip Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-black font-display tracking-tight text-green-600 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                  AdvenTrip
                </CardTitle>
                <p className="text-muted-foreground">
                  Your adventure begins here
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleNameSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    What's your name?
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="text-center text-lg"
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
            <CardHeader className="text-center space-y-0">
              <div className="w-32 h-32 mx-auto flex items-center justify-center">
                <img 
                  src="/AdvenTrip Logo transparent.png" 
                  alt="AdvenTrip Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-black font-display tracking-tight text-green-600 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                  AdvenTrip
                </CardTitle>
                <p className="text-muted-foreground">
                  Your adventure begins here
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

        {step === 'preferences' && (
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl">What are your preferences?</CardTitle>
                <p className="text-muted-foreground">
                  Select all that apply
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {preferenceOptions.map((preference) => (
                  <Button
                    key={preference}
                    type="button"
                    variant={selectedPreferences.includes(preference) ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePreference(preference)}
                    className={selectedPreferences.includes(preference) ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {preference}
                    {selectedPreferences.includes(preference) && <Check className="w-4 h-4 ml-2" />}
                  </Button>
                ))}
              </div>

              {/* Custom Preferences */}
              <div className="space-y-4 border-t pt-4">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add your own preferences
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={customPreference}
                    onChange={(e) => setCustomPreference(e.target.value)}
                    placeholder="e.g., Wine Tasting, Rock Climbing"
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomPreference())}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={addCustomPreference}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {customPreferences.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {customPreferences.map((preference) => (
                      <Badge
                        key={preference}
                        variant="secondary"
                        className="pr-1 bg-green-100 text-green-700 border-green-200"
                      >
                        {preference}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCustomPreference(preference)}
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
                  disabled={selectedPreferences.length === 0}
                  className="w-full"
                >
                  Start Exploring
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
                
                {selectedPreferences.length > 0 && (
                  <p className="text-center text-sm text-muted-foreground">
                    {selectedPreferences.length} {selectedPreferences.length === 1 ? 'preference' : 'preferences'} selected
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