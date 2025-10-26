/**
 * INTEGRATION EXAMPLE
 * 
 * This file shows how to integrate the video feature into your existing app.
 * Copy the relevant parts into your actual components.
 */

import React from 'react';
import { AdventureVideoCard } from './components/AdventureVideoCard';
import { Adventure } from './types';

// ============================================
// EXAMPLE 1: Replace existing adventure cards
// ============================================

// In your FeedTab.tsx or wherever you display adventures:
export const FeedTabWithVideos = () => {
  const adventures: Adventure[] = []; // Your adventures data
  
  const handleSave = (adventure: Adventure) => {
    console.log('Saved:', adventure);
    // Your save logic
  };

  const handlePass = (adventure: Adventure) => {
    console.log('Passed:', adventure);
    // Your pass logic
  };

  return (
    <div className="space-y-4">
      {adventures.map((adventure) => (
        <AdventureVideoCard
          key={adventure.id}
          adventure={adventure}
          onSave={() => handleSave(adventure)}
          onPass={() => handlePass(adventure)}
          preferVideo={true} // Enable video mode
        />
      ))}
    </div>
  );
};

// ============================================
// EXAMPLE 2: Add video toggle to existing component
// ============================================

import { useState, useEffect } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { searchTravelVideos, YouTubeVideo } from './services/youtubeService';

export const AdventureCardWithVideoToggle = ({ adventure }: { adventure: Adventure }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      const results = await searchTravelVideos(adventure.destination, 3);
      setVideos(results);
      setLoading(false);
    };

    if (showVideo && videos.length === 0) {
      fetchVideos();
    }
  }, [showVideo, adventure.destination]);

  return (
    <div className="relative w-full h-[600px]">
      {/* Toggle button */}
      <button
        onClick={() => setShowVideo(!showVideo)}
        className="absolute top-4 right-4 z-10 px-4 py-2 bg-black/50 text-white rounded-lg"
      >
        {showVideo ? 'Show Images' : 'Show Videos'}
      </button>

      {/* Content */}
      {showVideo && videos.length > 0 ? (
        <VideoPlayer video={videos[0]} autoPlay={true} />
      ) : (
        <img
          src={adventure.images[0]}
          alt={adventure.title}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

// ============================================
// EXAMPLE 3: Video-first with image fallback
// ============================================

export const VideoFirstCard = ({ adventure }: { adventure: Adventure }) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [hasVideos, setHasVideos] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      const results = await searchTravelVideos(adventure.destination);
      if (results.length > 0) {
        setVideos(results);
        setHasVideos(true);
      }
    };
    fetchVideos();
  }, [adventure.destination]);

  return (
    <div className="w-full h-[600px]">
      {hasVideos ? (
        <VideoPlayer video={videos[0]} autoPlay={true} />
      ) : (
        <img
          src={adventure.images[0]}
          alt={adventure.title}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

// ============================================
// EXAMPLE 4: Swipeable video cards (TikTok style)
// ============================================

export const SwipeableVideoFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const adventures: Adventure[] = []; // Your data

  const handleSwipeUp = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, adventures.length - 1));
  };

  const handleSwipeDown = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="h-screen overflow-hidden">
      <AdventureVideoCard
        adventure={adventures[currentIndex]}
        onSave={() => console.log('Saved')}
        onPass={handleSwipeUp}
        preferVideo={true}
      />
      
      {/* Swipe indicators */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2">
        {adventures.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full ${
              idx === currentIndex ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================
// EXAMPLE 5: Manual video search
// ============================================

export const ManualVideoSearch = () => {
  const [destination, setDestination] = useState('');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);

  const handleSearch = async () => {
    const results = await searchTravelVideos(destination, 10);
    setVideos(results);
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter destination..."
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg"
        >
          Search Videos
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="h-64">
            <VideoPlayer video={video} autoPlay={false} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// SETUP INSTRUCTIONS
// ============================================

/*
1. Get YouTube API Key:
   - Visit: https://console.cloud.google.com/apis/credentials
   - Create project
   - Enable YouTube Data API v3
   - Create API key

2. Create .env file:
   VITE_YOUTUBE_API_KEY=your_api_key_here

3. Restart dev server:
   npm run dev

4. Use any of the examples above in your components!

For detailed instructions, see:
- YOUTUBE_API_SETUP.md
- VIDEO_FEATURE_GUIDE.md
*/

