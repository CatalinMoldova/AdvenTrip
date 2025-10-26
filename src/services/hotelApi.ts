/**
 * Hotel Search API Service
 * Integrates with backend API to search for hotels using Bright Data
 */

export interface Hotel {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  pricePerNight: number;
  currency: string;
  address: string;
  amenities: string[];
  bookingUrl: string;
  distance?: string;
}

export interface HotelSearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests?: number;
}

export interface HotelSearchResponse {
  success: boolean;
  hotels: Hotel[];
  count: number;
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

/**
 * Search for hotels using Bright Data API
 */
export async function searchHotels(params: HotelSearchParams): Promise<HotelSearchResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/hotels/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        destination: params.destination,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        guests: params.guests || 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`Hotel search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hotel search error:', error);
    throw error;
  }
}

/**
 * Calculate total price for a stay
 */
export function calculateTotalPrice(pricePerNight: number, nights: number): number {
  return pricePerNight * nights;
}

/**
 * Calculate number of nights between dates
 */
export function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1;
}

