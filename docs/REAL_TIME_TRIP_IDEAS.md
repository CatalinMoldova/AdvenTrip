# Real-Time Trip Ideas with MCP/Bright Data

## Overview

The Trip Ideas Generator now uses real-time data from web scraping (via Bright Data MCP) to generate personalized travel suggestions with live pricing, images, and current destination information.

## Features

### ✅ Real-Time Data Sources

1. **Web Search**: Uses Bright Data search engine to find best destinations for activities
2. **Live Pricing**: Extracts real-time pricing from travel sites
3. **Image Collages**: Fetches destination images from Google search results
4. **Intelligent Matching**: LLM-based activity-destination combinations

### Data Flow

```
User Interests → Bright Data Search → Extract Destinations → Get Pricing & Images → Return Trip Ideas
```

## API Endpoint

### POST `/api/trip-ideas`

#### Request
```json
{
  "interests": ["Diving", "Beach"],
  "useRealTimeData": true  // Now defaults to true
}
```

#### Response
```json
{
  "success": true,
  "ideas": [
    {
      "id": "real-0",
      "activity": "Diving",
      "destination": "Egypt",
      "reason": "Red Sea reefs",
      "estimatedPrice": 2800,
      "bestSeason": "Year-round",
      "description": "Diving in Egypt: Red Sea reefs",
      "priority": "high",
      "images": [
        "https://example.com/egypt-diving-1.jpg",
        "https://example.com/egypt-diving-2.jpg"
      ],
      "bookingUrl": "https://www.booking.com/...",
      "dataSource": "real-time"
    }
  ],
  "count": 4,
  "dataSource": "real-time"
}
```

## Implementation Details

### 1. Search with Bright Data

The system uses Bright Data's search engine to find relevant travel information:

```javascript
const searchResults = await searchWithBrightData(query);
```

- **Query**: "best destinations for [activity] activities travel guide 2024"
- **Engine**: Google
- **Results**: Top 10 relevant articles and guides

### 2. Destination Extraction

Uses NLP/pattern matching to extract destination names from search results:

```javascript
function extractDestinationsFromResults(results, interest) {
  // Parse titles and snippets
  // Match against known destinations
  // Return structured data
}
```

**Supported Destinations**: 18+ countries including Egypt, Belize, Maldives, Australia, Hawaii, Indonesia, etc.

### 3. Live Pricing Extraction

Searches for and extracts pricing information:

```javascript
async function getLivePricing(destination, activity) {
  // Search for: "{activity} {destination} tour price cost"
  // Extract prices from search results
  // Return structured pricing data
}
```

**Price Range**: $500 - $10,000 per trip

### 4. Image Collection

Fetches destination images from search results:

```javascript
async function getDestinationImages(destination) {
  // Search for: "{destination} travel destination"
  // Extract image URLs from results
  // Return image array
}
```

**Images Per Destination**: Up to 4 images (1 main + 3 grid)

## Frontend Display

### Image Collage

The frontend displays:
- **Main Image**: Large hero image (800x600)
- **Grid Images**: 3 additional images in a grid (400x300 each)

### Real-time Indicator

When data is from real-time sources, displays:
- `dataSource: "real-time"` badge
- Live pricing information
- Current seasonal recommendations

## Fallback Mechanism

If Bright Data is unavailable:
1. Attempts to fetch real-time data
2. If API fails, falls back to curated suggestions
3. Returns reliable, pre-researched data

## Performance

- **Response Time**: 2-5 seconds for real-time data
- **Fallback Time**: <500ms for curated data
- **Cache**: Results can be cached for 24 hours

## Testing

### Test Command

```bash
curl -X POST http://localhost:3001/api/trip-ideas \
  -H "Content-Type: application/json" \
  -d '{"interests":["Diving"],"useRealTimeData":true}' | jq
```

### Expected Response

```json
{
  "success": true,
  "dataSource": "real-time",
  "ideas": [/* trip ideas with images and pricing */]
}
```

## Future Enhancements

1. **LLM Integration**: Use GPT-4 for intelligent destination matching
2. **Multi-language Support**: Search in different languages
3. **Trending Destinations**: Include trending/popular locations
4. **User Preferences**: Learn from user clicks and selections
5. **Social Proof**: Include review ratings and traveler photos

## Configuration

### Environment Variables

```bash
BRIGHT_DATA_API_TOKEN=your_token_here
```

### API Endpoints

- Main API: `http://localhost:3001/api/trip-ideas`
- Bright Data: `https://api.brightdata.com/search_engine`

## Troubleshooting

### Issue: Real-time data not returning

**Solution**: Check Bright Data API token and network connectivity

### Issue: No images displayed

**Solution**: Fallback to placeholder images automatically handles this

### Issue: Pricing shows default $2000

**Solution**: Pricing extraction failed, using default value
