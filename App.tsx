import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { User, AdventureRequest, Adventure } from './types';
import { HomePage as LandingPageComponent } from './components/HomePage';
import { OnboardingScreen } from './components/OnboardingScreen';
import { FeedTab } from './components/FeedTab';
import { AdventuresTab } from './components/AdventuresTab';
import { ProfileTab } from './components/ProfileTab';
import { BottomTabNavigation } from './components/BottomTabNavigation';
import { CreateAdventureWizard } from './components/CreateAdventureWizard';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { mockAdventures } from './data/mockData';

interface SavedTrip {
  adventure: Adventure;
  rating: number;
}

// Context to share user state across routes
const UserContext = React.createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  adventureRequests: AdventureRequest[];
  setAdventureRequests: React.Dispatch<React.SetStateAction<AdventureRequest[]>>;
  savedTrips: SavedTrip[];
  setSavedTrips: React.Dispatch<React.SetStateAction<SavedTrip[]>>;
  discardedTrips: Adventure[];
  setDiscardedTrips: React.Dispatch<React.SetStateAction<Adventure[]>>;
} | null>(null);

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [adventureRequests, setAdventureRequests] = useState<AdventureRequest[]>([]);
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [discardedTrips, setDiscardedTrips] = useState<Adventure[]>([]);

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      adventureRequests, 
      setAdventureRequests,
      savedTrips,
      setSavedTrips,
      discardedTrips,
      setDiscardedTrips
    }}>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/get-started" element={<GetStartedPage />} />
          <Route path="/home" element={user ? <FeedPage /> : <Navigate to="/get-started" />} />
          <Route path="/adventures" element={user ? <AdventuresPage /> : <Navigate to="/get-started" />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/get-started" />} />
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
    </UserContext.Provider>
  );
}

// Landing Page Component (/)
function LandingPage() {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/get-started');
  };

  return <LandingPageComponent onGetStarted={handleGetStarted} />;
}

// Get Started / Onboarding Page (/get-started)
function GetStartedPage() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleOnboardingComplete = (newUser: User) => {
    setUser(newUser);
    navigate('/home');
  };

  return <OnboardingScreen onComplete={handleOnboardingComplete} />;
}

// Feed Page Component (/home) - Feed with adventure suggestions
function FeedPage() {
  const { user, savedTrips, setSavedTrips, discardedTrips, setDiscardedTrips } = useUser();
  const navigate = useNavigate();

  const handleSaveTrip = (adventure: Adventure, rating: number) => {
    setSavedTrips(prev => {
      if (prev.find(item => item.adventure.id === adventure.id)) {
        return prev;
      }
      return [...prev, { adventure, rating }];
    });
  };

  const handleDiscardTrip = (adventure: Adventure) => {
    setDiscardedTrips(prev => [...prev, adventure]);
  };

  return (
    <>
      <div className="relative pb-20">
        <FeedTab 
          adventures={mockAdventures}
          onSaveTrip={handleSaveTrip}
          onDiscardTrip={handleDiscardTrip}
          startLocation={user?.location || ''}
        />
      </div>
      <BottomTabNavigation
        activeTab="feed"
        onTabChange={(tab) => {
          if (tab === 'adventures') navigate('/adventures');
          if (tab === 'profile') navigate('/profile');
        }}
      />
    </>
  );
}

// Adventures Page Component (/adventures)
function AdventuresPage() {
  const { user, adventureRequests, setAdventureRequests, savedTrips, setSavedTrips } = useUser();
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const navigate = useNavigate();

  const handleCreateAdventureRequest = (request: AdventureRequest) => {
    setAdventureRequests(prev => [...prev, request]);
    
    if (request.mode === 'individual') {
      toast.success('Generating your adventure! ✨', {
        description: 'This may take a moment...',
      });
      
      // Simulate adventure generation
      setTimeout(() => {
        // Update request status
        setAdventureRequests(prev => 
          prev.map(r => r.id === request.id ? { ...r, status: 'completed' as const } : r)
        );
        
        toast.success('Adventure ready! 🎉', {
          description: 'Check it out in the Adventures tab!',
        });
      }, 2000);
    } else {
      // Group mode - just created
      toast.info('Invites sent! 👥', {
        description: 'Waiting for group members to join...',
      });
    }
  };

  const handleSaveTrip = (adventure: Adventure, rating: number) => {
    setSavedTrips(prev => {
      if (prev.find(item => item.adventure.id === adventure.id)) {
        return prev;
      }
      return [...prev, { adventure, rating }];
    });
  };

  return (
    <>
      <div className="relative pb-20">
        <AdventuresTab
          adventureRequests={adventureRequests}
          adventures={mockAdventures}
          onCreateNew={() => setShowCreateWizard(true)}
          onSaveToFolder={(folderId: string, adventure: Adventure, rating: number) => handleSaveTrip(adventure, rating)}
          user={user!}
        />
      </div>
      <BottomTabNavigation
        activeTab="adventures"
        onTabChange={(tab) => {
          if (tab === 'feed') navigate('/home');
          if (tab === 'profile') navigate('/profile');
        }}
      />
      <CreateAdventureWizard
        isOpen={showCreateWizard}
        onClose={() => setShowCreateWizard(false)}
        onCreateAdventure={handleCreateAdventureRequest}
        user={user!}
      />
    </>
  );
}

// Profile Page Component (/profile)
function ProfilePage() {
  const { user, setUser, savedTrips, setSavedTrips } = useUser();
  const navigate = useNavigate();

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleRemoveSavedTrip = (adventureId: string) => {
    setSavedTrips(prev => prev.filter(item => item.adventure.id !== adventureId));
    toast.success('Trip removed from saved');
  };

  return (
    <>
      <div className="relative pb-20">
        <ProfileTab
          user={user!}
          onUpdateUser={handleUpdateUser}
          savedTrips={savedTrips}
          onRemoveSavedTrip={handleRemoveSavedTrip}
        />
      </div>
      <BottomTabNavigation
        activeTab="profile"
        onTabChange={(tab) => {
          if (tab === 'feed') navigate('/home');
          if (tab === 'adventures') navigate('/adventures');
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
