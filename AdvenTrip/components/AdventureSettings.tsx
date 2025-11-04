import React, { useState, KeyboardEvent } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { ArrowLeft, Copy, Share2, Settings, Save, Calendar as CalendarIcon, DollarSign, Check, Plus, X, Users, Heart } from 'lucide-react';
import { AdventureRequest, Adventure, GroupMember } from '../types';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface AdventureSettingsProps {
  adventureRequest: AdventureRequest & {
    savedAdventures?: Array<{ adventure: Adventure; rating: number; userId?: string }>;
  };
  onBack: () => void;
  onSave?: (updatedRequest: AdventureRequest) => void;
}

const activityOptions = [
  '🏖️ Beach', '🥾 Hiking', '🏛️ Museums', '🍜 Food Tours',
  '🎉 Nightlife', '🛍️ Shopping', '📸 Photography', '🪂 Adventure Sports',
  '🦁 Wildlife', '🏰 Cultural Sites', '🏄 Water Sports', '⛰️ Mountains',
  '🧖 Spa & Wellness', '🎨 Art Galleries', '🎢 Theme Parks'
];

const tripTypeOptions = [
  { id: 'road-trip', label: 'Road trip', icon: '🛣️' },
  { id: 'city-to-city', label: 'City-to-city travel', icon: '🚆', description: 'Train, car, or plane between cities' },
  { id: 'stay-one-city', label: 'Stay in one city', icon: '🏨' },
];

const currencyOptions = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'CAD', label: 'CAD (C$)' },
  { value: 'AUD', label: 'AUD (A$)' },
  { value: 'CHF', label: 'CHF' },
  { value: 'CNY', label: 'CNY (¥)' },
];

