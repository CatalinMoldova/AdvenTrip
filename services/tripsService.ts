import { supabase } from "../lib/supabase";

// Database schema interface (matches adventures table)
export interface Adventure {
  id: number;
  created_at: string;
  owner_id: string;
  title: string;
  starting_location: string;
  preferences: string[]; // JSONB array
  period: string;
  type: string;
  trip_duration: number;
  area_of_trip?: string | null;
  random_location?: string | null;
  distance_from_location?: number | null;
  adventure_link: string;
  trip_budget?: number | null;
  budget_currency?: string | null;
  itinerary?: any | null; // JSONB
}

// Trip interface for app usage (normalized from Adventure)
export interface Trip {
  id: string;
  user_id: string;
  name: string;
  starting_location: string;
  activities: string[];
  time_period: string;
  transportation: string;
  days: number;
  destination_type: 'specific' | 'random' | 'distance';
  destination_area?: string;
  max_distance_miles?: number;
  budget?: number;
  share_link: string;
  created_at: string;
  updated_at?: string;
}

export interface TripMember {
  id: string;
  trip_id: string;
  user_id: string;
  joined_at: string;
  users?: {
    id: string;
    name?: string;
    email?: string;
  };
}

interface TripsResponse {
  success: boolean;
  msg?: string;
  data?: Trip[];
}

interface TripResponse {
  success: boolean;
  msg?: string;
  data?: Trip;
}

interface TripMembersResponse {
  success: boolean;
  msg?: string;
  data?: TripMember[];
}

// Helper function to convert Adventure to Trip
const adventureToTrip = (adventure: Adventure): Trip => {
  // Determine destination_type based on which field is populated
  let destination_type: 'specific' | 'random' | 'distance' = 'specific';
  if (adventure.random_location) {
    destination_type = 'random';
  } else if (adventure.distance_from_location) {
    destination_type = 'distance';
  } else if (adventure.area_of_trip) {
    destination_type = 'specific';
  }

  return {
    id: String(adventure.id),
    user_id: adventure.owner_id,
    name: adventure.title,
    starting_location: adventure.starting_location,
    activities: Array.isArray(adventure.preferences) ? adventure.preferences : [],
    time_period: adventure.period,
    transportation: adventure.type,
    days: adventure.trip_duration,
    destination_type,
    destination_area: adventure.area_of_trip || undefined,
    max_distance_miles: adventure.distance_from_location || undefined,
    budget: adventure.trip_budget || undefined,
    share_link: adventure.adventure_link,
    created_at: adventure.created_at,
  };
};

// Generate a unique shareable link
const generateShareLink = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Create a new trip
export const createTrip = async (
  userId: string,
  tripData: {
    name: string;
    starting_location: string;
    activities: string[];
    time_period: string;
    transportation: 'Road trip' | 'City to city' | 'Stay in the same city';
    days: number;
    destination_type: 'specific' | 'random' | 'distance';
    destination_area?: string;
    max_distance_miles?: number;
  }
): Promise<TripResponse> => {
  try {
    const shareLink = generateShareLink();
    
    // Map trip data to adventures table schema
    const adventureData: any = {
      owner_id: userId,
      title: tripData.name,
      starting_location: tripData.starting_location,
      preferences: tripData.activities, // JSONB array
      period: tripData.time_period,
      type: tripData.transportation,
      trip_duration: tripData.days,
      adventure_link: shareLink,
      budget_currency: 'USD', // Default currency
    };

    // Set destination fields based on destination_type
    if (tripData.destination_type === 'specific') {
      adventureData.area_of_trip = tripData.destination_area || null;
      adventureData.random_location = null;
      adventureData.distance_from_location = null;
    } else if (tripData.destination_type === 'random') {
      adventureData.random_location = 'random'; // You can set this to any value or null
      adventureData.area_of_trip = null;
      adventureData.distance_from_location = null;
    } else if (tripData.destination_type === 'distance') {
      adventureData.distance_from_location = tripData.max_distance_miles || null;
      adventureData.area_of_trip = null;
      adventureData.random_location = null;
    }

    const { data, error } = await supabase
      .from("adventures")
      .insert(adventureData)
      .select()
      .single();

    if (error) {
      return { success: false, msg: error.message };
    }

    // Convert Adventure to Trip format
    const trip = adventureToTrip(data as Adventure);
    return { success: true, data: trip };
  } catch (error) {
    console.log('Error creating trip:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, msg: errorMessage };
  }
};

// Get all trips for a user
export const getUserTrips = async (userId: string): Promise<TripsResponse> => {
  try {
    const { data, error } = await supabase
      .from("adventures")
      .select("*")
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, msg: error.message };
    }

    // Convert Adventures to Trips
    const trips = (data || []).map(adventure => adventureToTrip(adventure as Adventure));
    return { success: true, data: trips };
  } catch (error) {
    console.log('Error fetching trips:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, msg: errorMessage };
  }
};

