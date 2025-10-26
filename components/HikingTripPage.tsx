import React from 'react';
import { HikingTripGenerator } from './HikingTripGenerator';

export const HikingTripPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-green-800">Find Hiking Trails</h1>
          <p className="text-sm text-green-600 mt-1">
            Discover amazing hiking trails near any location
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <HikingTripGenerator />
      </div>

      {/* Info Card */}
      <div className="max-w-2xl mx-auto px-4 mt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            🏔️ How it works
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>1. Enter your location (city or area)</li>
            <li>2. Adjust search radius (10-200 miles)</li>
            <li>3. Get real-time hiking trail suggestions</li>
            <li>4. View trail details: difficulty, length, elevation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
