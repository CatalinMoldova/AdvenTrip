# Quick Start: Flight Search Integration

## Getting Started in 5 Minutes

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Start Backend Server

```bash
npm start
```

You should see:
```
🚀 Backend server running on http://localhost:3001
📡 Flight search API: POST http://localhost:3001/api/flights/search
🏨 Hotel search API: POST http://localhost:3001/api/hotels/search
```

### Step 3: Start Frontend

In a new terminal:

```bash
npm run dev
```

### Step 4: Test Flight Search

1. Open your app in the browser
2. Click on any adventure
3. Go to the "Flights" tab
4. Select dates and click "Search Flights"

## How to Use MCP Server

### Using MCP in Cursor

I can use the Bright Data MCP server directly. Just ask me:

- "Search for flights from New York to Paris"
- "Find hotels in Paris"
- "Scrape flight prices from Google Flights"

I'll use the MCP tools automatically!

### MCP Tools Available

When you chat with me in Cursor, I have access to:

1. **`mcp_Bright_Data_search_engine`** - Search Google/Bing/Yandex
2. **`mcp_Bright_Data_scrape_as_markdown`** - Scrape any webpage
3. **`mcp_Bright_Data_scrape_batch`** - Scrape multiple pages at once

### Example: Ask Me to Search for Flights

```
You: Find flights from San Francisco to Tokyo on December 15th

Me: [I'll use the MCP tools to search for flights and return results]
```

## What Happens Behind the Scenes

1. **You make a request** in AdventureDetailView
2. **Frontend calls** `/api/flights/search` endpoint
3. **Backend processes** the request (currently returns mock data)
4. **Results displayed** in FlightSearchTab component

## Next Steps for Production

To use real Bright Data API:

1. Update `backend/server.js` to call Bright Data API
2. Configure zones in Bright Data dashboard
3. Replace mock data functions with real API calls

See `docs/MCP_INTEGRATION.md` for detailed instructions.

## Troubleshooting

**Backend won't start?**
- Check if port 3001 is available
- Make sure Node.js is installed

**No flights showing?**
- Check browser console for errors
- Verify backend is running on port 3001

**CORS errors?**
- Backend already has CORS enabled
- Check network tab in browser DevTools

## Need Help?

- Check `docs/MCP_INTEGRATION.md` for full documentation
- Ask me (Cursor AI) - I can use MCP tools directly!

