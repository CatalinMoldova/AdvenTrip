import axios from 'axios';

// YouTube Data API v3
// Get your free API key from: https://console.cloud.google.com/apis/credentials
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || 'YOUR_API_KEY_HERE';
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  duration: string;
  viewCount: string;
  embedUrl: string;
}

/**
 * Search for travel videos based on destination
 * @param destination - The travel destination to search for
 * @param maxResults - Maximum number of results to return (default: 5)
 * @returns Array of YouTube videos
 */
export const searchTravelVideos = async (
  destination: string,
  maxResults: number = 5
): Promise<YouTubeVideo[]> => {
  try {
    // If no API key, return empty array (will fall back to images)
    if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'YOUR_API_KEY_HERE') {
      console.warn('YouTube API key not configured. Using fallback images.');
      return [];
    }

    // Search for videos
    const searchQuery = `${destination} travel vlog 4k`;
    const searchResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
      params: {
        key: YOUTUBE_API_KEY,
        part: 'snippet',
        q: searchQuery,
        type: 'video',
        maxResults,
        videoEmbeddable: 'true',
        videoDuration: 'short', // Short videos (< 4 minutes) for better UX
        order: 'viewCount', // Most viewed first
        relevanceLanguage: 'en',
      },
    });

    const videoIds = searchResponse.data.items
      .map((item: any) => item.id.videoId)
      .join(',');

    // Get video details (duration, views, etc.)
    const detailsResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
      params: {
        key: YOUTUBE_API_KEY,
        part: 'contentDetails,statistics',
        id: videoIds,
      },
    });

    // Combine search results with details
    const videos: YouTubeVideo[] = searchResponse.data.items.map((item: any, index: number) => {
      const details = detailsResponse.data.items[index];
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        duration: details?.contentDetails?.duration || 'PT0S',
        viewCount: details?.statistics?.viewCount || '0',
        embedUrl: `https://www.youtube.com/embed/${item.id.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${item.id.videoId}`,
      };
    });

    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
};

/**
 * Format YouTube duration (PT1M30S) to readable format (1:30)
 */
export const formatDuration = (duration: string): string => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';

  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '0').replace('S', '').padStart(2, '0');

  if (hours) {
    return `${hours}:${minutes.padStart(2, '0')}:${seconds}`;
  }
  return `${minutes || '0'}:${seconds}`;
};

/**
 * Format view count to readable format (1.2M, 500K, etc.)
 */
export const formatViewCount = (count: string): string => {
  const num = parseInt(count);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M views`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K views`;
  }
  return `${num} views`;
};

/**
 * Get curated travel videos for popular destinations
 * This is a fallback when API is not available or for demo purposes
 */
export const getCuratedVideos = (destination: string): YouTubeVideo[] => {
  const curatedVideos: Record<string, YouTubeVideo[]> = {
    'Paris': [
      {
        id: 'dQw4w9WgXcQ',
        title: 'Paris Travel Guide - Top Things to Do',
        thumbnail: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
        channelTitle: 'Travel Channel',
        duration: 'PT3M45S',
        viewCount: '1500000',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1',
      },
    ],
    'Tokyo': [
      {
        id: 'dQw4w9WgXcQ',
        title: 'Tokyo Travel Vlog - Amazing Experience',
        thumbnail: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
        channelTitle: 'Travel Vlogger',
        duration: 'PT4M20S',
        viewCount: '2000000',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1',
      },
    ],
    'New York': [
      {
        id: 'dQw4w9WgXcQ',
        title: 'New York City - Ultimate Travel Guide',
        thumbnail: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
        channelTitle: 'NYC Explorer',
        duration: 'PT5M10S',
        viewCount: '3500000',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1',
      },
    ],
  };

  return curatedVideos[destination] || [];
};

