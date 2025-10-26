# MCP Server Integration Guide

## Overview

This guide explains how to use the Bright Data MCP (Model Context Protocol) server for flight search integration in your Vibe Travelling app.

## What is MCP?

MCP (Model Context Protocol) is a protocol that allows AI assistants (like Cursor) to interact with external tools and services. The Bright Data MCP server provides web scraping capabilities including:

- **Search Engine API**: Search Google, Bing, or Yandex
- **Web Scraping**: Extract content from any webpage (with bot detection bypass)
- **Browser Automation**: Navigate, click, and interact with complex web pages
- **Structured Extractors**: Fast data extraction from major platforms

## MCP Server Configuration

Your MCP server is configured in `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "Bright Data": {
      "command": "npx",
      "args": ["@brightdata/mcp"],
      "env": {
        "API_TOKEN": "your_api_token_here"
      }
    }
  }
}
```

### How MCP Works in Cursor

1. **In Cursor AI**: When you interact with Cursor's AI, it can use the MCP server tools
2. **Tool Functions**: The MCP exposes functions like `scrape_as_markdown`, `search_engine`, etc.
3. **AI Assistant**: I (the AI) can call these tools on your behalf to search for flights, scrape websites, etc.

## Flight Search Integration

### Architecture

```
Frontend (React) → Backend API → Bright Data API → Flight Results
```

### Components Created

1. **Backend API** (`backend/server.js`)
   - Express server with flight search endpoint
   - Uses Bright Data API for web scraping
   - Returns structured flight data

2. **Frontend Service** (`src/services/flightApi.ts`)
   - API client for flight search
   - Helper functions for formatting flight data

3. **Flight Search Component** (`components/FlightSearchTab.tsx`)
   - React component for displaying flight results
   - Integrated into AdventureDetailView

## Using Bright Data API Directly

### Option 1: Using MCP Tools in Cursor

When chatting with Cursor AI, I can use MCP tools directly:

```
Search for flights from New York to Paris on December 15th
```

The AI will use tools like:
- `mcp_Bright_Data_search_engine` - Search Google for flight sites
- `mcp_Bright_Data_scrape_as_markdown` - Scrape flight booking pages

### Option 2: Using Backend API

For production use, make HTTP requests to your backend:

```typescript
import { searchFlights } from '../services/flightApi';

const results = await searchFlights({
  origin: 'New York',
  destination: 'Paris',
  departureDate: '2024-12-15',
  returnDate: '2024-12-20',
  travelers: 2
});
```

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create `backend/.env`:

```env
BRIGHT_DATA_API_TOKEN=your_api_token_here
PORT=3001
```

### 3. Start Backend Server

```bash
cd backend
npm start
# or for development
npm run dev
```

### 4. Configure Frontend

Update `.env` in root directory:

```env
VITE_API_URL=http://localhost:3001
```

### 5. Start Frontend

```bash
npm run dev
```

## API Endpoints

### POST `/api/flights/search`

Search for flights between two destinations.

**Request Body:**
```json
{
  "origin": "New York",
  "destination": "Paris",
  "departureDate": "2024-12-15",
  "returnDate": "2024-12-20",
  "travelers": 2
}
```

**Response:**
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
      "stops": 0,
      "price": 850,
      "currency": "USD"
    }
  ],
  "count": 5
}
```

## Using in Your Code

### In React Components

```tsx
import { FlightSearchTab } from './components/FlightSearchTab';

function MyComponent() {
  return (
    <FlightSearchTab
      origin="New York"
      destination="Paris"
      departureDate="2024-12-15"
      returnDate="2024-12-20"
      travelers={2}
    />
  );
}
```

### Direct API Calls

```typescript
import { searchFlights } from './services/flightApi';

async function getFlights() {
  try {
    const result = await searchFlights({
      origin: 'New York',
      destination: 'Paris',
      departureDate: '2024-12-15',
      travelers: 1
    });
    
    console.log('Found flights:', result.flights);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Bright Data Zones Setup

For production use, configure zones in Bright Data dashboard:

1. **Web Unlocker Zone**: For bypassing bot detection
2. **Browser Zone**: For browser automation

Update environment variables:

```env
WEB_UNLOCKER_ZONE=your_unlocker_zone
BROWSER_ZONE=your_browser_zone
```

## Troubleshooting

### CORS Issues

Make sure backend has CORS enabled (already configured in `server.js`).

### API Token Issues

Verify your Bright Data API token is correct in `backend/.env`.

### No Flights Found

- Check destination names are spelled correctly
- Try different date ranges
- Verify backend server is running

## Next Steps

1. **Replace Mock Data**: Update `backend/server.js` to use real Bright Data API calls
2. **Add More Features**: Hotel search, car rentals, activities
3. **Cache Results**: Implement caching for frequent searches
4. **Error Handling**: Add retry logic and better error messages

## Resources

- [Bright Data Documentation](https://docs.brightdata.com/)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [Express.js Guide](https://expressjs.com/)

## Support

For issues with:
- **MCP Integration**: Check Cursor AI documentation
- **Bright Data API**: Contact Bright Data support
- **Code Issues**: Check GitHub issues or create a new one

