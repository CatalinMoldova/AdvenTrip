import React from 'react';
import { TripIdeasGenerator } from './TripIdeasGenerator';
import { TripIdea } from '../src/services/tripIdeasApi';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

export const TripIdeasPage: React.FC = () => {
  const handleSelectIdea = (idea: TripIdea) => {
    console.log('Selected trip idea:', idea);
    // You can navigate to create adventure with this idea
    alert(`Selected: ${idea.activity} in ${idea.destination}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-green-800">Trip Ideas</h1>
          <p className="text-sm text-green-600 mt-1">
            Discover personalized travel destinations based on your interests
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <TripIdeasGenerator onSelect={handleSelectIdea} />
      </div>

      {/* Info Card */}
      <div className="max-w-2xl mx-auto px-4 mt-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              💡 How it works
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>1. Add your interests (e.g., "Diving", "Surfing")</li>
              <li>2. Click "Generate Trip Ideas"</li>
              <li>3. Get real-time suggestions with pricing and images</li>
              <li>4. Click any idea to learn more</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
