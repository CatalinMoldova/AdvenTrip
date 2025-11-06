import ENV from '@/config/env';

const UNSPLASH_API_URL = 'https://api.unsplash.com';

/**
 * Search for photos on Unsplash based on a query
 */
export async function searchUnsplashPhotos(query: string, perPage: number = 1) {
  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=portrait`,
      {
        headers: {
          'Authorization': `Client-ID ${ENV.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching from Unsplash:', error);
    return [];
  }
}

/**
 * Get a random photo from Unsplash based on a query
 */
export async function getRandomUnsplashPhoto(query: string) {
  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/photos/random?query=${encodeURIComponent(query)}&orientation=portrait`,
      {
        headers: {
          'Authorization': `Client-ID ${ENV.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching random photo from Unsplash:', error);
    return null;
  }
}

/**
 * Get optimized image URL from Unsplash photo
 */
export function getOptimizedImageUrl(photo: any, width: number = 800, height: number = 1200) {
  if (!photo || !photo.urls) return null;
  
  // Use Unsplash's dynamic image URLs for optimization
  return `${photo.urls.raw}&w=${width}&h=${height}&fit=crop&q=80`;
}

