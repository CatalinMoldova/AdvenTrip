# 🎥 Video Feature Implementation Guide

## Overview

I've implemented a **YouTube video integration system** that displays travel videos instead of static images on your adventure cards! This creates a TikTok/Reels-style experience for browsing travel destinations.

## 📁 Files Created

### 1. `services/youtubeService.ts`
YouTube API integration service that:
- Searches for travel videos based on destination
- Fetches video details (duration, views, thumbnails)
- Formats data for display
- Includes fallback for when API is not configured

### 2. `components/VideoPlayer.tsx`
A TikTok/Reels-style video player with:
- Auto-play functionality
- Mute/unmute controls
- Play/pause controls
- Fullscreen support
- View count and duration display
- Auto-hiding controls (like TikTok)

### 3. `components/AdventureVideoCard.tsx`
Enhanced adventure card that:
- Displays YouTube videos OR images
- Toggle between video and image mode
- Supports multiple videos per destination
- Falls back to images if no videos found
- Loading states and error handling

### 4. `YOUTUBE_API_SETUP.md`
Complete guide for setting up YouTube API

## 🚀 Quick Start

### Option 1: With YouTube API (Recommended)

1. **Get YouTube API Key** (5 minutes):
   ```bash
   # Follow the guide in YOUTUBE_API_SETUP.md
   # Or visit: https://console.cloud.google.com/apis/credentials
   ```

2. **Create `.env` file** in project root:
   ```bash
   VITE_YOUTUBE_API_KEY=your_actual_api_key_here
   ```

3. **Restart dev server**:
   ```bash
   npm run dev
   ```

4. **Use the component**:
   ```typescript
   import { AdventureVideoCard } from './components/AdventureVideoCard';

   <AdventureVideoCard
     adventure={adventure}
     onSave={handleSave}
     onPass={handlePass}
     preferVideo={true} // Enable video mode
   />
   ```

### Option 2: Without API (Demo Mode)

The feature works without an API key! It will:
- Show a loading state
- Fall back to images automatically
- You can still toggle the UI

## 🎨 Features

### 1. **Auto-Play Videos**
Videos start playing automatically when the card is displayed (muted by default, like TikTok/Instagram).

### 2. **Smart Search**
Searches YouTube for:
- `{destination} travel vlog 4k`
- Short videos (< 4 minutes)
- High view count (quality content)
- Embeddable videos only

### 3. **Video Controls**
- **Play/Pause**: Tap center button
- **Mute/Unmute**: Bottom right button
- **Fullscreen**: Maximize button
- **Auto-hide**: Controls fade after 3 seconds

### 4. **Multiple Videos**
- Swipe through multiple videos per destination
- Dots indicator shows current video
- Tap dots to jump to specific video

### 5. **Toggle Mode**
- Switch between video and image mode
- Button in top-right corner
- Preserves user preference

### 6. **Fallback System**
```
Try YouTube API → Loading → Success? → Show Videos
                            ↓ Fail
                    Show Images (graceful degradation)
```

## 🔧 Integration Examples

### Example 1: Replace Existing Card

```typescript
// Before (in FeedTab.tsx or similar)
import { AdventureFeedCard } from './components/AdventureFeedCard';

<AdventureFeedCard
  adventure={adventure}
  onSave={handleSave}
  onPass={handlePass}
  // ... other props
/>

// After
import { AdventureVideoCard } from './components/AdventureVideoCard';

<AdventureVideoCard
  adventure={adventure}
  onSave={handleSave}
  onPass={handlePass}
  preferVideo={true}
/>
```

### Example 2: Add Video Player to Existing Component

```typescript
import { VideoPlayer } from './components/VideoPlayer';
import { searchTravelVideos } from './services/youtubeService';

const MyComponent = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const results = await searchTravelVideos('Paris', 5);
      setVideos(results);
    };
    fetchVideos();
  }, []);

  return (
    <div className="h-screen">
      {videos[0] && (
        <VideoPlayer video={videos[0]} autoPlay={true} />
      )}
    </div>
  );
};
```

### Example 3: Standalone Video Search

