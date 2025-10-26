# Hotel Price Optimization - Next 3 Months

## Overview

The hotel search system now automatically finds the **cheapest dates** within the next 3 months for each destination, since feed cards don't have specific dates set.

## How It Works

### 1. **Date Range Generation**
- Generates date ranges for the next 90 days (3 months)
- Checks weekly intervals (every 7 days)
- Creates 3-night stay packages

### 2. **Multi-Date Search**
- Searches 4 different weeks simultaneously
- Compares prices across all date ranges
- Finds the cheapest available dates

### 3. **Price Variation Algorithm**
The backend simulates realistic price variations based on booking timing:

- **60+ days ahead**: 15% discount (best prices)
- **30-60 days ahead**: 10% discount  
- **14-30 days ahead**: 5% discount
- **0-14 days ahead**: Standard price

### 4. **Best Price Display**
Shows users:
- The cheapest dates found
- Total price for 3 nights
- Per-night price
- When users can travel for best prices

## Price Examples

### Garden View Hotel
- **Standard**: $150/night
- **60+ days ahead**: $128/night (15% off)
- **Total savings**: $66 for 3 nights

### Downtown Luxury Suites
- **Standard**: $220/night
- **60+ days ahead**: $187/night (15% off)
- **Total savings**: $99 for 3 nights

### Grand Hotel Plaza
- **Standard**: $250/night
- **60+ days ahead**: $213/night (15% off)
- **Total savings**: $111 for 3 nights

## User Experience

### On Feed Cards
Users see: **"Hotels from $128/night"**

This represents the absolute cheapest option available across the next 3 months.

### When Card is Flipped
Shows:
- **Best price dates**: When to travel for cheapest rates
- **Hotel options**: All hotels sorted by price
- **Savings indicator**: Shows total cost and per-night price

## Technical Implementation

### Frontend (`components/HotelSearchBack.tsx`)
```typescript
// Generates date ranges for next 3 months
const generateDateRanges = () => {
  for (let daysAhead = 7; daysAhead <= 90; daysAhead += 7) {
    // Creates check-in/check-out dates
  }
};

// Searches multiple dates and finds cheapest
const results = await Promise.all(searchPromises);
const cheapestHotels = findLowestPrice(results);
```

### Backend (`backend/server.js`)
```javascript
// Price variation based on days ahead
const getPriceVariation = (basePrice) => {
  if (daysAhead > 60) return basePrice * 0.85;      // 15% off
  else if (daysAhead > 30) return basePrice * 0.90; // 10% off
  else if (daysAhead > 14) return basePrice * 0.95;  // 5% off
  else return basePrice;                              // Standard
};
```

## Benefits

✅ **Automatic optimization** - No user input needed  
✅ **Realistic pricing** - Simulates real-world booking patterns  
✅ **User education** - Shows when to book for best prices  
✅ **Flexible dates** - Finds best times to travel  
✅ **Quick decisions** - Instant price comparison  

## Future Enhancement: Real-Time Prices

To get actual real-time prices:

1. Integrate Bright Data MCP scraping
2. Search multiple booking sites (Booking.com, Expedia, etc.)
3. Parse live prices for each date range
4. Return actual cheapest dates and prices

## Testing

```bash
# Test with near-term dates (standard price)
curl -X POST http://localhost:3001/api/hotels/search \
  -d '{"destination":"Tokyo","checkIn":"2025-11-05","checkOut":"2025-11-08"}'

# Test with advanced booking (discounted price)
curl -X POST http://localhost:3001/api/hotels/search \
  -d '{"destination":"Tokyo","checkIn":"2026-01-05","checkOut":"2026-01-08"}'
```

