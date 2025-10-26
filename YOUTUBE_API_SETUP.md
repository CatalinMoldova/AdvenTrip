# YouTube API Setup Guide

## 🎥 Getting Your YouTube API Key

Follow these steps to get a free YouTube Data API v3 key:

### Step 1: Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### Step 2: Create a New Project
1. Click on the project dropdown at the top
2. Click "New Project"
3. Name it "AdvenTrip" or any name you prefer
4. Click "Create"

### Step 3: Enable YouTube Data API v3
1. Go to "APIs & Services" > "Library"
2. Search for "YouTube Data API v3"
3. Click on it
4. Click "Enable"

### Step 4: Create API Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key

### Step 5: Add to Your Project
Create a `.env` file in the project root:

```bash
VITE_YOUTUBE_API_KEY=your_api_key_here
```

### Step 6: Restart Dev Server
```bash
npm run dev
```

## 📊 API Quotas

- **Free Tier:** 10,000 units per day
- **Search request:** 100 units
- **Video details:** 1 unit
- **Estimated:** ~50-100 searches per day on free tier

## 🔒 Security Best Practices

1. **Never commit `.env` file** to git (already in `.gitignore`)
2. **Restrict API key** in Google Cloud Console:
   - Go to Credentials
   - Click on your API key
   - Under "API restrictions", select "Restrict key"
   - Choose "YouTube Data API v3"
   - Under "Application restrictions", add your domain

3. **For production**, use environment variables on your hosting platform:
   - Vercel: Add in Project Settings > Environment Variables
   - Netlify: Add in Site Settings > Environment Variables

## 🎬 How It Works

1. When a user views an adventure, the app searches YouTube for travel videos
2. Search query: `{destination} travel vlog 4k`
3. Filters: Short videos (< 4 min), embeddable, high view count
4. Videos auto-play in a TikTok/Reels style vertical format
5. Falls back to images if no videos found or API not configured

## 🚀 Alternative: Use Curated Videos

If you don't want to set up the API right now, the app will use curated placeholder videos. You can manually add video IDs in `services/youtubeService.ts` in the `getCuratedVideos` function.

## 💡 Tips

- Use short, engaging travel vlogs (< 4 minutes)
- Filter by view count for quality content
- Consider caching video results to save API quota
- Implement pagination for more video options

