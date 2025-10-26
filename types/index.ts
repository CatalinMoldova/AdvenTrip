export interface User {
  id: string;
  name: string;
  location: string;
  interests: string[];
  avatar?: string;
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
