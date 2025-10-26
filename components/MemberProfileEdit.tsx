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
  Save, 
  X as XIcon, 
  Plus,
  Edit
} from 'lucide-react';
import { motion } from 'framer-motion';
import { GroupMember } from '../types';

interface MemberProfileEditProps {
  member: GroupMember;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMember: GroupMember) => void;
}

const availablePreferences = [
  'Hiking', 'Beach', 'Museums', 'Food Tours', 'Nightlife',
  'Shopping', 'Photography', 'Adventure Sports', 'Wildlife',
  'Cultural Sites', 'Water Sports', 'Mountains', 'Spa & Wellness',
  'Local Markets', 'Art Galleries', 'Theme Parks', 'Skiing',
  'Diving', 'Surfing', 'Camping'
];

export function MemberProfileEdit({ member, isOpen, onClose, onSave }: MemberProfileEditProps) {
  const [budget, setBudget] = useState<string>(member.budget?.toString() || '');
  const [preferences, setPreferences] = useState<string[]>(member.preferences || []);
  const [customPreference, setCustomPreference] = useState('');

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

  const handleSave = () => {
    const updatedMember: GroupMember = {
      ...member,
      budget: budget ? parseInt(budget) : undefined,
      preferences: preferences
    };
    onSave(updatedMember);
    onClose();
  };

  const handleClose = () => {
    // Reset to original values
    setBudget(member.budget?.toString() || '');
    setPreferences(member.preferences || []);
    setCustomPreference('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Edit Profile - {member.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Budget Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="w-5 h-5" />
                Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Your budget for this adventure (USD)
                </label>
                <Input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Enter your budget (optional)"
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Leave empty if you prefer not to specify
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preferences Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="w-5 h-5" />
                Interests & Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Select your interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {availablePreferences.map((preference) => {
                    const isSelected = preferences.includes(preference);
                    return (
                      <motion.button
                        key={preference}
                        onClick={() => togglePreference(preference)}
                        className={`px-3 py-2 rounded-full text-sm transition-all border ${
                          isSelected
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        {preference}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Preferences */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Add custom preference
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
                  <label className="text-sm font-medium text-gray-700">
                    Selected preferences
                  </label>
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
                          className="ml-1 hover:bg-red-500 hover:text-white rounded-full p-0.5 transition-colors"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex items-center gap-2"
            >
              <XIcon className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