// Get a single trip by ID
export const getTripById = async (tripId: string): Promise<TripResponse> => {
  try {
    const { data, error } = await supabase
      .from("adventures")
      .select("*")
      .eq('id', parseInt(tripId, 10))
      .single();

    if (error) {
      return { success: false, msg: error.message };
    }

    // Convert Adventure to Trip
    const trip = adventureToTrip(data as Adventure);
    return { success: true, data: trip };
  } catch (error) {
    console.log('Error fetching trip:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, msg: errorMessage };
  }
};

// Get trip by share link
export const getTripByShareLink = async (shareLink: string): Promise<TripResponse> => {
  try {
    const { data, error } = await supabase
      .from("adventures")
      .select("*")
      .eq('adventure_link', shareLink)
      .single();

    if (error) {
      return { success: false, msg: error.message };
    }

    // Convert Adventure to Trip
    const trip = adventureToTrip(data as Adventure);
    return { success: true, data: trip };
  } catch (error) {
    console.log('Error fetching trip by share link:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, msg: errorMessage };
  }
};

// Update trip budget
export const updateTripBudget = async (
  tripId: string,
  budget: number
): Promise<TripResponse> => {
  try {
    const { data, error } = await supabase
      .from("adventures")
      .update({ trip_budget: budget })
      .eq('id', parseInt(tripId, 10))
      .select()
      .single();

    if (error) {
      return { success: false, msg: error.message };
    }

    // Convert Adventure to Trip
    const trip = adventureToTrip(data as Adventure);
    return { success: true, data: trip };
  } catch (error) {
    console.log('Error updating trip budget:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, msg: errorMessage };
  }
};

// Join a trip via share link
export const joinTripByShareLink = async (
  userId: string,
  shareLink: string
): Promise<TripResponse> => {
  try {
    // First, get the trip by share link
    const tripResult = await getTripByShareLink(shareLink);
    if (!tripResult.success || !tripResult.data) {
      return { success: false, msg: 'Trip not found' };
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from("trip_members")
      .select("*")
      .eq('trip_id', tripResult.data.id)
      .eq('user_id', userId)
      .single();

    if (existingMember) {
      // User is already a member, just return the trip
      return { success: true, data: tripResult.data };
    }

    // Add user as a member
    const { error: memberError } = await supabase
      .from("trip_members")
      .insert({
        trip_id: tripResult.data.id,
        user_id: userId,
      });

    if (memberError) {
      return { success: false, msg: memberError.message };
    }

    return { success: true, data: tripResult.data };
  } catch (error) {
    console.log('Error joining trip:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, msg: errorMessage };
  }
};

// Get trip members
export const getTripMembers = async (tripId: string): Promise<TripMembersResponse> => {
  try {
    const { data, error } = await supabase
      .from("trip_members")
      .select(`
        *,
        users (
          id,
          name,
          email
        )
      `)
      .eq('trip_id', tripId)
      .order('joined_at', { ascending: true });

    if (error) {
      return { success: false, msg: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.log('Error fetching trip members:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, msg: errorMessage };
  }
};

// Delete a trip
export const deleteTrip = async (tripId: string): Promise<{ success: boolean; msg?: string }> => {
  try {
    // First, delete all trip members
    const { error: membersError } = await supabase
      .from("trip_members")
      .delete()
      .eq('trip_id', tripId);

    if (membersError) {
      console.log('Error deleting trip members:', membersError);
      // Continue with trip deletion even if members deletion fails
    }

    // Then delete the trip itself
    const { error: tripError } = await supabase
      .from("adventures")
      .delete()
      .eq('id', parseInt(tripId, 10));

    if (tripError) {
      return { success: false, msg: tripError.message };
    }

    return { success: true };
  } catch (error) {
    console.log('Error deleting trip:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, msg: errorMessage };
  }
};
