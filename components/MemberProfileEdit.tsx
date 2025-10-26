import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  User, 
  DollarSign, 
  Heart, 
  X as XIcon, 
  Plus,
  Save,
  X
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

export function MemberProfileEdit({ member, isOpen, onClose, onSave }: MemberProfileEditProps) {
  const [name, setName] = useState(member.name);
  const [budget, setBudget] = useState(member.budget?.toString() || '');
  const [preferences, setPreferences] = useState<string[]>(member.preferences || []);
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
      preferences: preferences
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
              Budget (USD)
            </label>
            <Input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter your budget (optional)"
              min="0"
            />
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