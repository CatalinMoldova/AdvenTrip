# Trip Ideas Generator API

## Overview

The Trip Ideas Generator is an intelligent travel suggestion system that generates personalized trip ideas based on user interests. It combines activities with ideal destinations to create unique trip ideas like "Diving in Egypt" or "Surfing in Hawaii".

### Current Implementation: Curated Suggestions
The current version uses **intelligently curated data** - pre-researched combinations of activities and destinations that have been manually validated for quality and accuracy. This ensures reliable, well-researched suggestions.

### Future: Real-time Data (Planned)
The system is designed to support real-time data collection using Bright Data MCP when requested via the `useRealTimeData` parameter. This would scrape travel sites for live pricing, availability, and trending destinations.

## API Endpoint

### POST `/api/trip-ideas`

Generate personalized trip ideas based on user interests.

#### Request Body

```json
{
  "interests": ["Diving", "Beach", "Wildlife"],
  "useRealTimeData": false  // Optional: Set to true for live data (future feature)
}
```

#### Response

```json
{
  "success": true,
  "ideas": [
    {
      "id": "idea-0-0",
      "activity": "Diving",
      "destination": "Egypt",
      "reason": "Red Sea reefs",
      "estimatedPrice": 2800,
      "bestSeason": "Year-round",
      "description": "Diving in Egypt: Red Sea reefs",
      "priority": "high"
    }
  ],
  "count": 4
}
```

## Supported Activities

### Water Activities
- **Diving**: Egypt (Red Sea), Belize (Blue Hole), Maldives, Australia (Great Barrier Reef)
- **Surfing**: Hawaii, Indonesia, Portugal
- **Water Sports**: Maldives, Greece

### Adventure & Sports
- **Skiing**: Switzerland, Japan, Canada
- **Adventure Sports**: New Zealand, Patagonia
- **Hiking**: Nepal, Peru (Inca Trail), Iceland

### Nature & Wildlife
- **Wildlife**: Kenya (Safari), Galapagos, Costa Rica
- **Mountains**: Switzerland, Nepal (Everest)
- **Camping**: Patagonia, Iceland

### Cultural Experiences
- **Museums**: Paris, New York, London
- **Cultural Sites**: Jordan (Petra), Cambodia (Angkor Wat), Morocco
- **Food Tours**: Italy, Japan, Thailand
- **Photography**: Iceland, India, Morocco

### Relaxation
- **Beach**: Bora Bora, Seychelles, Maldives
- **Spa & Wellness**: Thailand, Bali

## Usage Example

### Frontend Integration

```typescript
import { getTripIdeas } from '@/src/services/tripIdeasApi';

// Generate trip ideas
const response = await getTripIdeas({ 
  interests: ['Diving', 'Skiing'] 
});

console.log(response.ideas);
```

### React Component

```tsx
import { TripIdeasGenerator } from '@/components/TripIdeasGenerator';

function MyComponent() {
  return (
    <TripIdeasGenerator 
      interests={['Diving', 'Beach']}
      onSelect={(idea) => console.log('Selected:', idea)}
    />
  );
}
```

## Features

### 1. Intelligent Matching
- Matches activities with ideal destinations
- Provides reasons why each destination is perfect for the activity
- Includes best season to visit

### 2. Pricing Information
- Estimated trip prices based on destination
- Price ranges from $1,500 to $4,500
- Helps users plan their budget

### 3. Priority System
- First interest gets "high" priority
- Recommended trips marked with "Recommended" badge
- Visual indicators for top suggestions

### 4. Seasonal Recommendations
- Best time to visit for optimal experience
- Considers weather, crowds, and seasonal activities
- Year-round options where applicable

## Example Trip Ideas

### Diving
- **Egypt**: Red Sea reefs (Year-round, $2,800)
- **Belize**: Blue Hole (Nov-Apr, $2,200)
- **Maldives**: Crystal clear waters (Dec-Apr, $3,200)
- **Australia**: Great Barrier Reef (Jun-Nov, $3,500)

### Surfing
- **Hawaii**: Birthplace of surfing (Year-round, $2,500)
- **Indonesia**: World-class breaks (Apr-Oct, $1,800)
- **Portugal**: Nazare big waves (Sep-Apr, $2,000)

### Wildlife
- **Kenya**: Safari & Big Five (Jul-Oct, $3,200)
- **Galapagos**: Unique wildlife (Dec-May, $3,800)
- **Costa Rica**: Rainforest biodiversity (Dec-Apr, $2,400)

## Future Enhancements

1. **AI-Powered Suggestions**: Use LLMs to generate more creative combinations
2. **Real-time Pricing**: Integrate with travel APIs for accurate pricing
3. **User History**: Learn from past selections to improve recommendations
4. **Multi-Activity Trips**: Suggest trips combining multiple interests
5. **Local Insights**: Add local tips, hidden gems, and insider knowledge

## Testing

### Test with curl

```bash
# Single interest
curl -X POST http://localhost:3001/api/trip-ideas \
  -H "Content-Type: application/json" \
  -d '{"interests":["Diving"]}'

# Multiple interests
curl -X POST http://localhost:3001/api/trip-ideas \
  -H "Content-Type: application/json" \
  -d '{"interests":["Surfing","Beach"]}'
```

## Integration Points

The trip ideas generator integrates with:
- User onboarding (interest selection)
- Adventure feed (inspiring new trips)
- Group planning (find common interests)
- Discovery page (explore new possibilities)
