import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useUser, SignIn, UserButton } from '@clerk/clerk-react';
import { User, TripPost, UserPreferences, AdventureBoard } from './types';
import { HomePage as LandingPageComponent } from './components/HomePage';
import { BottomTabNavigation } from './components/BottomTabNavigation';
import { SocialFeedScreen } from './components/SocialFeedScreen';
import { ChatScreen } from './components/ChatScreen';
import { CreatePostScreen } from './components/CreatePostScreen';
import { ShareModal } from './components/ShareModal';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { mockTripPosts, mockChats } from './data/mockData';
import { RecommendationService } from './services/recommendationService';

// Context to share app state across routes
const AppContext = React.createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  userPreferences: UserPreferences;
  setUserPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  savedPostIds: Set<string>;
  setSavedPostIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  repostedPostIds: Set<string>;
  setRepostedPostIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  tripPosts: TripPost[];
  setTripPosts: React.Dispatch<React.SetStateAction<TripPost[]>>;
  adventureBoards: AdventureBoard[];
  setAdventureBoards: React.Dispatch<React.SetStateAction<AdventureBoard[]>>;
} | null>(null);

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

function AppContent() {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    tagScores: {},
    lastUpdated: new Date().toISOString(),
  });
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
  const [repostedPostIds, setRepostedPostIds] = useState<Set<string>>(new Set());
  const [tripPosts, setTripPosts] = useState<TripPost[]>(mockTripPosts);
  const [adventureBoards, setAdventureBoards] = useState<AdventureBoard[]>([]);

  // Sync Clerk user with app user state
  useEffect(() => {
    console.log('Clerk state:', { isSignedIn, hasClerkUser: !!clerkUser });
    if (isSignedIn && clerkUser) {
      const appUser: User = {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.firstName || 'User',
        username: clerkUser.username || undefined,
        email: clerkUser.primaryEmailAddress?.emailAddress,
        location: '',
        interests: [],
        avatar: clerkUser.imageUrl,
        createdAt: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : new Date().toISOString(),
      };
      console.log('Setting app user:', appUser);
      setUser(appUser);
      
      // Initialize preferences for new users
      if (userPreferences.tagScores && Object.keys(userPreferences.tagScores).length === 0) {
        const initialPreferences = RecommendationService.getInitialPreferences([]);
        setUserPreferences(initialPreferences);
      }
    } else if (!isSignedIn) {
      console.log('User not signed in, clearing user state');
      setUser(null);
    }
  }, [isSignedIn, clerkUser]);

  // Show loading state while Clerk initializes
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      user, 
      setUser, 
      userPreferences,
      setUserPreferences,
      savedPostIds,
      setSavedPostIds,
      repostedPostIds,
      setRepostedPostIds,
      tripPosts,
      setTripPosts,
      adventureBoards,
      setAdventureBoards,
    }}>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/get-started" element={<GetStartedPage />} />
          <Route path="/home" element={isSignedIn && user ? <HomePage /> : <Navigate to="/get-started" />} />
          <Route path="/adventures" element={isSignedIn && user ? <AdventuresPage /> : <Navigate to="/get-started" />} />
          <Route path="/create" element={isSignedIn && user ? <CreatePage /> : <Navigate to="/get-started" />} />
          <Route path="/chat" element={isSignedIn && user ? <ChatPage /> : <Navigate to="/get-started" />} />
          <Route path="/profile" element={isSignedIn && user ? <ProfilePage /> : <Navigate to="/get-started" />} />
          <Route path="/profile/:userId" element={isSignedIn && user ? <UserProfilePage /> : <Navigate to="/get-started" />} />
        </Routes>

        {/* Toast Notifications */}
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'saturate(180%) blur(20px)',
              WebkitBackdropFilter: 'saturate(180%) blur(20px)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '16px',
              padding: '12px 16px',
              fontSize: '15px',
              fontWeight: '500',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
              color: '#000000',
            },
            duration: 2000,
          }}
        />
      </div>
    </AppContext.Provider>
  );
}

// Landing Page Component (/)
function LandingPage() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  
  // If user is already signed in, redirect to home
  useEffect(() => {
    if (isSignedIn) {
      navigate('/home', { replace: true });
    }
  }, [isSignedIn, navigate]);
  
  const handleGetStarted = () => {
    navigate('/get-started');
  };

  return <LandingPageComponent onGetStarted={handleGetStarted} />;
}

