/**
 * Flight Search API Service
 * Integrates with backend API to search for flights using Bright Data
 */

export interface Flight {
  id: string;
  airline: string;
  airlineLogo: string;
  departure: {
    airport: string;
    code: string;
    time: string;
    city: string;
  };
  arrival: {
    airport: string;
    code: string;
    time: string;
    city: string;
  };
  duration: string;
  stops: number;
  stopsInfo: string;
  class: string;
  price: number;
  currency: string;
  bookingUrl: string;
  aircraft: string;
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  travelers?: number;
}

export interface FlightSearchResponse {
  success: boolean;
  flights: Flight[];
  count: number;
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

/**
 * Search for flights using Bright Data API
 */
export async function searchFlights(params: FlightSearchParams): Promise<FlightSearchResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/flights/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Flight search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Flight search error:', error);
    throw error;
  }
}

/**
 * Format flight date/time for display
 */
export function formatFlightTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

/**
 * Format flight date for display
 */
export function formatFlightDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

/**
 * Calculate total price for multiple travelers
 */
export function calculateTotalPrice(price: number, travelers: number): number {
  return price * travelers;
}

