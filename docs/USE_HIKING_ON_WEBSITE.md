# How to Use Hiking Trip Generator on the Website

## Quick Access

Visit: **`http://localhost:5173/hiking`**

## What It Does

The Hiking Trip Generator uses **MCP/Bright Data** to find real-time hiking trails near any location and provides:
- Trail names and locations
- Distance from your starting point
- Difficulty levels (Easy, Moderate, Hard)
- Trail length, elevation, and type
- Detailed descriptions
- Images

## How to Use

### Step 1: Enter Your Location

Type a city or area in the input box:
- Examples: "New York", "San Francisco", "Seattle"

### Step 2: Adjust Search Radius

Slide the radius slider (10-200 miles):
- **10 miles**: Very close trails
- **100 miles**: Regional trails (default)
- **200 miles**: Wide search area

### Step 3: Find Trails

Click **"Find Hiking Trails"** button

The system will:
1. Search for hiking trails near your location
2. Extract trail information
3. Generate detailed descriptions
4. Return results with images

### Step 4: View Results

Each trail shows:
- **Trail Name**: Destination
- **Location & Distance**: How far away
- **Difficulty Badge**: Color-coded (Green=Easy, Yellow=Moderate, Red=Hard)
- **Description**: What makes it special
- **Trail Metrics**:
  - Length: How long the trail is
  - Elevation: How much climbing
  - Type: Loop or Out & Back
- **Best Season**: When to visit
- **Price**: Estimated cost

## What the Backend Does

### The API Call (What Happens Behind the Scenes)

When you click "Find Hiking Trails", the frontend makes this API call:

```javascript
fetch('http://localhost:3001/api/hiking-trip', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    location: 'New York',
    radius: 50 
  })
})
```

This is the equivalent of the curl command:
```bash
curl -X POST http://localhost:3001/api/hiking-trip \
  -H "Content-Type: application/json" \
  -d '{"location":"New York","radius":50}'
```

### The Response

The API returns:
```json
{
  "success": true,
  "hikingTrips": [
    {
      "destination": "New York Mountain Trail",
      "location": "New York area",
      "distance": "15 miles",
      "difficulty": "Moderate",
      "description": "Beautiful trail with...",
      "trailInfo": {
        "length": "6 miles",
        "elevation": "1200 ft",
        "type": "Loop"
      }
    }
  ],
  "count": 2
}
```

## Features

### Location Search
✅ Enter any city or area  
✅ Adjustable radius (10-200 miles)  
✅ Real-time results

### Trail Information
✅ Trail names and locations  
✅ Distance from starting point  
✅ Difficulty levels  
✅ Length and elevation  
✅ Trail type (Loop/Out & Back)

### Visual Elements
✅ Trail images  
✅ Color-coded difficulty badges  
✅ Trail metrics display  
✅ Clean, modern UI

## Example Flow

1. **User enters**: "San Francisco"
2. **Sets radius**: 50 miles
3. **Clicks**: "Find Hiking Trails"
4. **System searches**: MCP finds trails near San Francisco
5. **System extracts**: Trail names, distances, difficulties
6. **System generates**: Descriptions and images
7. **System displays**: Results with all trail info

## Try These Locations

- **New York**: Urban hiking opportunities
- **San Francisco**: Coastal and mountain trails
- **Seattle**: Pacific Northwest trails
- **Denver**: Mountain trails
- **Portland**: Forest trails

## Troubleshooting

### No results showing
- Check backend is running: `curl http://localhost:3001/health`
- Try a different location
- Increase the search radius

### Slow loading
- First search may take 2-5 seconds (normal for real-time data)
- Subsequent searches may be faster

### Error message
- Ensure backend is running on port 3001
- Check your internet connection
- Try refreshing the page

## Summary

**Visit `http://localhost:5173/hiking` to start finding hiking trails!**

The hiking trip generator is now fully integrated and accessible on your website! 🏔️
