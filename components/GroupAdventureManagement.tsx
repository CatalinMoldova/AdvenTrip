import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Users, 
  Share2, 
  Copy, 
  MapPin, 
  Calendar, 
  DollarSign, 
  ArrowLeft,
  User,
  Heart,
  Star,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdventureRequest, GroupMember } from '../types';
import { toast } from 'sonner';
import { MemberProfileEditSimple } from './MemberProfileEditSimple';

interface GroupAdventureManagementProps {
  adventureRequest: AdventureRequest;
  currentUser: any;
  onBack: () => void;
  onShareLink: (link: string) => void;
  onBackToApp?: () => void;
  onUpdateAdventure?: (updatedAdventure: AdventureRequest) => void;
}

export function GroupAdventureManagement({ 
  adventureRequest, 
  currentUser, 
  onBack,
  onShareLink,
  onBackToApp,
  onUpdateAdventure 
}: GroupAdventureManagementProps) {
  console.log('GroupAdventureManagement rendered with:', { adventureRequest, currentUser });
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);
  const [editingMember, setEditingMember] = useState<GroupMember | null>(null);
  const [localAdventureRequest, setLocalAdventureRequest] = useState<AdventureRequest>(adventureRequest);

  // Calculate group summary
  const getGroupSummary = () => {
    const members = localAdventureRequest.groupMembers || [];
    
    // Common interests (most frequent)
    const allPreferences = members.flatMap(m => m.preferences || []);
    const preferenceCounts = allPreferences.reduce((acc, pref) => {
      acc[pref] = (acc[pref] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const commonInterests = Object.entries(preferenceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([pref]) => pref);
    
    // Minimum duration (if members have duration preferences)
    const durations = members.map(m => m.budget).filter(Boolean);
    const minBudget = durations.length > 0 ? Math.min(...durations) : undefined;
    
    // Transportation preferences
    const transportations = members.map(m => m.preferences?.find(p => 
      ['car', 'plane', 'train', 'bus', 'bike'].includes(p.toLowerCase())
    )).filter(Boolean);
    
    return {
      commonInterests,
      minBudget,
      transportations: [...new Set(transportations)]
    };
  };

  const handleMemberUpdate = (updatedMember: GroupMember) => {
    const updatedMembers = localAdventureRequest.groupMembers?.map(member =>
      member.id === updatedMember.id ? updatedMember : member
    ) || [];
    
    const updatedAdventure = {
      ...localAdventureRequest,
      groupMembers: updatedMembers
    };
    
    setLocalAdventureRequest(updatedAdventure);
    onUpdateAdventure?.(updatedAdventure);
    toast.success('Profile updated successfully!');
  };

  const copyInviteLink = () => {
    if (adventureRequest.inviteLink) {
      navigator.clipboard.writeText(adventureRequest.inviteLink);
      toast.success('Invite link copied! 📋');
    }
  };

  const shareInviteLink = () => {
    if (adventureRequest.inviteLink) {
      if (navigator.share) {
        navigator.share({
          title: 'Join my NOMADIQ adventure!',
          text: 'Let\'s plan an adventure together',
          url: adventureRequest.inviteLink,
        });
      } else {
        copyInviteLink();
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (selectedMember) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMember(null)}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Member Profile</h1>
            </div>

            {/* Member Profile Card */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 border-4 border-white">
                    <AvatarImage src={selectedMember.avatar} />
                    <AvatarFallback className="text-lg font-semibold">
                      {getInitials(selectedMember.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-white text-xl">
                      {selectedMember.name}
                    </CardTitle>
                    <p className="text-blue-100">Adventure Member</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{selectedMember.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Budget</p>
                      <p className="font-medium">${selectedMember.budget?.toLocaleString() || 'Not set'}</p>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Interests & Preferences
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.preferences?.map((preference) => (
                      <Badge key={preference} variant="secondary" className="px-3 py-1">
                        {preference}
                      </Badge>
                    )) || (
                      <p className="text-gray-500 italic">No preferences set</p>
                    )}
                  </div>
                </div>

                {/* Adventure Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Adventure Preferences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">{adventureRequest.numberOfDays} days</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Transportation</p>
                        <p className="font-medium">{adventureRequest.transportation || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Group Adventure</h1>
                <p className="text-gray-600">Manage your adventure group</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {onBackToApp && (
                <Button
                  variant="outline"
                  onClick={onBackToApp}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to App
                </Button>
              )}
              <Button
                variant="outline"
                onClick={copyInviteLink}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </Button>
              <Button
                onClick={shareInviteLink}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Adventure Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Adventure Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-semibold">{localAdventureRequest.numberOfDays} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Activities</p>
                  <p className="font-semibold">{localAdventureRequest.activities.length} selected</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-semibold">{formatDate(localAdventureRequest.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Group Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Group Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const summary = getGroupSummary();
                return (
                  <div className="space-y-4">
                    {/* Common Interests */}
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Group Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {summary.commonInterests.length > 0 ? (
                          summary.commonInterests.map((interest) => (
                            <Badge key={interest} variant="secondary" className="px-3 py-1">
                              {interest}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-gray-400 italic">No common interests yet</p>
                        )}
                      </div>
                    </div>

                    {/* Group Budget */}
                    <div>
                      <p className="text-sm text-gray-500">Group Budget</p>
                      <p className="font-semibold">
                        {summary.minBudget ? `$${summary.minBudget.toLocaleString()}` : 'Not specified'}
                      </p>
                    </div>

                    {/* Transportation Preferences */}
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Transportation Preferences</p>
                      <div className="flex flex-wrap gap-2">
                        {summary.transportations.length > 0 ? (
                          summary.transportations.map((transport) => (
                            <Badge key={transport} variant="outline" className="px-3 py-1">
                              {transport}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-gray-400 italic">No transportation preferences yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Group Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Group Members ({localAdventureRequest.groupMembers?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {localAdventureRequest.groupMembers && localAdventureRequest.groupMembers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {localAdventureRequest.groupMembers.map((member) => (
                    <motion.div
                      key={member.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div 
                              className="flex items-center gap-3 flex-1 cursor-pointer"
                              onClick={() => setSelectedMember(member)}
                            >
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>
                                  {getInitials(member.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate">
                                  {member.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Budget: ${member.budget?.toLocaleString() || 'Not specified'}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {member.preferences?.slice(0, 2).map((pref) => (
                                    <Badge key={pref} variant="outline" className="text-xs">
                                      {pref}
                                    </Badge>
                                  ))}
                                  {member.preferences && member.preferences.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{member.preferences.length - 2} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingMember(member);
                              }}
                              className="p-2"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No members have joined yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Share the invite link to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invite Link */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Invite Link
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-2">Share this link with friends:</p>
                  <p className="font-mono text-sm break-all bg-white p-2 rounded border">
                    {adventureRequest.inviteLink}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  Anyone with this link can join your adventure group and set up their profile.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Member Profile Edit Dialog */}
      {editingMember && (
        <MemberProfileEditSimple
          member={editingMember}
          isOpen={!!editingMember}
          onClose={() => setEditingMember(null)}
          onSave={handleMemberUpdate}
        />
      )}
    </div>
  );
}
