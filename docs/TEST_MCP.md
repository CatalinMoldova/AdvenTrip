# Testing Bright Data MCP Server

## Method 1: Test Directly in Cursor AI Chat

I can use the MCP tools directly! Just ask me to search for flights or hotels:

### Example Commands

**Flight Search:**
```
Search for flights from New York to Paris on December 15th, 2024
```

**Hotel Search:**
```
Find hotels in Paris for December 15-20, 2024
```

**Multiple Searches:**
```
Search for flights from San Francisco to Tokyo and hotels in Tokyo
```

**With Specific Requirements:**
```
Find direct flights from London to Dubai under $1000
```

I'll use these MCP tools:
- `mcp_Bright_Data_search_engine` - Search Google for flight/hotel sites
- `mcp_Bright_Data_scrape_as_markdown` - Scrape booking pages
- `mcp_Bright_Data_scrape_batch` - Scrape multiple pages

## Method 2: Test via Frontend App

### Start Backend and Frontend

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend  
npm run dev
```

### Test Flight Search

1. Open `http://localhost:5173`
2. Click on any adventure
3. Fill in dates
4. Go to "Flights" tab
5. Click "Search Flights"

### Test Hotel Search

1. Same flow as above
2. Go to "Hotel" tab
3. Click search hotels (if implemented)

## Method 3: Test via Backend API Directly

### Using curl

```bash
# Test flight search
curl -X POST http://localhost:3001/api/flights/search \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "New York",
    "destination": "Paris",
    "departureDate": "2024-12-15",
    "returnDate": "2024-12-20",
    "travelers": 2
  }'

# Test hotel search
curl -X POST http://localhost:3001/api/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Paris",
    "checkIn": "2024-12-15",
    "checkOut": "2024-12-20",
    "guests": 2
  }'
```

### Using Postman or Thunder Client

1. Create POST request to `http://localhost:3001/api/flights/search`
2. Add JSON body with flight search parameters
3. Send request

## Method 4: Programmatic Test Script

Create and run `test-mcp.js`:

```bash
node test-mcp.js
```

See `scripts/test-mcp.js` for example code.

## What to Test

### Flight Search Tests

✅ **Basic Search**
- Origin and destination only
- Should return 3-5 flights

✅ **With Dates**
- Add departure date
- Add return date
- Verify flights match dates

✅ **Multiple Travelers**
- Test with 1, 2, 4 travelers
- Verify price calculation

✅ **Different Routes**
- Short haul (NYC to Boston)
- Long haul (NYC to Tokyo)
- International (NYC to Paris)

### Hotel Search Tests

✅ **Basic Search**
- Destination only
- Should return hotels

✅ **With Dates**
- Check-in and check-out dates
- Verify availability

✅ **Different Locations**
- Cities (Paris, New York)
- Countries (France, USA)

## Expected Results

### Flight Search Response
```json
{
  "success": true,
  "flights": [
    {
      "id": "flight-1",
      "airline": "American Airlines",
      "departure": {
        "airport": "JFK",
        "time": "2024-12-15T08:00:00Z"
      },
      "arrival": {
        "airport": "CDG",
        "time": "2024-12-15T21:30:00Z"
      },
      "duration": "8h 30m",
      "price": 850,
      "currency": "USD"
    }
  ],
  "count": 5
}
```

### Hotel Search Response
```json
{
  "success": true,
  "hotels": [
    {
      "id": "hotel-1",
      "name": "Grand Hotel Plaza",
      "location": "Paris",
      "rating": 4,
      "pricePerNight": 150,
      "currency": "USD"
    }
  ],
  "count": 5
}
```

## Common Issues

### ❌ "Cannot find module"
- Check MCP server is configured in `~/.cursor/mcp.json`
- Restart Cursor IDE

### ❌ "API Token Invalid"
- Verify token in MCP config
- Check Bright Data dashboard

### ❌ "No results found"
- Try different destinations
- Adjust date ranges
- Check network connection

### ❌ "Timeout"
- Increase timeout settings
- Check Bright Data API status

## Testing Checklist

- [ ] MCP server configured correctly
- [ ] Backend running on port 3001
- [ ] Frontend running on port 5173
- [ ] Can search flights via AI chat
- [ ] Can search flights via frontend
- [ ] Can search hotels via AI chat
- [ ] API returns valid JSON
- [ ] Results display correctly in UI
- [ ] Price calculations correct
- [ ] Booking links work

## Need Help?

Ask me (the AI) to:
- "Search for flights from X to Y"
- "Find hotels in X"
- "Test the MCP integration"

I'll use the tools directly and show you the results!

