import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  User, 
  DollarSign, 
  Heart, 
  X as XIcon, 
  Plus,
  Save,
  X,
  MapPin,
  Car,
  Route
} from 'lucide-react';
import { motion } from 'framer-motion';
import { GroupMember } from '../types';
import { toast } from 'sonner';

interface MemberProfileEditProps {
  member: GroupMember;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMember: GroupMember) => void;
}

const availableActivities = [
  'Hiking', 'Beach', 'Museums', 'Food Tours', 'Nightlife',
  'Shopping', 'Photography', 'Adventure Sports', 'Wildlife',
  'Cultural Sites', 'Water Sports', 'Mountains', 'Spa & Wellness',
  'Local Markets', 'Art Galleries', 'Theme Parks', 'Skiing',
  'Diving', 'Surfing', 'Camping'
];

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' }
];

const transportationOptions = [
  'Car', 'Train', 'Bus', 'Plane', 'Bike', 'Walking', 'Public Transport', 'Rental Car', 'Taxi/Uber'
];

export function MemberProfileEdit({ member, isOpen, onClose, onSave }: MemberProfileEditProps) {
  const [name, setName] = useState(member.name);
  const [budget, setBudget] = useState(member.budget?.toString() || '');
  const [currency, setCurrency] = useState(member.currency || 'USD');
  const [preferences, setPreferences] = useState<string[]>(member.preferences || []);
  const [transportation, setTransportation] = useState(member.transportation || '');
  const [travelDistance, setTravelDistance] = useState(member.travelDistance?.toString() || '');
  const [customPreference, setCustomPreference] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    const updatedMember: GroupMember = {
      ...member,
      name: name.trim(),
      budget: budget ? parseInt(budget) : undefined,
      currency: currency,
      preferences: preferences,
      transportation: transportation || undefined,
      travelDistance: travelDistance ? parseInt(travelDistance) : undefined,
      hasProvidedInput: true
    };

    onSave(updatedMember);
    onClose();
  };

  const togglePreference = (preference: string) => {
    setPreferences(prev =>
      prev.includes(preference)
        ? prev.filter(p => p !== preference)
        : [...prev, preference]
    );
  };

  const addCustomPreference = () => {
    if (customPreference.trim() && !preferences.includes(customPreference.trim())) {
      setPreferences(prev => [...prev, customPreference.trim()]);
      setCustomPreference('');
    }
  };

  const removePreference = (preference: string) => {
    setPreferences(prev => prev.filter(p => p !== preference));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Budget
            </label>
            <div className="flex gap-2">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Enter amount (optional)"
                min="0"
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Leave empty if you don't want to specify a budget
            </p>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Interests & Preferences
            </label>
            
            {/* Available Activities */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Select from common activities:</p>
              <div className="flex flex-wrap gap-2">
                {availableActivities.map((activity) => {
                  const isSelected = preferences.includes(activity);
                  return (
                    <motion.button
                      key={activity}
                      onClick={() => togglePreference(activity)}
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
            </div>

            {/* Custom Preference */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Add custom preference:
              </label>
              <div className="flex gap-2">
                <Input
                  value={customPreference}
                  onChange={(e) => setCustomPreference(e.target.value)}
                  placeholder="Enter custom preference"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomPreference();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addCustomPreference}
                  disabled={!customPreference.trim()}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Selected Preferences */}
            {preferences.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Your preferences:</p>
                <div className="flex flex-wrap gap-2">
                  {preferences.map((preference) => (
                    <Badge
                      key={preference}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {preference}
                      <button
                        onClick={() => removePreference(preference)}
                        className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Transportation */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Car className="w-4 h-4" />
              Preferred Transportation
            </label>
            <Select value={transportation} onValueChange={setTransportation}>
              <SelectTrigger>
                <SelectValue placeholder="Select transportation (optional)" />
              </SelectTrigger>
              <SelectContent>
                {transportationOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Leave empty if you don't have a preference
            </p>
          </div>

          {/* Travel Distance */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Route className="w-4 h-4" />
              Maximum Travel Distance (km)
            </label>
            <Input
              type="number"
              value={travelDistance}
              onChange={(e) => setTravelDistance(e.target.value)}
              placeholder="Enter maximum distance (optional)"
              min="0"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty if you don't want to specify a limit
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}