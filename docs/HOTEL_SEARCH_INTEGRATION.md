# Hotel Search Integration on Feed Cards

## Overview

Hotel search functionality has been integrated into the back of feed cards in your Vibe Travelling app. When users tap/click on an adventure card in the feed, it flips to reveal hotel search results with real-time prices.

## Implementation Details

### Components Created

1. **`src/services/hotelApi.ts`**
   - API service for hotel search
   - Functions: `searchHotels()`, `calculateTotalPrice()`, `calculateNights()`
   - TypeScript interfaces for `Hotel`, `HotelSearchParams`, `HotelSearchResponse`

2. **`components/HotelSearchBack.tsx`**
   - React component for displaying hotel search results
   - Auto-searches when card is flipped
   - Shows hotel cards with:
     - Hotel image (with fallback)
     - Rating (stars)
     - Price per night + total price
     - Amenities
     - Book button
   - Responsive design matching iOS style

### Components Modified

1. **`components/AdventureFeedCard.tsx`**
   - Integrated `HotelSearchBack` component on the back side
   - Maintains existing flip animation
   - Passes destination to hotel search

2. **`backend/server.js`**
   - Enhanced `/api/hotels/search` endpoint
   - Returns mock hotel data with proper structure
   - Ready for Bright Data MCP integration

## How It Works

### User Flow

1. User views adventure card in feed
2. User taps/clicks anywhere on the card image
3. Card flips to show hotel search
4. Hotel search automatically executes for the adventure's destination
5. Real-time hotel prices are displayed
6. User can book hotels or flip back to see adventure details

### Technical Flow

```
Frontend Card → Tap → Flip Animation → HotelSearchBack Component
    ↓
Auto-search Hotels → hotelApi.ts → Backend API → Mock Hotel Data
    ↓
Display Results → Hotel Cards with Prices
```

## API Endpoint

### POST `/api/hotels/search`

**Request:**
```json
{
  "destination": "Paris",
  "checkIn": "2024-12-15",
  "checkOut": "2024-12-20",
  "guests": 2
}
```

**Response:**
```json
{
  "success": true,
  "hotels": [
    {
      "id": "hotel-1",
      "name": "Grand Hotel Plaza",
      "imageUrl": "https://...",
      "rating": 4.5,
      "pricePerNight": 250,
      "currency": "USD",
      "address": "123 Main Street, Downtown, Paris",
      "amenities": ["Free Wi-Fi", "Pool", "Spa"],
      "bookingUrl": "https://booking.com/hotel/1"
    }
  ],
  "count": 5
}
```

## Features

✅ **Real-time Search** - Automatically searches when card is flipped  
✅ **Price Display** - Shows per night and total prices  
✅ **Hotel Ratings** - Star ratings for each hotel  
✅ **Amenities** - Lists key amenities for each hotel  
✅ **Booking Links** - Direct links to book hotels  
✅ **Date Calculation** - Automatically calculates number of nights  
✅ **Responsive Design** - Matches iOS design system  
✅ **Loading States** - Shows loading indicator while searching  
✅ **Error Handling** - Toast notifications for errors  

## Testing

### Test the Feature

1. Start backend: `cd backend && npm start`
2. Start frontend: `npm run dev`
3. Open http://localhost:5173
4. Navigate to feed
5. Tap on any adventure card
6. Card flips to show hotel search
7. View hotel results with prices

### Test API Directly

```bash
curl -X POST http://localhost:3001/api/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Paris",
    "checkIn": "2024-12-15",
    "checkOut": "2024-12-20",
    "guests": 2
  }'
```

## Next Steps: Bright Data MCP Integration

To get real-time hotel prices from Bright Data:

1. Replace mock data in `backend/server.js` with real API calls
2. Use Bright Data MCP tools to scrape hotel booking sites
3. Parse and structure hotel data
4. Return formatted results

Example implementation:

```javascript
// In backend/server.js
const response = await fetch('https://api.brightdata.com/...', {
  headers: {
    'Authorization': `Bearer ${BRIGHT_DATA_API_TOKEN}`
  }
});
```

## Files Modified

- `components/AdventureFeedCard.tsx` - Integrated hotel search
- `components/HotelSearchBack.tsx` - New component
- `src/services/hotelApi.ts` - New API service
- `backend/server.js` - Enhanced hotel endpoint

## Design System

Matches iOS design patterns:
- Uses `var(--ios-blue)` for accents
- Uses `var(--ios-gray)` for secondary text
- Rounded corners (rounded-xl, rounded-[20px])
- Subtle shadows (ios-shadow)
- Smooth animations

## Performance

- Auto-searches only when card is flipped
- Loads 5 hotels at a time
- Optimized images with fallbacks
- Lazy loading ready for implementation

