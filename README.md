# Vibe-Travelling

A social travel platform that helps travelers discover, share, and plan their next adventure. Get trips out of the group chat and connect with a community of travelers to find inspiration for your next journey.

![Vibe-Travelling](public/AdvenTrip%20Logo.png)

## 🌟 What is Vibe-Travelling?

**Vibe-Travelling** is a modern social travel app that solves the problem of scattered trip planning and discovery. Instead of sharing travel ideas across multiple platforms like group chats, Instagram, and email, this platform centralizes trip inspiration, sharing, and collaboration.

### The Problem It Solves

- ❌ **Scattered trip ideas** - Travel inspiration gets lost in group chats and social media
- ❌ **No personalized recommendations** - Generic travel sites don't learn your preferences
- ❌ **Difficulty collaborating** - Hard to plan trips with friends in one place
- ❌ **No social discovery** - Can't easily discover trips from other travelers

### Our Solution

- ✅ **Centralized social feed** - All trip inspiration in one place
- ✅ **Personalized recommendations** - Reinforcement learning algorithm learns your preferences
- ✅ **Easy collaboration** - Share trips privately with friends or publicly
- ✅ **Smart itinerary generation** - AI-powered trip planning with real-time data

## 🚀 Features

### Core Features

- **📱 Social Feed** - Discover trips from travelers worldwide
- **🎯 Personalized Recommendations** - AI learns your preferences through swipes
- **📝 Create Posts** - Share your past trips or bucket list destinations
- **💬 Chat & Collaborate** - Message friends about trips
- **🗺️ Adventure Planning** - Generate custom itineraries with AI
- **🔗 Share & Repost** - Share trips with friends easily

### Smart Features

- **Reinforcement Learning Algorithm** - Learns from your interactions (saves, swipes, views) to suggest better trips
- **AI-Powered Itineraries** - Uses Claude LLM to generate detailed trip plans
- **Real-Time Data** - Integrates with Bright Data MCP for flight and hotel prices
- **Interactive Cards** - Swipe right to save, left to pass, tap to see details

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/CatalinMoldova/Vibe-Travelling.git
cd Vibe-Travelling
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including React, TypeScript, Tailwind CSS, and UI components.

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

The app will work with mock data by default, but you can optionally configure:
- Supabase for authentication and database (see backend setup below)
- Bright Data MCP for real-time flight/hotel data

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## 🎮 How to Use the App

### First Time Setup

1. **Landing Page** - On first visit, you'll see the landing page with app information
2. **Get Started** - Click "Get Started" to begin onboarding
3. **Personalization** - Select your interests (hiking, beaches, museums, food, etc.)
4. **Location** - Enter your location to get personalized recommendations

### Navigating the App

#### 🏠 Home/Feed Tab
- **Swipe right** on posts you like to save them
- **Swipe left** to pass on a post
- **Tap the card** to flip it and see detailed information
- **Use the slider** at the bottom to rate interest (0-100%)
- **Share button** (top left) to share trips with friends
- Posts automatically cycle through images

#### 🧳 Adventures Tab
- Create individual or group adventure requests
- View your saved trips and folders
- Manage group trip invitations
- Generate personalized itineraries

#### ➕ Create Tab
- Choose to post a completed trip or a bucket list item
- Fill in trip details:
  - Title and description
  - Destination
  - Duration and activities
  - Hotels and photos (up to 8)
  - Rating (for completed trips)
- Set privacy: Public or unlisted
- Enable collaboration for friends to edit

#### 💬 Chat Tab
- View all your conversations
- Message friends about trips
- Share trips directly via chat
- Search conversations

#### 👤 Profile Tab
- View your saved trips
- Edit your profile and interests
- See your travel map
- Remove trips from your saved list

### Understanding the Recommendation System

The app uses **reinforcement learning** to improve recommendations:

1. **Tag Analysis** - Each trip post has tags (activities, location, type, etc.)
2. **User Interactions** - Tracks your saves (positive), passes (negative), and views
3. **Preference Learning** - Scores tags based on your behavior over time
4. **Smart Ranking** - Orders posts by predicted interest level

**Example**: If you save many posts with "hiking" tags, the algorithm learns you like hiking trips and prioritizes them in your feed.

## 🔧 Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Shadcn UI** - Beautiful pre-built components
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing

### Backend & AI
- **Supabase** - Authentication, database, real-time (optional)
- **Claude LLM** - AI-powered itinerary generation
- **Bright Data MCP** - Real-time flight and hotel pricing
- **Reinforcement Learning** - Personalized recommendation algorithm

### Key Libraries
- `lucide-react` - Beautiful icons
- `sonner` - Toast notifications
- `framer-motion` - Animations

## 📁 Project Structure

```
Vibe-Travelling/
├── components/
│   ├── ui/                    # Shadcn UI components
│   ├── SwipeableAdventureCard.tsx
│   ├── CreatePostScreen.tsx
│   ├── ChatScreen.tsx
│   └── ...
├── data/
│   └── mockData.ts           # Mock data for development
├── services/
│   ├── recommendationService.ts  # RL algorithm
│   └── youtubeService.ts     # Video integration (optional)
├── types/
│   └── index.ts              # TypeScript interfaces
├── App.tsx                   # Main app with routing
├── main.tsx                  # Entry point
└── vite.config.ts           # Vite configuration
```

## 🔐 Backend Setup (Optional)

For full functionality with authentication and database:

### Supabase Setup
1. Create an account at [Supabase](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key
4. Add to `.env.local`:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
5. Run the database schema: `database/schema.sql`

See `AUTH_DATABASE_SETUP_COMPLETE.md` for detailed instructions.

## 🤖 AI & Data Integration

### Claude LLM
- Generates detailed trip itineraries
- Creates personalized activity recommendations
- Suggests restaurants and hotels based on preferences

### Bright Data MCP
- Fetches real-time flight prices
- Provides hotel availability and rates
- Updates pricing for your budget

### Reinforcement Learning
- Learns from every user interaction
- Improves recommendations over time
- Personalizes feed ranking based on:
  - What you save (positive reinforcement)
  - What you pass on (negative reinforcement)
  - What you view (attention signals)

## 🐛 Troubleshooting

### Common Issues

**Issue**: Dependencies won't install
- Solution: Delete `node_modules` and `package-lock.json`, then run `npm install` again

**Issue**: Build errors
- Solution: Check that you're using Node.js v18+

**Issue**: Styles not loading
- Solution: Run `npm run dev` instead of building

**Issue**: Cards not swiping
- Solution: Ensure you're using a modern browser with JavaScript enabled

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

Built with ❤️ by the Vibe-Travelling team

## 📧 Support

For questions or support, please open an issue on GitHub.

---

**Happy Traveling! ✈️🌍**
