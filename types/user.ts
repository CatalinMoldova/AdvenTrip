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
  "🧗‍♂️ Adventure Travel",
  "🐾 Animal Lover",
  "🎨 Art & Culture",
  "🎒 Backpacking",
  "🏖️ Beach Bum",
  "🚴‍♀️ Biking",
  "💸 Budget Travel",
  "🏕️ Camping",
  "🛋️ Couch Surfing",
  "🛳️ Cruise Trips",
  "💻 Digital Nomad",
  "🌱 Eco-Travel",
  "🛍️ Fashion & Shopping",
  "🎢 Spontaneous Adventures",
  "🥾 Hiking",
  "🍣 Foodie",
  "🏠 Hostel",
  "🚆 Interrail",
  "🏝️ Island Hopping",
  "🎤 Karaoke",
  "🌍 Living Abroad",
  "🏘️ Local Experiences",
  "🏨 Luxury Stays",
  "🏛️ Museums",
  "🎶 Music Festivals",
  "🌲 National Parks",
  "🌃 Nightlife",
  "🍃 Nature Trails",
  "⛺ Off-Grid Spots",
  "🚗 Road Trip",
  "🧗 Rock Climbing",
  "⛵ Sailing",
  "🤿 Scuba",
  "🐢 Slow Travel",
  "🎿 Snow & Ski Trips",
  "🧍‍♀️ Solo Travel",
  "💆‍♀️ Spa Days",
  "🕉️ Spiritual",
  "⚽ Sports",
  "🎯 Spontaneous Trips",
  "🎓 Study Abroad",
  "🏄‍♂️ Surfing",
  "🌴 Tropical",
  "🧥 Thrift Shopping",
  "🚐 Van Life",
  "🥦 Vegan",
  "🤝 Volunteer",
  "🧘‍♀️ Wellness & Retreats",
  "🧘 Yoga"
] as const;


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

