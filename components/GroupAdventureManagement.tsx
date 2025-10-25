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

interface GroupAdventureManagementProps {
  adventureRequest: AdventureRequest;
  currentUser: any;
  onBack: () => void;
  onShareLink: (link: string) => void;
}

export function GroupAdventureManagement({ 
  adventureRequest, 
  currentUser, 
  onBack,
  onShareLink 
}: GroupAdventureManagementProps) {
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);

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
                  <p className="font-semibold">{adventureRequest.numberOfDays} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Activities</p>
                  <p className="font-semibold">{adventureRequest.activities.length} selected</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-semibold">{formatDate(adventureRequest.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Group Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Group Members ({adventureRequest.groupMembers?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {adventureRequest.groupMembers && adventureRequest.groupMembers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {adventureRequest.groupMembers.map((member) => (
                    <motion.div
                      key={member.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedMember(member)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
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
                                Budget: ${member.budget?.toLocaleString() || 'Not set'}
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
    </div>
  );
}
