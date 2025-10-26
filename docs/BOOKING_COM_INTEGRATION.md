# Booking.com Integration

## Overview

When users click the "Book" button on hotel search results, it opens Booking.com in a new tab with a pre-filled search for that specific hotel, destination, dates, and number of guests.

## How It Works

### 1. **Backend URL Generation**

The backend generates Booking.com search URLs with all necessary parameters:

```javascript
const bookingUrl = `https://www.booking.com/searchresults.html?
  ss=${encodeURIComponent(hotel.name + ', ' + destination)}&
  checkin=${checkIn}&
  checkout=${checkOut}&
  group_adults=${guests || 2}&
  no_rooms=1&
  nflt=ht_id%3D204&
  order=price`;
```

### 2. **URL Parameters Explained**

- **`ss`**: Search string (hotel name + destination)
- **`checkin`**: Check-in date (YYYY-MM-DD)
- **`checkout`**: Check-out date (YYYY-MM-DD)
- **`group_adults`**: Number of guests
- **`no_rooms`**: Number of rooms
- **`nflt=ht_id%3D204`**: Hotel type filter
- **`order=price`**: Sort by price (cheapest first)

### 3. **Frontend Button**

The "Book" button in `HotelSearchBack.tsx` opens the URL:

```typescript
<Button
  onClick={() => window.open(hotel.bookingUrl, '_blank')}
  className="bg-[var(--ios-blue)] hover:bg-[#0051D5] text-white"
  size="sm"
>
  <ExternalLink className="w-3.5 h-3.5 mr-1" />
  Book
</Button>
```

## Example URLs

### Garden View Hotel, Tokyo
```
https://www.booking.com/searchresults.html?
  ss=Garden%20View%20Hotel%2C%20Tokyo&
  checkin=2026-01-15&
  checkout=2026-01-18&
  group_adults=2&
  no_rooms=1&
  nflt=ht_id%3D204&
  order=price
```

### Grand Hotel Plaza, Paris
```
https://www.booking.com/searchresults.html?
  ss=Grand%20Hotel%20Plaza%2C%20Paris&
  checkin=2026-01-05&
  checkout=2026-01-08&
  group_adults=2&
  no_rooms=1&
  nflt=ht_id%3D204&
  order=price
```

## User Flow

1. User views adventure card in feed
2. Taps card to flip and see hotel search
3. Sees hotel results with prices
4. Clicks "Book" button on desired hotel
5. **Booking.com opens in new tab** with:
   - Hotel name pre-filled
   - Destination set
   - Dates selected
   - Guests configured
   - Results sorted by price

## Benefits

✅ **Direct booking** - Users can book immediately  
✅ **Price comparison** - See Booking.com's prices  
✅ **Trusted platform** - Uses well-known booking site  
✅ **Pre-filled search** - Saves user time  
✅ **Sorted by price** - Shows cheapest options first  

## Testing

### Test the URL Generation

```bash
curl -X POST http://localhost:3001/api/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Tokyo",
    "checkIn": "2026-01-15",
    "checkOut": "2026-01-18",
    "guests": 2
  }' | jq '.hotels[0].bookingUrl'
```

### Test in Browser

1. Visit http://localhost:5173
2. Go to feed tab
3. Tap any adventure card
4. Click "Book" on any hotel
5. Booking.com opens with search results

## Features

- **Opens in new tab** - Doesn't navigate away from your app
- **External link icon** - Visual indicator it opens external site
- **Pre-filled search** - All details included in URL
- **Sorted by price** - Cheapest first
- **2 adults default** - Sensible default for most trips

## Example Booking.com URL Breakdown

When user clicks "Book" for "Garden View Hotel, Tokyo":
- Opens: `https://www.booking.com/searchresults.html?ss=Garden%20View%20Hotel%2C%20Tokyo&checkin=2026-01-15&checkout=2026-01-18&group_adults=2&no_rooms=1&nflt=ht_id%3D204&order=price`
- Booking.com searches for hotels matching "Garden View Hotel, Tokyo"
- Shows available rooms for Jan 15-18, 2026
- Filters for 2 adults, 1 room
- Sorts results by price (cheapest first)

## Future Enhancements

1. **Deep linking** - Link directly to specific hotel pages
2. **Price tracking** - Monitor Booking.com prices
3. **Multiple booking sites** - Add Expedia, Hotels.com options
4. **Affiliate links** - Earn commission on bookings
5. **Price comparison** - Show prices from multiple sites

