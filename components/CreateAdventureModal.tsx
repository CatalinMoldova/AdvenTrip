import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, Users, User, Plus, X as XIcon, Link as LinkIcon, Sparkles, DollarSign, Plane, Car, Train, Ship, MapPin } from 'lucide-react';
import { AdventureRequest, GroupMember } from '../types';
import { toast } from 'sonner';
import { NumberWheel } from './NumberWheel';
import { BudgetSelector } from './BudgetSelector';

interface CreateAdventureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAdventure: (request: AdventureRequest) => void;
  friends: GroupMember[];
}

const availableActivities = [
  'Hiking', 'Beach', 'Museums', 'Food Tours', 'Nightlife',
  'Shopping', 'Photography', 'Adventure Sports', 'Wildlife',
  'Cultural Sites', 'Water Sports', 'Mountains', 'Spa & Wellness',
  'Local Markets', 'Art Galleries', 'Theme Parks', 'Skiing',
  'Diving', 'Surfing', 'Camping'
];

export const CreateAdventureModal: React.FC<CreateAdventureModalProps> = ({
  isOpen,
  onClose,
  onCreateAdventure,
  friends,
}) => {
  const [mode, setMode] = useState<'individual' | 'group'>('individual');
  const [numberOfDays, setNumberOfDays] = useState(3);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [customActivity, setCustomActivity] = useState('');
  const [customActivities, setCustomActivities] = useState<string[]>([]);
  const [budget, setBudget] = useState<number>(1000);
  const [transportation, setTransportation] = useState<string>('');
  const [travelDistance, setTravelDistance] = useState<number>(100);
  const [travelDistanceUnit, setTravelDistanceUnit] = useState<'hours' | 'miles'>('miles');
  const [selectedFriends, setSelectedFriends] = useState<GroupMember[]>([]);
  const [inviteLink, setInviteLink] = useState('');

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const addCustomActivity = () => {
    if (customActivity.trim() && !customActivities.includes(customActivity.trim())) {
      setCustomActivities([...customActivities, customActivity.trim()]);
      setCustomActivity('');
    }
  };

  const removeCustomActivity = (activity: string) => {
    setCustomActivities(customActivities.filter(a => a !== activity));
  };

  const toggleFriend = (friend: GroupMember) => {
    setSelectedFriends(prev =>
      prev.find(f => f.id === friend.id)
        ? prev.filter(f => f.id !== friend.id)
        : [...prev, friend]
    );
  };

  const generateInviteLink = () => {
    const link = `https://nomadiq.app/invite/${Math.random().toString(36).substr(2, 9)}`;
    setInviteLink(link);
    navigator.clipboard.writeText(link);
    toast.success('Invite link copied to clipboard!');
  };

  const handleCreate = () => {
    if (mode === 'group' && selectedFriends.length === 0) {
      toast.error('Please select at least one friend for group adventure');
      return;
    }

    const request: AdventureRequest = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'current-user',
      mode,
      numberOfDays,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      activities: selectedActivities,
      customActivities,
      budget,
      transportation: transportation || undefined,
      travelDistance,
      travelDistanceUnit,
      groupMembers: mode === 'group' ? selectedFriends : undefined,
      inviteLink: mode === 'group' ? inviteLink : undefined,
      status: mode === 'group' ? 'pending' : 'generating',
      createdAt: new Date().toISOString(),
    };

    onCreateAdventure(request);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setMode('individual');
    setNumberOfDays(3);
    setStartDate('');
    setEndDate('');
    setSelectedActivities([]);
    setCustomActivities([]);
    setBudget(1000);
    setTransportation('');
    setTravelDistance(100);
    setTravelDistanceUnit('miles');
    setSelectedFriends([]);
    setInviteLink('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            Create New Adventure
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mode Selection */}
          <div>
            <Label className="text-base mb-3 block">Adventure Mode</Label>
            <Tabs value={mode} onValueChange={(v) => setMode(v as 'individual' | 'group')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="individual" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Individual
                </TabsTrigger>
                <TabsTrigger value="group" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Group
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Duration */}
          <div>
            <Label className="text-base mb-3 block flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Duration
            </Label>
            <div className="space-y-4">
              <div>
                <NumberWheel
                  value={numberOfDays}
                  onChange={setNumberOfDays}
                  min={1}
                  max={30}
                  label={numberOfDays === 1 ? 'day' : 'days'}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">Start Date (Optional)</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">End Date (Optional)</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Activities */}
          <div>
            <Label className="text-base mb-3 block">Activities & Interests</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {availableActivities.map((activity) => (
                <Badge
                  key={activity}
                  onClick={() => toggleActivity(activity)}
                  className={`cursor-pointer transition-all ${
                    selectedActivities.includes(activity)
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {activity}
                </Badge>
              ))}
            </div>

            {/* Custom Activities */}
            <div className="mt-4">
              <Label className="text-sm text-gray-600 mb-2 block">Add Your Own Activities</Label>
              <div className="flex gap-2 mb-3">
                <Input
                  type="text"
                  value={customActivity}
                  onChange={(e) => setCustomActivity(e.target.value)}
                  placeholder="e.g., Wine Tasting, Cooking Class"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomActivity())}
                />
                <Button type="button" onClick={addCustomActivity} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {customActivities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {customActivities.map((activity) => (
                    <Badge
                      key={activity}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white pr-1"
                    >
                      {activity}
                      <button
                        onClick={() => removeCustomActivity(activity)}
                        className="ml-2 hover:bg-white/20 rounded-full p-0.5"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Budget */}
          <div>
            <Label className="text-base mb-3 block flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Budget
            </Label>
            <BudgetSelector
              value={budget}
              onChange={setBudget}
            />
          </div>

          {/* Transportation */}
          <div>
            <Label className="text-base mb-3 block flex items-center gap-2">
              <Plane className="w-4 h-4" />
              Means of Transportation
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'plane', label: 'Plane', icon: Plane },
                { value: 'car', label: 'Car', icon: Car },
                { value: 'train', label: 'Train', icon: Train },
                { value: 'boat', label: 'Boat', icon: Ship },
              ].map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  type="button"
                  variant={transportation === value ? 'default' : 'outline'}
                  onClick={() => setTransportation(value)}
                  className={`${transportation === value ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : ''} flex items-center gap-2 justify-center`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Travel Distance */}
          <div>
            <Label className="text-base mb-3 block flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Travel Distance
            </Label>
            <div className="space-y-3">
              <div className="flex gap-3">
                <Input
                  type="number"
                  min="0"
                  value={travelDistance}
                  onChange={(e) => setTravelDistance(parseInt(e.target.value) || 0)}
                  className="flex-1"
                  placeholder="Distance"
                />
                <Select value={travelDistanceUnit} onValueChange={(v) => setTravelDistanceUnit(v as 'hours' | 'miles')}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="miles">Miles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                {travelDistanceUnit === 'miles' ? (
                  <>
                    {[50, 100, 250, 500, 1000].map((dist) => (
                      <Button
                        key={dist}
                        type="button"
                        variant={travelDistance === dist ? 'default' : 'outline'}
                        onClick={() => setTravelDistance(dist)}
                        size="sm"
                        className={travelDistance === dist ? 'bg-gradient-to-r from-orange-600 to-red-600' : ''}
                      >
                        {dist}mi
                      </Button>
                    ))}
                  </>
                ) : (
                  <>
                    {[1, 3, 5, 8, 12].map((dist) => (
                      <Button
                        key={dist}
                        type="button"
                        variant={travelDistance === dist ? 'default' : 'outline'}
                        onClick={() => setTravelDistance(dist)}
                        size="sm"
                        className={travelDistance === dist ? 'bg-gradient-to-r from-orange-600 to-red-600' : ''}
                      >
                        {dist}h
                      </Button>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Group Selection */}
          {mode === 'group' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Label className="text-base mb-3 block flex items-center gap-2">
                <Users className="w-4 h-4" />
                Invite Friends
              </Label>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      onClick={() => toggleFriend(friend)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedFriends.find(f => f.id === friend.id)
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 bg-white hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm">
                          {friend.name.charAt(0)}
                        </div>
                        <span className="text-sm">{friend.name}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedFriends.length > 0 && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">{selectedFriends.length} friends selected</span>
                      <Button
                        type="button"
                        size="sm"
                        onClick={generateInviteLink}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600"
                      >
                        <LinkIcon className="w-3 h-3 mr-2" />
                        Generate Invite Link
                      </Button>
                    </div>
                    {inviteLink && (
                      <div className="text-xs text-purple-700 bg-white p-2 rounded border border-purple-200 break-all">
                        {inviteLink}
                      </div>
                    )}
                    <p className="text-xs text-gray-600 mt-2">
                      ⚠️ Adventure will be generated once all invited members provide their input
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreate}
              disabled={selectedActivities.length === 0 && customActivities.length === 0}
              className="flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700"
            >
              {mode === 'group' ? 'Send Invites' : 'Create Adventure'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