export function AdventureSettings({ adventureRequest, onBack, onSave }: AdventureSettingsProps) {
  const [adventureName, setAdventureName] = useState(adventureRequest.name);
  const [numberOfDays, setNumberOfDays] = useState(adventureRequest.numberOfDays.toString());
  const [budget, setBudget] = useState(adventureRequest.budget?.toString() || '');
  const [currency, setCurrency] = useState('USD');
  const [budgetDisplay, setBudgetDisplay] = useState('');
  const [activities, setActivities] = useState<string[]>(adventureRequest.activities || []);
  // Parse transportation if it's comma-separated trip types
  const [selectedTripTypes, setSelectedTripTypes] = useState<string[]>(
    adventureRequest.transportation 
      ? (adventureRequest.transportation.includes(',') 
          ? adventureRequest.transportation.split(',').filter(Boolean)
          : [adventureRequest.transportation])
      : []
  );
  const [startDate, setStartDate] = useState<Date | undefined>(
    adventureRequest.startDate ? new Date(adventureRequest.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    adventureRequest.endDate ? new Date(adventureRequest.endDate) : undefined
  );
  const [useDateRange, setUseDateRange] = useState(!!(adventureRequest.startDate && adventureRequest.endDate));
  const [startDatePopoverOpen, setStartDatePopoverOpen] = useState(false);
  const [endDatePopoverOpen, setEndDatePopoverOpen] = useState(false);
  const [showAddPreferencesDialog, setShowAddPreferencesDialog] = useState(false);
  const [customPreference, setCustomPreference] = useState('');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get members sorted with creator first
  const getSortedMembers = (): GroupMember[] => {
    const members = adventureRequest.groupMembers || [];
    const creator = members.find(m => m.id === adventureRequest.userId);
    const otherMembers = members.filter(m => m.id !== adventureRequest.userId);
    return creator ? [creator, ...otherMembers] : members;
  };

  const sortedMembers = getSortedMembers();
  const savedTrips = adventureRequest.savedAdventures || [];
  const inviteLink = adventureRequest.inviteLink || `${window.location.origin}/join/${adventureRequest.id}`;

  const toggleActivity = (activity: string) => {
    setActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const addCustomPreference = () => {
    if (customPreference.trim() && !activities.includes(customPreference.trim())) {
      setActivities(prev => [...prev, customPreference.trim()]);
      setCustomPreference('');
      toast.success('Custom preference added!');
    } else if (activities.includes(customPreference.trim())) {
      toast.error('This preference already exists');
    } else {
      toast.error('Please enter a preference');
    }
  };

  const removeActivity = (activity: string) => {
    setActivities(prev => prev.filter(a => a !== activity));
  };

  const toggleTripType = (tripTypeId: string) => {
    setSelectedTripTypes(prev =>
      prev.includes(tripTypeId)
        ? prev.filter(t => t !== tripTypeId)
        : [...prev, tripTypeId]
    );
  };

  const handleDateRangeChange = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from) {
      setStartDate(range.from);
    }
    if (range?.to) {
      setEndDate(range.to);
      if (range.from && range.to) {
        const days = Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24));
        setNumberOfDays(days.toString());
      }
    }
  };

  const handleNumberOfDaysChange = (days: string) => {
    // Only allow digits
    const numericValue = days.replace(/[^0-9]/g, '');
    if (numericValue === '' || (numericValue.length > 0 && parseInt(numericValue) > 0)) {
      setNumberOfDays(numericValue);
      if (startDate && numericValue && !isNaN(parseInt(numericValue)) && parseInt(numericValue) > 0) {
        const newEndDate = new Date(startDate);
        newEndDate.setDate(newEndDate.getDate() + parseInt(numericValue) - 1);
        setEndDate(newEndDate);
      }
    }
  };

  const handleBudgetChange = (value: string) => {
    // Only allow digits and decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    const sanitized = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
    setBudget(sanitized);
  };

  const handleBudgetKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && budget) {
      const formattedAmount = parseFloat(budget).toLocaleString('en-US');
      const currencyLabel = currencyOptions.find(c => c.value === currency)?.label || currency;
      setBudgetDisplay(`${formattedAmount} ${currencyLabel}`);
      toast.success(`Budget set: ${formattedAmount} ${currencyLabel}`);
    }
  };

  const handleSave = () => {
    if (!adventureName.trim()) {
      toast.error('Please enter an adventure name');
      return;
    }

    if (useDateRange && (!startDate || !endDate)) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (useDateRange && startDate && endDate && startDate >= endDate) {
      toast.error('End date must be after start date');
      return;
    }

    const days = useDateRange && startDate && endDate
      ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      : parseInt(numberOfDays) || adventureRequest.numberOfDays;

    const updatedRequest: AdventureRequest = {
      ...adventureRequest,
      name: adventureName.trim(),
      numberOfDays: days,
      budget: budget ? parseFloat(budget) : undefined,
      activities: activities,
      transportation: selectedTripTypes.join(','),
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    };

    onSave?.(updatedRequest);
    toast.success('Adventure settings saved! ✨');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-green-200 z-10">
        <div className="flex items-center gap-4 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full text-green-600 hover:bg-green-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <Settings className="w-5 h-5 text-green-600" />
            <h1 className="text-xl font-semibold text-green-800">Adventure Settings</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Adventure Name */}
          <Card className="border-green-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="adventure-name" className="text-sm font-medium text-green-600 mb-2 block">
                    Adventure Name
                  </Label>
                  <Input
                    id="adventure-name"
                    value={adventureName}
                    onChange={(e) => setAdventureName(e.target.value)}
                    placeholder="Enter adventure name"
                    className="text-lg border-green-200 bg-green-50 text-green-800"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Duration / Dates */}
          <Card className="border-green-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => setUseDateRange(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      !useDateRange
                        ? 'bg-green-500 text-white'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    Number of Days
                  </button>
                  <button
                    onClick={() => setUseDateRange(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      useDateRange
                        ? 'bg-green-500 text-white'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    Specific Dates
                  </button>
                </div>

                {!useDateRange ? (
                  <div>
                    <Label htmlFor="number-of-days" className="text-sm font-medium text-green-600 mb-2 block">
                      Number of Days
                    </Label>
                    <Input
                      id="number-of-days"
                      type="text"
                      inputMode="numeric"
                      value={numberOfDays}
                      onChange={(e) => handleNumberOfDaysChange(e.target.value)}
                      placeholder="Enter number of days"
                      className="border-green-200 bg-green-50 text-green-800"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-green-600 mb-2 block">
                          Start Date
                        </Label>
                        <Popover open={startDatePopoverOpen} onOpenChange={setStartDatePopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal border-green-200 bg-green-50 text-green-800 hover:bg-green-100"
                              type="button"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? format(startDate, 'PPP') : 'Select start date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-[100]" align="start" side="bottom">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={(date) => {
                                if (date) {
                                  setStartDate(date);
                                  setStartDatePopoverOpen(false);
                                  if (endDate && date >= endDate) {
                                    setEndDate(undefined);
                                  }
                                }
                              }}
                              disabled={(date) => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return date < today;
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-green-600 mb-2 block">
                          End Date
                        </Label>
                        <Popover open={endDatePopoverOpen} onOpenChange={setEndDatePopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal border-green-200 bg-green-50 text-green-800 hover:bg-green-100"
                              disabled={!startDate}
                              type="button"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, 'PPP') : 'Select end date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-[100]" align="start" side="bottom">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={(date) => {
                                if (date) {
                                  setEndDate(date);
                                  setEndDatePopoverOpen(false);
                                  if (date && startDate) {
                                    const days = Math.ceil((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                                    setNumberOfDays(days.toString());
                                  }
                                }
                              }}
                              disabled={(date) => {
                                if (!startDate) return true;
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return date <= startDate || date < today;
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    {startDate && endDate && (
                      <div className="text-sm text-green-600 font-medium">
                        Duration: {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Budget */}
          <Card className="border-green-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="budget" className="text-sm font-medium text-green-600 mb-2 block flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Maximum Budget
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="budget"
                      type="text"
                      inputMode="decimal"
                      value={budget}
                      onChange={(e) => handleBudgetChange(e.target.value)}
                      onKeyDown={handleBudgetKeyDown}
                      placeholder="Enter amount"
                      className="flex-1 border-green-200 bg-green-50 text-green-800"
                    />
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="w-32 border-green-200 bg-green-50 text-green-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencyOptions.map((curr) => (
                          <SelectItem key={curr.value} value={curr.value}>
                            {curr.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {budgetDisplay && (
                    <div className="mt-2 text-sm font-medium text-green-700">
                      {budgetDisplay}
                    </div>
                  )}
                  <p className="text-xs text-green-500 mt-2">
                    Press Enter to confirm your budget
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activities */}
          <Card className="border-green-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-green-600 mb-2 block">
                      Preferences
                    </Label>
                    <p className="text-xs text-green-500">
                      Your selected preferences
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowAddPreferencesDialog(true)}
                    variant="outline"
                    size="icon"
                    className="rounded-full border-green-200 text-green-600 hover:bg-green-50"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {activities.length === 0 ? (
                  <div className="text-center py-8 text-green-500 text-sm">
                    No preferences selected. Click the + button to add preferences.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {activities.map((activity) => (
                      <div
                        key={activity}
                        className="px-4 py-2 rounded-full text-sm bg-green-500 text-white border border-green-500 flex items-center gap-2"
                      >
                        <span>{activity}</span>
                        <button
                          onClick={() => removeActivity(activity)}
                          className="hover:bg-green-600 rounded-full p-0.5 transition-colors"
                          type="button"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Add Preferences Dialog */}
          <Dialog open={showAddPreferencesDialog} onOpenChange={setShowAddPreferencesDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-green-800">Add Preferences</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Available Preferences */}
                <div>
                  <Label className="text-sm font-medium text-green-600 mb-3 block">
                    Available Preferences
                  </Label>
                  <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto">
                    {activityOptions.map((activity) => {
                      const isSelected = activities.includes(activity);
                      return (
                        <button
                          key={activity}
                          onClick={() => toggleActivity(activity)}
                          className={`px-4 py-2 rounded-full text-sm transition-all border ${
                            isSelected
                              ? 'bg-green-500 text-white border-green-500'
                              : 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                          }`}
                          type="button"
                        >
                          {activity}
                          {isSelected && <Check className="inline w-4 h-4 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Preference Input */}
                <div>
                  <Label htmlFor="custom-preference" className="text-sm font-medium text-green-600 mb-2 block">
                    Add Custom Preference
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="custom-preference"
                      value={customPreference}
                      onChange={(e) => setCustomPreference(e.target.value)}
                      placeholder="Enter custom preference (e.g., Party, Relaxation, Culture)"
                      className="flex-1 border-green-200 bg-green-50 text-green-800"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCustomPreference();
                        }
                      }}
                    />
                    <Button
                      onClick={addCustomPreference}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Selected Preferences Summary */}
                {activities.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-green-600 mb-2 block">
                      Selected Preferences ({activities.length})
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {activities.map((activity) => (
                        <div
                          key={activity}
                          className="px-3 py-1 rounded-full text-xs bg-green-500 text-white"
                        >
                          {activity}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    onClick={() => setShowAddPreferencesDialog(false)}
                    variant="outline"
                    className="border-green-200 text-green-600"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Transportation / Trip Types */}
          <Card className="border-green-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-green-600 mb-2 block">
                    Trip Type
                  </Label>
                  <p className="text-xs text-green-500 mb-3">
                    Select all trip types that apply
                  </p>
                  <div className="space-y-2">
                    {tripTypeOptions.map((tripType) => {
                      const isSelected = selectedTripTypes.includes(tripType.id);
                      return (
                        <button
                          key={tripType.id}
                          onClick={() => toggleTripType(tripType.id)}
                          className={`w-full p-3 rounded-xl text-left transition-all border ${
                            isSelected
                              ? 'bg-green-500 text-white border-green-500'
                              : 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{tripType.icon}</span>
                              <div>
                                <div className="text-sm font-medium">{tripType.label}</div>
                                {tripType.description && (
                                  <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-green-600'}`}>
                                    {tripType.description}
                                  </div>
                                )}
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adventure Members */}
          {adventureRequest.mode === 'group' && (
            <Card className="border-green-200 bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <Label className="text-sm font-medium text-green-600">
                      Adventure Members
                    </Label>
                  </div>
                  <p className="text-xs text-green-500 mb-3">
                    Travelers who have joined this adventure
                  </p>
                  {sortedMembers.length === 0 ? (
                    <div className="text-center py-8 text-green-500 text-sm">
                      No members have joined yet. Share the invite link to get started!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sortedMembers.map((member, index) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200"
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="bg-green-500 text-white text-sm">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-green-800 truncate">
                                {member.name}
                              </p>
                              {index === 0 && member.id === adventureRequest.userId && (
                                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                                  Creator
                                </span>
                              )}
                            </div>
                            {member.budget && (
                              <p className="text-xs text-green-600">
                                Budget: ${member.budget.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Saved Trips */}
          <Card className="border-green-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-green-600" />
                  <Label className="text-sm font-medium text-green-600">
                    Saved Trips
                  </Label>
                </div>
                <p className="text-xs text-green-500 mb-3">
                  Trips liked in this adventure's feed
                </p>
                {savedTrips.length === 0 ? (
                  <div className="text-center py-8 text-green-500 text-sm">
                    No trips saved yet. Start swiping to save your favorite trips!
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {savedTrips.map((savedTrip) => {
                      // Find the user who saved this trip
                      const savedByUser = savedTrip.userId
                        ? sortedMembers.find(m => m.id === savedTrip.userId)
                        : null;
                      
                      return (
                        <motion.div
                          key={savedTrip.adventure.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group"
                        >
                          <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-green-200 bg-green-50 cursor-pointer hover:border-green-300 transition-all">
                            {/* Trip Image */}
                            <img
                              src={savedTrip.adventure.images[0] || 'https://via.placeholder.com/300'}
                              alt={savedTrip.adventure.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/300';
                              }}
                            />
                            
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            
                            {/* User Avatar/Initials Badge */}
                            {savedByUser && (
                              <div className="absolute top-2 right-2">
                                <Avatar className="w-8 h-8 border-2 border-white shadow-md">
                                  <AvatarImage src={savedByUser.avatar} />
                                  <AvatarFallback className="bg-green-500 text-white text-xs">
                                    {getInitials(savedByUser.name)}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                            )}
                            
                            {/* Trip Info */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                              <h4 className="text-sm font-semibold line-clamp-1 mb-1">
                                {savedTrip.adventure.title}
                              </h4>
                              <div className="flex items-center justify-between text-xs opacity-90">
                                <span className="line-clamp-1">{savedTrip.adventure.destination}</span>
                                {savedTrip.rating && (
                                  <span className="ml-2">{savedTrip.rating}%</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shareable Link */}
          <Card className="border-green-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-green-600 mb-2 block">
                    Shareable Link
                  </Label>
                  <p className="text-xs text-green-500 mb-3">
                    Share this link with others to invite them to join your adventure
                  </p>
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <p className="text-sm text-green-800 break-all font-mono">
                      {inviteLink}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={shareInviteLink}
                    className="flex-1 bg-black hover:bg-black/80 text-white rounded-xl h-12"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    onClick={copyInviteLink}
                    variant="outline"
                    className="flex-1 rounded-xl h-12 border-green-200 text-green-600 hover:bg-green-50"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="sticky bottom-0 bg-white/80 backdrop-blur-xl border-t border-green-200 p-4 -mx-6">
            <Button
              onClick={handleSave}
              className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl h-12 text-lg font-medium"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
