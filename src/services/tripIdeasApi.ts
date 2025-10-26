export interface TripIdea {
  id: string;
  activity: string;
  destination: string;
  reason: string;
  estimatedPrice: number;
  bestSeason: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  images?: string[];
  bookingUrl?: string;
  dataSource?: 'real-time' | 'curated';
}

export interface TripIdeasParams {
  interests: string[];
  useRealTimeData?: boolean;
}

export interface TripIdeasResponse {
  success: boolean;
  ideas: TripIdea[];
  count: number;
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

export async function getTripIdeas(params: TripIdeasParams): Promise<TripIdeasResponse> {
  const response = await fetch(`${API_BASE_URL}/api/trip-ideas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch trip ideas');
  }

  return response.json();
}