```typescript
import { searchTravelVideos, formatViewCount, formatDuration } from './services/youtubeService';

const searchDestination = async (destination: string) => {
  const videos = await searchTravelVideos(destination, 10);
  
  videos.forEach(video => {
    console.log(`Title: ${video.title}`);
    console.log(`Views: ${formatViewCount(video.viewCount)}`);
    console.log(`Duration: ${formatDuration(video.duration)}`);
    console.log(`Embed URL: ${video.embedUrl}`);
  });
};
```

## 📊 API Usage & Costs

### Free Tier Limits
- **10,000 units per day**
- Each search: ~100 units
- Each video detail: ~1 unit
- **Estimate**: 50-100 searches per day

### Optimization Tips
1. **Cache results**: Store video IDs in localStorage
2. **Limit searches**: Only search when card is visible
3. **Use curated lists**: Pre-define videos for popular destinations
4. **Implement pagination**: Load more videos on demand

## 🎯 Customization

### Change Video Search Query
```typescript
// In services/youtubeService.ts
const searchQuery = `${destination} travel vlog 4k`; // Current

// Options:
const searchQuery = `${destination} travel guide`;
const searchQuery = `${destination} things to do`;
const searchQuery = `${destination} 2024 travel`;
```

### Adjust Video Duration
```typescript
// In services/youtubeService.ts
videoDuration: 'short', // < 4 minutes (current)
// Options: 'medium' (4-20 min), 'long' (> 20 min), 'any'
```

### Change Auto-Play Behavior
```typescript
// In components/VideoPlayer.tsx
const [isPlaying, setIsPlaying] = useState(autoPlay); // Current
const [isMuted, setIsMuted] = useState(true); // Start muted

// To start unmuted:
const [isMuted, setIsMuted] = useState(false);
```

### Style the Video Player
```typescript
// In components/VideoPlayer.tsx
// All Tailwind classes can be customized:
className="w-16 h-16 rounded-full bg-black/50" // Play button
className="absolute top-0 left-0 right-0 p-4" // Top info
className="text-white font-semibold text-sm" // Title
```

## 🐛 Troubleshooting

### Videos Not Loading?
1. Check API key is set correctly in `.env`
2. Check browser console for errors
3. Verify API key has YouTube Data API v3 enabled
4. Check API quota in Google Cloud Console

### Videos Not Auto-Playing?
- Some browsers block auto-play with sound
- Videos start muted by default (browser requirement)
- User must interact with page first (tap anywhere)

### "EPERM" Error When Installing?
```bash
# Run with elevated permissions:
npm install axios --legacy-peer-deps
```

### API Quota Exceeded?
- Wait 24 hours for quota reset
- Implement caching to reduce API calls
- Use curated videos for popular destinations

## 🚀 Next Steps

### Phase 1: Basic Implementation ✅
- [x] YouTube API integration
- [x] Video player component
- [x] Adventure card with videos
- [x] Fallback to images

### Phase 2: Enhancements (Optional)
- [ ] Cache video results in localStorage
- [ ] Add video quality selector
- [ ] Implement video preloading
- [ ] Add video sharing functionality
- [ ] Show related videos

### Phase 3: Advanced Features (Future)
- [ ] TikTok API integration (requires business account)
- [ ] Instagram Reels API (requires Facebook app)
- [ ] User-generated content uploads
- [ ] Video recommendations based on preferences
- [ ] Video playlists for itineraries

## 📱 Mobile Optimization

The video player is fully responsive and optimized for mobile:
- Touch controls
- Swipe gestures
- Fullscreen support
- Low data mode (coming soon)
- Offline caching (coming soon)

## 🎓 Learning Resources

- [YouTube Data API Docs](https://developers.google.com/youtube/v3)
- [YouTube Player API](https://developers.google.com/youtube/iframe_api_reference)
- [React Video Best Practices](https://web.dev/media/)

## 💡 Pro Tips

1. **For Hackathons**: Pre-load curated videos to avoid API setup during demo
2. **For Production**: Implement server-side caching to reduce API costs
3. **For UX**: Add loading skeletons instead of blank screens
4. **For Performance**: Lazy load videos only when card is in viewport

## 🤝 Need Help?

If you need help implementing or customizing this feature, just ask! I can:
- Help integrate into specific components
- Add more video sources (TikTok, Instagram, etc.)
- Optimize performance
- Add custom features

---

**Happy coding! 🎥✨**