// Get Started / Onboarding Page (/get-started)
function GetStartedPage() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  // If already signed in, redirect to home
  useEffect(() => {
    if (isSignedIn) {
      console.log('User is signed in, redirecting to /home');
      navigate('/home', { replace: true });
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to AdvenTrip</h1>
          <p className="text-gray-600">Sign in to start discovering amazing trips</p>
        </div>
        <div className="flex justify-center">
          <SignIn 
            routing="hash"
            signUpUrl="#"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-xl",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Home Page - Social Feed (/home)
function HomePage() {
  const {
    tripPosts,
    userPreferences,
    setUserPreferences,
    savedPostIds,
    setSavedPostIds,
    repostedPostIds,
    setRepostedPostIds,
    setTripPosts,
  } = useAppContext();
  const navigate = useNavigate();
  const [sharePost, setSharePost] = useState<TripPost | null>(null);

  const handleSavePost = (postId: string) => {
    setSavedPostIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });

    // Update post stats
    setTripPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              stats: {
                ...post.stats,
                saves: savedPostIds.has(postId) ? post.stats.saves - 1 : post.stats.saves + 1,
              },
            }
          : post
      )
    );
  };

  const handleSharePost = (postId: string) => {
    const post = tripPosts.find(p => p.id === postId);
    if (post) {
      setSharePost(post);
    }
  };

  const handleRepostPost = (postId: string) => {
    setRepostedPostIds(prev => new Set([...prev, postId]));
    
    // Update post stats
    setTripPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, stats: { ...post.stats, reposts: post.stats.reposts + 1 } }
          : post
      )
    );
  };

  return (
    <>
      <div className="relative pb-20">
        <SocialFeedScreen
          posts={tripPosts}
          userPreferences={userPreferences}
          onUpdatePreferences={setUserPreferences}
          onSavePost={handleSavePost}
          onSharePost={handleSharePost}
          onRepostPost={handleRepostPost}
          savedPostIds={savedPostIds}
        />
      </div>
      <BottomTabNavigation
        activeTab="home"
        onTabChange={(tab) => {
          if (tab === 'adventures') navigate('/adventures');
          if (tab === 'create') navigate('/create');
          if (tab === 'chat') navigate('/chat');
          if (tab === 'profile') navigate('/profile');
        }}
      />
      <ShareModal
        isOpen={sharePost !== null}
        onClose={() => setSharePost(null)}
        post={sharePost}
      />
    </>
  );
}

// Adventures Page - Pinterest-style boards (/adventures)
function AdventuresPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="relative pb-20">
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
          <div className="max-w-lg mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">My Adventures</h1>
            <p className="text-gray-600 mb-8">
              Create adventure boards for your upcoming trips. Coming soon! 🚀
            </p>
            
            {/* Placeholder for now */}
            <div className="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-gray-300">
              <p className="text-gray-500">
                Pinterest-style adventure boards coming soon!
              </p>
            </div>
          </div>
        </div>
      </div>
      <BottomTabNavigation
        activeTab="adventures"
        onTabChange={(tab) => {
          if (tab === 'home') navigate('/home');
          if (tab === 'create') navigate('/create');
          if (tab === 'chat') navigate('/chat');
          if (tab === 'profile') navigate('/profile');
        }}
      />
    </>
  );
}

// Create Post Page (/create)
function CreatePage() {
  const { user, setTripPosts } = useAppContext();
  const navigate = useNavigate();

  const handleCreatePost = (postData: Omit<TripPost, 'id' | 'createdAt' | 'stats' | 'author'>) => {
    const newPost: TripPost = {
      ...postData,
      id: `post_${Date.now()}`,
      author: {
        id: user!.id,
        name: user!.name,
        username: user!.username,
        avatar: user!.avatar,
      },
      createdAt: new Date().toISOString(),
      stats: {
        saves: 0,
        reposts: 0,
        shares: 0,
        views: 0,
      },
    };

    setTripPosts(prev => [newPost, ...prev]);
    navigate('/profile');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <CreatePostScreen
      onCreatePost={handleCreatePost}
      onCancel={handleCancel}
      currentUserId={user!.id}
      currentUserName={user!.name}
      currentUserAvatar={user!.avatar}
      currentUserUsername={user!.username}
    />
  );
}

