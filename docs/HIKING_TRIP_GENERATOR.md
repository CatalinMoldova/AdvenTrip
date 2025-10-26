# Hiking Trip Generator with MCP

## Overview

The Hiking Trip Generator uses MCP/Bright Data to find nearby hiking destinations based on a starting location. It uses LLM-like processing to extract trail information and generate detailed descriptions.

## API Endpoint

### POST `/api/hiking-trip`

Generates hiking trip suggestions near a specified location.

#### Request

```json
{
  "location": "New York",
  "radius": 100  // Optional, default: 100 miles
}
```

#### Response

```json
{
  "success": true,
  "hikingTrips": [
    {
      "id": "hiking-new-york-mountain-trail",
      "activity": "Hiking",
      "destination": "New York Mountain Trail",
      "location": "New York area",
      "distance": "15 miles",
      "difficulty": "Moderate",
      "reason": "Scenic mountain trail with stunning views",
      "description": "Explore New York Mountain Trail, a moderate hiking trail located 15 miles from your starting point...",
      "estimatedPrice": 2000,
      "bestSeason": "Year-round",
      "images": ["https://..."],
      "bookingUrl": "https://...",
      "dataSource": "real-time-mcp",
      "trailInfo": {
        "length": "6 miles",
        "elevation": "1200 ft",
        "type": "Loop"
      }
    }
  ],
  "count": 2,
  "dataSource": "mcp-llm-powered"
}
```

## How It Works

### 1. Location-Based Search

Uses MCP to search for hiking trails:

```javascript
const searchQuery = `best hiking trails near ${location} within ${radius} miles`;
const searchResults = await searchWithBrightData(searchQuery);
```

### 2. LLM-Like Extraction

Processes search results to extract:
- Trail names
- Difficulty levels
- Distances
- Trail information (length, elevation, type)

### 3. Detailed Descriptions

Generates rich descriptions for each trail:

```javascript
const description = await getHikingDescription(destination);
```

### 4. Complete Trip Info

Each hiking trip includes:
- **Destination**: Trail name
- **Location**: General area
- **Distance**: From starting point
- **Difficulty**: Easy, Moderate, or Hard
- **Trail Info**: Length, elevation, type
- **Description**: Detailed trail description
- **Images**: Visual representation
- **Pricing**: Estimated cost

## Usage Examples

### Basic Request

```bash
curl -X POST http://localhost:3001/api/hiking-trip \
  -H "Content-Type: application/json" \
  -d '{"location":"San Francisco"}'
```

### With Custom Radius

```bash
curl -X POST http://localhost:3001/api/hiking-trip \
  -H "Content-Type: application/json" \
  -d '{"location":"Seattle","radius":50}'
```

## Trail Information

Each hiking trip includes detailed trail information:

### Trail Types
- **Loop**: Starts and ends at the same point
- **Out & Back**: Trail to a point and return
- **Point to Point**: One-way trail

### Difficulty Levels
- **Easy**: Flat or gentle slopes, well-maintained
- **Moderate**: Some elevation gain, good fitness needed
- **Hard**: Steep climbs, challenging terrain

### Trail Metrics
- **Length**: Distance of the trail
- **Elevation**: Elevation gain
- **Distance**: From your starting location

## Integration with Frontend

### Example Component Usage

```tsx
async function generateHikingTrip(location: string) {
  const response = await fetch('http://localhost:3001/api/hiking-trip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location })
  });
  
  const data = await response.json();
  return data.hikingTrips;
}
```

## Features

✅ **Location-based search**: Find trails near any location  
✅ **LLM-powered extraction**: Intelligent trail information parsing  
✅ **Detailed descriptions**: Rich trail details  
✅ **Trail metrics**: Length, elevation, difficulty  
✅ **Real-time images**: Visual representation  
✅ **MCP integration**: Uses Bright Data for live data  

## Fallback Behavior

If search results are insufficient:
- Provides default hiking destinations
- Includes reasonable trail information
- Maintains consistent response format

## Future Enhancements

1. **GPS Integration**: Use exact coordinates
2. **Weather Data**: Include current conditions
3. **User Reviews**: Aggregate trail reviews
4. **Difficulty Filtering**: Filter by user fitness level
5. **Trail Conditions**: Real-time trail status
6. **Equipment Recommendations**: Suggest gear needed

## Testing

### Test Locations

Try these locations:
- "New York"
- "San Francisco"
- "Seattle"
- "Denver"
- "Portland"

### Expected Response

- 1-5 hiking trip suggestions
- Each with complete trail information
- Detailed descriptions
- Trail metrics

## Summary

The Hiking Trip Generator leverages MCP to provide intelligent, location-based hiking recommendations with rich descriptions and trail information!
