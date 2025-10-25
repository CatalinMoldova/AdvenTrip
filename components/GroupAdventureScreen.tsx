import { useState } from 'react';
import { Group, GroupMember, Friend } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { X, Users, Plus, DollarSign, Heart, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface GroupAdventureScreenProps {
  friends: Friend[];
  existingGroups: Group[];
  onBack: () => void;
  onCreateGroup: (group: Group) => void;
}

export function GroupAdventureScreen({ friends, existingGroups, onBack, onCreateGroup }: GroupAdventureScreenProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<GroupMember[]>([]);
  const [memberBudgets, setMemberBudgets] = useState<Record<string, number>>({});
  const [memberPreferences, setMemberPreferences] = useState<Record<string, string[]>>({});

  const popularActivities = ['Beach', 'Hiking', 'Culture', 'Food', 'Adventure', 'Wildlife'];

  const toggleMember = (friend: Friend) => {
    if (selectedMembers.find(m => m.id === friend.id)) {
      setSelectedMembers(prev => prev.filter(m => m.id !== friend.id));
      const { [friend.id]: _, ...rest } = memberBudgets;
      setMemberBudgets(rest);
    } else {
      setSelectedMembers(prev => [...prev, { ...friend, budget: 3000, preferences: [] }]);
    }
  };

  const updateMemberBudget = (memberId: string, budget: number) => {
    setMemberBudgets(prev => ({ ...prev, [memberId]: budget }));
  };

  const toggleMemberPreference = (memberId: string, activity: string) => {
    setMemberPreferences(prev => {
      const current = prev[memberId] || [];
      return {
        ...prev,
        [memberId]: current.includes(activity)
          ? current.filter(a => a !== activity)
          : [...current, activity]
      };
    });
  };

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedMembers.length > 0) {
      const membersWithDetails = selectedMembers.map(member => ({
        ...member,
        budget: memberBudgets[member.id] || 3000,
        preferences: memberPreferences[member.id] || [],
      }));

      const newGroup: Group = {
        id: Date.now().toString(),
        name: groupName.trim(),
        members: membersWithDetails,
        createdAt: new Date().toISOString().split('T')[0],
      };

      onCreateGroup(newGroup);
      toast.success(`Group "${groupName}" created! Finding adventures for your squad...`);
      setShowCreateDialog(false);
      setGroupName('');
      setSelectedMembers([]);
      setMemberBudgets({});
      setMemberPreferences({});
    }
  };

  const calculateGroupRecommendation = (group: Group) => {
    const minBudget = Math.min(...group.members.map(m => m.budget || 3000));
    const allPreferences = group.members.flatMap(m => m.preferences || []);
    const topPreference = allPreferences.reduce((acc, pref) => {
      acc[pref] = (acc[pref] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostPopular = Object.entries(topPreference).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Adventure';
    
    return { minBudget, topPreference: mostPopular };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-purple-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Feed
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Group Adventures</h1>
              <p className="text-gray-600 text-sm">
                Create groups and get recommendations that suit everyone ✨
              </p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md">
              <Plus className="w-4 h-4" />
              Create New Group
            </Button>
          </div>
        </div>
      </div>

      {/* Groups List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {existingGroups.length === 0 ? (
          <Card className="p-12 text-center bg-gradient-to-br from-white via-purple-50 to-pink-50 border-2 border-purple-100">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-gray-900 mb-2">No Groups Yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first group to get personalized recommendations for your squad ✨
            </p>
            <Button onClick={() => setShowCreateDialog(true)} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg">
              Create Your First Group
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {existingGroups.map((group) => {
              const recommendation = calculateGroupRecommendation(group);
              return (
                <Card key={group.id} className="p-6 bg-white/90 backdrop-blur-sm border-purple-100 hover:shadow-xl hover:shadow-purple-100 transition-all hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-gray-900 mb-1">{group.name}</h3>
                      <p className="text-sm text-gray-600">
                        Created {new Date(group.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500">{group.members.length} members</Badge>
                  </div>

                  {/* Members */}
                  <div className="space-y-3 mb-4">
                    {group.members.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-purple-50 rounded-xl border border-purple-100">
                        <span className="text-2xl">{member.avatar}</span>
                        <div className="flex-1">
                          <div className="text-sm text-gray-900">{member.name}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>Budget: ${member.budget}</span>
                            {member.preferences && member.preferences.length > 0 && (
                              <>
                                <span>•</span>
                                <span>{member.preferences.slice(0, 2).join(', ')}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Group Recommendation */}
                  <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-gray-900">Smart Recommendation</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        Max budget: ${recommendation.minBudget} (lowest member budget)
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Top interest:</span>
                        <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500">{recommendation.topPreference}</Badge>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md">
                    Find Adventures for This Group
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Group Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Group Adventure</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Group Name */}
            <div>
              <Label htmlFor="group-name">Group Name</Label>
              <Input
                id="group-name"
                placeholder="e.g., Summer Squad, Adventure Buddies..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            {/* Select Members */}
            <div>
              <Label>Add Friends to Group</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {friends.map((friend) => {
                  const isSelected = selectedMembers.find(m => m.id === friend.id);
                  return (
                    <Card
                      key={friend.id}
                      className={`p-3 cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => toggleMember(friend)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{friend.avatar}</span>
                        <span className="text-sm text-gray-900">{friend.name}</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Member Details */}
            {selectedMembers.length > 0 && (
              <div className="space-y-4">
                <Label>Set Member Preferences</Label>
                {selectedMembers.map((member) => (
                  <Card key={member.id} className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{member.avatar}</span>
                      <span className="text-gray-900">{member.name}</span>
                    </div>

                    <div>
                      <Label htmlFor={`budget-${member.id}`} className="text-sm">
                        Budget
                      </Label>
                      <Input
                        id={`budget-${member.id}`}
                        type="number"
                        placeholder="3000"
                        value={memberBudgets[member.id] || ''}
                        onChange={(e) => updateMemberBudget(member.id, parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label className="text-sm">Interests</Label>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {popularActivities.map((activity) => (
                          <Badge
                            key={activity}
                            variant={(memberPreferences[member.id] || []).includes(activity) ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => toggleMemberPreference(member.id, activity)}
                          >
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={handleCreateGroup}
                disabled={!groupName.trim() || selectedMembers.length === 0}
                className="flex-1"
              >
                Create Group
              </Button>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
