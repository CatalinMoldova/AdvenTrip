import { useState } from 'react';
import { Adventure, User } from '../types';
import { AdventureCard } from './AdventureCard';
import { AdventureDetailView } from './AdventureDetailView';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Users, Search, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

interface FeedScreenProps {
  adventures: Adventure[];
  user: User;
  onCreateGroup: () => void;
  onViewSaved: () => void;
}

export function FeedScreen({ adventures, user, onCreateGroup, onViewSaved }: FeedScreenProps) {
  const [selectedAdventure, setSelectedAdventure] = useState<Adventure | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActivity, setFilterActivity] = useState<string>('all');

  const handleRate = (adventureId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [adventureId]: rating }));
    toast.success(`Rated ${rating} stars! We'll tailor your recommendations.`);
  };

  const handleSave = () => {
    toast.success('Adventure saved! View it in your saved adventures.');
    setSelectedAdventure(null);
  };

  // Filter adventures
  const filteredAdventures = adventures.filter(adventure => {
    const matchesSearch = adventure.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         adventure.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActivity = filterActivity === 'all' || adventure.activities.includes(filterActivity);
    return matchesSearch && matchesActivity;
  });

  // Get unique activities for filter
  const allActivities = Array.from(new Set(adventures.flatMap(a => a.activities)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-green-100/80 backdrop-blur-lg border-b border-green-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white">✨</span>
                </div>
                <h1 className="text-green-800 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">AdvenTrip</h1>
              </div>
              <p className="text-green-700 text-sm">
                Hey {user.name}! Discover amazing adventures from {user.location}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onViewSaved} className="border-green-200 hover:bg-green-50 text-green-700">
                View Saved
              </Button>
              <Button onClick={onCreateGroup} className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md">
                <Users className="w-4 h-4" />
                Create Group
              </Button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
              <Input
                placeholder="Search destinations, activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-green-50 border-green-200"
              />
            </div>
            <Select value={filterActivity} onValueChange={setFilterActivity}>
              <SelectTrigger className="w-48 bg-green-50 border-green-200">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                {allActivities.map(activity => (
                  <SelectItem key={activity} value={activity}>
                    {activity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredAdventures.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-green-600">No adventures found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdventures.map((adventure) => (
              <AdventureCard
                key={adventure.id}
                adventure={adventure}
                onRate={(rating) => handleRate(adventure.id, rating)}
                onClick={() => setSelectedAdventure(adventure)}
                userRating={ratings[adventure.id]}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail View */}
      {selectedAdventure && (
        <AdventureDetailView
          adventure={selectedAdventure}
          onClose={() => setSelectedAdventure(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
