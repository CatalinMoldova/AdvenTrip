export interface User {
  id: string;
  name: string;
  username?: string;
  email?: string;
  location: string;
  interests: string[];
  avatar?: string;
  bio?: string;
  visitedCountries?: string[]; // ISO country codes
  budget?: number;
  createdAt?: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
}

export interface GroupMember extends Friend {
  budget?: number;
  currency?: string;
  preferences?: string[];
  transportation?: string;
  travelDistance?: number;
  hasProvidedInput?: boolean;
}

export interface Group {
  id: string;
  name: string;
  members: GroupMember[];
  createdAt: string;
}

export interface AdventureRequest {
  id: string;
  userId: string;
  mode: 'individual' | 'group';
  numberOfDays: number;
  startDate?: string;
  endDate?: string;
  activities: string[];
  customActivities: string[];
  budget?: number;
  transportation?: string;
  travelDistance?: number;
  travelDistanceUnit?: 'hours' | 'miles';
  groupMembers?: GroupMember[];
  inviteLink?: string;
  status: 'pending' | 'generating' | 'completed';
  createdAt: string;
}

export interface Adventure {
  id: string;
  title: string;
  destination: string;
  description: string;
  images: string[];
  duration: string;
  price: number;
  activities: string[];
  rating?: number;
  userRating?: number; // Percentage 0-100
  hotel: {
    name: string;
    rating: number;
    pricePerNight: number;
  };
  itinerary: ItineraryDay[];
  groupId?: string;
  requestId?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
  location: {
    lat: number;
    lng: number;
    name: string;
  };
}

export interface SavedAdventure extends Adventure {
  savedAt: string;
  userRating?: number;
}

// Social Features

export interface TripPost {
  id: string;
  userId: string;
  author: {
    id: string;
    name: string;
    username?: string;
    avatar?: string;
  };
  title: string;
  description?: string;
  destination: string;
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
  images: string[];
  duration?: string;
  activities?: string[];
  hotels?: string[];
  restaurants?: string[];
  tags: string[]; // For recommendation algorithm
  rating?: number; // User's rating of the trip (1-5)
  isPublic: boolean;
  isEditable: boolean; // For collaborative posts
  isBucketList: boolean; // Trip they want to take vs. trip they've taken
  createdAt: string;
  updatedAt?: string;
  stats: {
    saves: number;
    reposts: number;
    shares: number;
    views: number;
  };
  repostedFrom?: {
    postId: string;
    userId: string;
    username: string;
  };
}

export interface UserInteraction {
  id: string;
  userId: string;
  postId: string;
  type: 'save' | 'swipe_right' | 'swipe_left' | 'view' | 'share' | 'repost';
  tags: string[]; // Tags from the post at time of interaction
  createdAt: string;
}

export interface AdventureBoard {
  id: string;
  name: string;
  description?: string;
  userId: string;
  coverImage?: string;
  isGroup: boolean;
  members?: GroupMember[];
  tripParameters?: {
    destination?: string;
    duration?: number;
    budget?: number;
    interests?: string[];
    startDate?: string;
    endDate?: string;
  };
  posts: TripPost[];
  status: 'pending_input' | 'active' | 'completed';
  createdAt: string;
  updatedAt?: string;
}

export interface Chat {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  lastMessage?: Message;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'post_share' | 'board_share';
  sharedPost?: TripPost;
  createdAt: string;
}

export interface UserPreferences {
  tagScores: Record<string, number>; // Tag -> score for recommendation algorithm
  lastUpdated: string;
}
