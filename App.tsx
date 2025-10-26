import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { User, AdventureRequest, Adventure } from './types';
import { HomePage as LandingPageComponent } from './components/HomePage';
import { OnboardingScreen } from './components/OnboardingScreen';
import { FeedTab } from './components/FeedTab';
import { AdventuresTab } from './components/AdventuresTab';
import { ProfileTab } from './components/ProfileTab';
import { BottomTabNavigation } from './components/BottomTabNavigation';
import { CreateAdventureWizard } from './components/CreateAdventureWizard';
import { GroupJoinScreen } from './components/GroupJoinScreen';
import { InviteOnboardingScreen } from './components/InviteOnboardingScreen';
import { GroupAdventureManagement } from './components/GroupAdventureManagement';
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
  groupInviteId: string | null;
  setGroupInviteId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedGroupAdventure: AdventureRequest | null;
  setSelectedGroupAdventure: React.Dispatch<React.SetStateAction<AdventureRequest | null>>;
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
  const [groupInviteId, setGroupInviteId] = useState<string | null>(null);
  const [selectedGroupAdventure, setSelectedGroupAdventure] = useState<AdventureRequest | null>(null);

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      adventureRequests, 
      setAdventureRequests,
      savedTrips,
      setSavedTrips,
      discardedTrips,
      setDiscardedTrips,
      groupInviteId,
      setGroupInviteId,
      selectedGroupAdventure,
      setSelectedGroupAdventure
    }}>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/get-started" element={<GetStartedPage />} />
          <Route path="/home" element={user ? <FeedPage /> : <Navigate to="/get-started" />} />
          <Route path="/adventures" element={user ? <AdventuresPage /> : <Navigate to="/get-started" />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/get-started" />} />
          <Route path="/join/:inviteId" element={<GroupJoinPage />} />
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

<<<<<<< HEAD
=======
  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleGroupJoin = (memberName: string) => {
    if (groupInviteId) {
      // Find the adventure request by invite ID
      const adventureRequest = adventureRequests.find(req => req.id === groupInviteId);
      
      if (adventureRequest) {
        // Add the new member to the group
        const updatedRequest = {
          ...adventureRequest,
          groupMembers: [
            ...(adventureRequest.groupMembers || []),
            {
              id: Math.random().toString(36).substring(7),
              name: memberName,
              email: '',
              avatar: '',
              budget: 1000,
              preferences: []
            }
          ]
        };
        
        setAdventureRequests(prev => 
          prev.map(req => req.id === groupInviteId ? updatedRequest : req)
        );
        
        toast.success(`${memberName} joined the group! 🎉`);
      }
    }
  };

  const handleInviteOnboardingComplete = (newUser: User, adventureId: string) => {
    console.log('Invite onboarding complete for user:', newUser.name, 'adventureId:', adventureId);
    // Set the user as logged in
    setUser(newUser);
    
    // Find the adventure request and add the user as a member
    const adventureRequest = adventureRequests.find(req => req.id === adventureId);
    console.log('Found adventure request:', adventureRequest);
    if (adventureRequest) {
      const updatedRequest = {
        ...adventureRequest,
        groupMembers: [
          ...(adventureRequest.groupMembers || []),
          {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
            budget: newUser.budget,
            preferences: newUser.interests
          }
        ]
      };
      
      // Update the adventure request in the list
      setAdventureRequests(prev => {
        const updated = prev.map(req => req.id === adventureId ? updatedRequest : req);
        console.log('Updated adventure requests:', updated);
        return updated;
      });
      
      // If the adventure request doesn't exist in the user's list, add it
      setAdventureRequests(prev => {
        const exists = prev.find(req => req.id === adventureId);
        if (!exists) {
          console.log('Adding new adventure request to user list:', updatedRequest);
          return [...prev, updatedRequest];
        }
        console.log('Adventure request already exists in user list');
        return prev;
      });
      
      setSelectedGroupAdventure(updatedRequest);
      setCurrentScreen('group-management');
      
      toast.success(`Welcome to the adventure, ${newUser.name}! 🎉`);
    } else {
      // If adventure request doesn't exist, create a placeholder for the invited user
      const newAdventureRequest = {
        id: adventureId,
        name: 'Group Adventure',
        userId: newUser.id,
        mode: 'group' as const,
        numberOfDays: 3,
        activities: [],
        customActivities: [],
        transportation: '',
        groupMembers: [{
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar,
          budget: newUser.budget,
          preferences: newUser.interests
        }],
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
      };
      
      setAdventureRequests(prev => [...prev, newAdventureRequest]);
      setSelectedGroupAdventure(newAdventureRequest);
      setCurrentScreen('group-management');
      
      toast.success(`Welcome to the adventure, ${newUser.name}! 🎉`);
    }
  };

  const handleGroupManagementBack = () => {
    setCurrentScreen('main');
    setSelectedGroupAdventure(null);
  };

  const handleBackToApp = () => {
    setCurrentScreen('main');
    setSelectedGroupAdventure(null);
    setActiveTab('adventures'); // Switch to adventures tab to show the group adventure
  };

  const handleGroupAdventureClick = (adventureRequest: AdventureRequest) => {
    setSelectedGroupAdventure(adventureRequest);
    setCurrentScreen('group-management');
  };

>>>>>>> d7849e4b (added grouping links)
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
<<<<<<< HEAD
      </div>
      <BottomTabNavigation
        activeTab="profile"
        onTabChange={(tab) => {
          if (tab === 'feed') navigate('/home');
          if (tab === 'adventures') navigate('/adventures');
=======
      )}

      {currentScreen === 'invite-onboarding' && groupInviteId && (
        <InviteOnboardingScreen 
          inviteId={groupInviteId} 
          onComplete={handleInviteOnboardingComplete} 
        />
      )}

      {currentScreen === 'group-management' && selectedGroupAdventure && user && (
        <GroupAdventureManagement 
          adventureRequest={selectedGroupAdventure}
          currentUser={user}
          onBack={handleGroupManagementBack}
          onBackToApp={handleBackToApp}
          onShareLink={(link) => {
            navigator.clipboard.writeText(link);
            toast.success('Link copied to clipboard!');
          }}
        />
      )}

      {currentScreen === 'main' && user && (
        <>
          {/* Tab Content */}
          <div className="relative">
            {activeTab === 'feed' && (
              <FeedTab 
                adventures={mockAdventures}
                onSaveTrip={handleSaveTrip}
                onDiscardTrip={handleDiscardTrip}
                startLocation={user.location}
              />
            )}
            {activeTab === 'adventures' && (
              <AdventuresTab
                adventureRequests={adventureRequests}
                adventures={mockAdventures}
                onCreateNew={() => setShowCreateWizard(true)}
                onSaveToFolder={(folderId: string, adventure: Adventure, rating: number) => handleSaveTrip(adventure, rating)}
                onGroupAdventureClick={handleGroupAdventureClick}
                user={user}
              />
            )}
            {activeTab === 'profile' && (
              <ProfileTab
                user={user}
                onUpdateUser={handleUpdateUser}
                savedTrips={savedTrips}
                onRemoveSavedTrip={handleRemoveSavedTrip}
              />
            )}
          </div>

          {/* Bottom Tab Navigation */}
          <BottomTabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Create Adventure Wizard */}
          <CreateAdventureWizard
            isOpen={showCreateWizard}
            onClose={() => setShowCreateWizard(false)}
            onCreateAdventure={handleCreateAdventureRequest}
            user={user}
          />
        </>
      )}

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
    </>
  );
}

