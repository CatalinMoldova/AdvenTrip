/**
 * User data types
 * These types are designed to be easily integrated with backend/auth systems
 */

export interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  bio?: string;
  location?: string;
  profilePicture?: string;
  followersCount: number;
  followingCount: number;
  travelPreferences: string[];
}

// Available travel activity preferences
export const TRAVEL_PREFERENCES = [
  'Adventure',
  'Beach',
  'City Tours',
  'Cuisine',
  'Culture',
  'Hiking',
  'History',
  'Luxury',
  'Nature',
  'Nightlife',
  'Photography',
  'Road Trips',
  'Shopping',
  'Wildlife',
] as const;

export type TravelPreference = typeof TRAVEL_PREFERENCES[number];

// Mock user data - can be easily replaced with API calls
export const MOCK_USER: UserProfile = {
  id: '1',
  username: 'adventurer_jane',
  firstName: 'Jane',
  lastName: 'Doe',
  bio: 'Travel enthusiast exploring the world one adventure at a time ✈️',
  location: 'San Francisco, CA',
  profilePicture: undefined, // Will use placeholder
  followersCount: 1247,
  followingCount: 432,
  travelPreferences: ['Adventure', 'Nature', 'Photography', 'Culture'],
};

