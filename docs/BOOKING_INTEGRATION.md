# Booking Integration - One-Click Flight & Hotel Booking

## Overview

Both Trip Ideas and Hiking Trip generators now include one-click booking buttons that open external booking websites with pre-filled information from MCP-generated trip data.

## Features

✅ **Flight Booking**: Opens Google Flights with destination pre-filled  
✅ **Hotel Booking**: Opens Booking.com with destination pre-filled  
✅ **Pre-filled Data**: Uses trip information from MCP  
✅ **Smart URLs**: Handles URL encoding automatically  
✅ **Fallback Support**: Works even without booking URLs from API  

## How It Works

### Flight Booking

When user clicks "Book Flight":

```javascript
const flightUrl = `https://www.google.com/flights?q=flights+to+${encodeURIComponent(destination)}&departure_date=anytime`;
window.open(flightUrl, '_blank');
```

**Example for "Egypt"**:
- Opens: `https://www.google.com/flights?q=flights+to=Egypt&departure_date=anytime`
- User can then select dates and book

### Hotel Booking

When user clicks "Book Hotel":

1. **If API provides `bookingUrl`**:
   - Opens that URL directly

2. **If no `bookingUrl`**:
   - Generates Booking.com search URL: `https://www.booking.com/searchresults.html?ss=Egypt`
   - User can then select dates and book

## Integration Points

### Trip Ideas Generator

Located in: `components/TripIdeasGenerator.tsx`

```tsx
{/* Booking Buttons */}
<div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t">
  <Button onClick={() => window.open(flightUrl, '_blank')}>
    <Plane className="w-3.5 h-3.5 mr-1" />
    Book Flight
  </Button>
  <Button onClick={() => window.open(bookingUrl, '_blank')}>
    <Hotel className="w-3.5 h-3.5 mr-1" />
    Book Hotel
  </Button>
</div>
```

### Hiking Trip Generator

Located in: `components/HikingTripGenerator.tsx`

Same pattern with flight and hotel booking buttons.

## User Experience

### Flow

1. **User generates trip ideas** via MCP
2. **Sees results** with activity, destination, price, etc.
3. **Clicks "Book Flight"** → Google Flights opens in new tab
4. **Clicks "Book Hotel"** → Booking.com opens in new tab
5. **User completes booking** on external site

### Visual Design

- Two buttons side-by-side
- Icons: ✈️ for flights, 🏨 for hotels
- Opens in new tab (doesn't navigate away)
- Consistent styling across components

## Data Flow

```
MCP Generates Trip → Trip Data with Destination → 
URL Generation → window.open() → External Booking Site
```

### Example Trip Data

```json
{
  "activity": "Diving",
  "destination": "Egypt",
  "estimatedPrice": 2800,
  "bookingUrl": "https://www.booking.com/searchresults.html?ss=Egypt"
}
```

## Booking URLs Generated

### Flight URLs

Pattern: `https://www.google.com/flights?q=flights+to={destination}&departure_date=anytime`

Examples:
- Egypt → `https://www.google.com/flights?q=flights+to=Egypt&departure_date=anytime`
- San Francisco → `https://www.google.com/flights?q=flights+to=San%20Francisco&departure_date=anytime`

### Hotel URLs

Pattern 1 (with bookingUrl): Uses API-provided URL  
Pattern 2 (fallback): `https://www.booking.com/searchresults.html?ss={destination}`

Examples:
- Egypt → `https://www.booking.com/searchresults.html?ss=Egypt`
- New York Mountain Trail → `https://www.booking.com/searchresults.html?ss=New%20York%20Mountain%20Trail`

## Implementation Details

### URL Encoding

All destinations are URL-encoded to handle:
- Spaces: "New York" → "New%20York"
- Special characters
- Multi-word destinations

### Click Event Handling

```javascript
onClick={(e) => {
  e.stopPropagation(); // Prevents card click
  window.open(url, '_blank');
}}
```

### Icons Used

- Plane icon from `lucide-react`
- Hotel icon from `lucide-react`

## Testing

### Test Flight Booking

1. Generate trip ideas: "Diving"
2. Click "Book Flight" on Egypt trip
3. Verify Google Flights opens with "Egypt" destination
4. Should be able to select dates and see flights

### Test Hotel Booking

1. Generate trip ideas: "Beach"
2. Click "Book Hotel" on any trip
3. Verify Booking.com opens with destination search
4. Should see hotels for that destination

## Future Enhancements

1. **Pre-fill dates**: Use start/end dates from trip
2. **Price comparison**: Show multiple booking sites
3. **Direct booking**: Integrate with booking APIs
4. **Travelers**: Pass number of guests
5. **Class/Room type**: Pass travel preferences

## Summary

**One-click booking is now fully integrated!** Users can click "Book Flight" or "Book Hotel" on any trip idea to instantly open external booking sites with their destination pre-filled. 🎉