// Group Join Page Component (/join/:inviteId)
function GroupJoinPage() {
  const { user, setUser, adventureRequests, setAdventureRequests, setGroupInviteId, setSelectedGroupAdventure } = useUser();
  const navigate = useNavigate();
  const { inviteId } = useParams<{ inviteId: string }>();

  const handleInviteOnboardingComplete = (newUser: User, adventureId: string) => {
    setUser(newUser);
    
    const adventureRequest = adventureRequests.find(req => req.id === adventureId);
    if (adventureRequest) {
      const updatedRequest = {
        ...adventureRequest,
        groupMembers: [
          ...(adventureRequest.groupMembers || []),
          {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
            budget: newUser.budget,
            preferences: newUser.interests
          }
        ]
      };
      
      setAdventureRequests(prev => 
        prev.map(req => req.id === adventureId ? updatedRequest : req)
      );
      
      setAdventureRequests(prev => {
        const exists = prev.find(req => req.id === adventureId);
        if (!exists) {
          return [...prev, updatedRequest];
        }
        return prev;
      });
      
      setSelectedGroupAdventure(updatedRequest);
      navigate('/group-management');
      toast.success(`Welcome to the adventure, ${newUser.name}! 🎉`);
    } else {
      const newAdventureRequest = {
        id: adventureId,
        name: 'Group Adventure',
        userId: newUser.id,
        mode: 'group' as const,
        numberOfDays: 3,
        activities: [],
        customActivities: [],
        transportation: '',
        groupMembers: [{
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar,
          budget: newUser.budget,
          preferences: newUser.interests
        }],
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
      };
      
      setAdventureRequests(prev => [...prev, newAdventureRequest]);
      setSelectedGroupAdventure(newAdventureRequest);
      navigate('/group-management');
      toast.success(`Welcome to the adventure, ${newUser.name}! 🎉`);
    }
  };

  if (!inviteId) {
    return <Navigate to="/" />;
  }

  if (user) {
    const adventureRequest = adventureRequests.find(req => req.id === inviteId);
    if (adventureRequest) {
      setSelectedGroupAdventure(adventureRequest);
      navigate('/group-management');
      return null;
    }
  }

  return <InviteOnboardingScreen inviteId={inviteId} onComplete={handleInviteOnboardingComplete} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