// Chat Page (/chat)
function ChatPage() {
  const navigate = useNavigate();

  const handleChatClick = (chatId: string) => {
    toast.info('Full messaging coming soon!');
  };

  return (
    <>
      <div className="relative pb-20">
        <ChatScreen chats={mockChats} onChatClick={handleChatClick} />
      </div>
      <BottomTabNavigation
        activeTab="chat"
        onTabChange={(tab) => {
          if (tab === 'home') navigate('/home');
          if (tab === 'adventures') navigate('/adventures');
          if (tab === 'create') navigate('/create');
          if (tab === 'profile') navigate('/profile');
        }}
      />
    </>
  );
}

// Profile Page - Own profile (/profile)
function ProfilePage() {
  const { user, tripPosts, savedPostIds, repostedPostIds } = useAppContext();
  const navigate = useNavigate();

  // Filter posts created by current user
  const myPosts = tripPosts.filter(post => post.userId === user!.id);
  
  // Filter saved posts
  const savedPosts = tripPosts.filter(post => savedPostIds.has(post.id));
  
  // Filter reposted posts
  const myReposts = tripPosts.filter(post => repostedPostIds.has(post.id) && post.userId !== user!.id);

  return (
    <>
      <div className="relative pb-20">
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
          <div className="max-w-lg mx-auto px-4 py-8">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                {user!.avatar ? (
                  <img
                    src={user!.avatar}
                    alt={user!.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-green-200 flex items-center justify-center">
                    <span className="text-green-700 text-2xl font-bold">
                      {user!.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-gray-900">{user!.name}</h1>
                  {user!.username && (
                    <p className="text-gray-600">@{user!.username}</p>
                  )}
                  {user!.location && (
                    <p className="text-sm text-gray-500 mt-1">📍 {user!.location}</p>
                  )}
                </div>
                {/* Settings/Sign Out */}
                <div className="ml-auto">
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10"
                      }
                    }}
                  />
                </div>
              </div>
              
              {user!.bio && (
                <p className="text-gray-700 mb-4">{user!.bio}</p>
              )}

              {/* Stats */}
              <div className="flex gap-6 text-center border-t border-gray-100 pt-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{myPosts.length}</p>
                  <p className="text-xs text-gray-600">Posts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{savedPosts.length}</p>
                  <p className="text-xs text-gray-600">Saved</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{user!.visitedCountries?.length || 0}</p>
                  <p className="text-xs text-gray-600">Countries</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
              <div className="flex gap-4 border-b border-gray-200">
                <button className="pb-2 px-2 font-semibold text-green-600 border-b-2 border-green-600">
                  My Posts ({myPosts.length})
                </button>
                <button className="pb-2 px-2 font-medium text-gray-500">
                  Saved ({savedPosts.length})
                </button>
                <button className="pb-2 px-2 font-medium text-gray-500">
                  Reposts ({myReposts.length})
                </button>
              </div>
            </div>

            {/* Posts Grid (Placeholder) */}
            {myPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No posts yet</p>
                <button
                  onClick={() => navigate('/create')}
                  className="bg-green-600 text-white px-6 py-2 rounded-full font-medium hover:bg-green-700"
                >
                  Create Your First Post
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {myPosts.map(post => (
                  <div
                    key={post.id}
                    className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                  >
                    <img
                      src={post.images[0]}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <BottomTabNavigation
        activeTab="profile"
        onTabChange={(tab) => {
          if (tab === 'home') navigate('/home');
          if (tab === 'adventures') navigate('/adventures');
          if (tab === 'create') navigate('/create');
          if (tab === 'chat') navigate('/chat');
        }}
      />
    </>
  );
}

// User Profile Page - View other users (/profile/:userId)
function UserProfilePage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="relative pb-20">
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
          <div className="max-w-lg mx-auto px-4 py-8">
            <p className="text-gray-600">User profile view coming soon!</p>
          </div>
        </div>
      </div>
      <BottomTabNavigation
        activeTab="profile"
        onTabChange={(tab) => {
          if (tab === 'home') navigate('/home');
          if (tab === 'adventures') navigate('/adventures');
          if (tab === 'create') navigate('/create');
          if (tab === 'chat') navigate('/chat');
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
