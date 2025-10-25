import React, { useState, useEffect } from 'react';
import { User, AdventureRequest, Adventure } from './types';
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

type Screen = 'onboarding' | 'main' | 'group-join' | 'invite-onboarding' | 'group-management';
type Tab = 'feed' | 'adventures' | 'profile';

interface SavedTrip {
  adventure: Adventure;
  rating: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [activeTab, setActiveTab] = useState<Tab>('feed');
  const [user, setUser] = useState<User | null>(null);
  const [adventureRequests, setAdventureRequests] = useState<AdventureRequest[]>([]);
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [discardedTrips, setDiscardedTrips] = useState<Adventure[]>([]);
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [groupInviteId, setGroupInviteId] = useState<string | null>(null);
  const [selectedGroupAdventure, setSelectedGroupAdventure] = useState<AdventureRequest | null>(null);

  // Handle routing based on URL
  useEffect(() => {
    const handleRoute = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      
      // Check for group join URL pattern: /join/{inviteId}
      const joinMatch = path.match(/\/join\/(.+)/);
      if (joinMatch) {
        const inviteId = joinMatch[1];
        setGroupInviteId(inviteId);
        // If user is already logged in, go to group management
        if (user) {
          const adventureRequest = adventureRequests.find(req => req.id === inviteId);
          if (adventureRequest) {
            setSelectedGroupAdventure(adventureRequest);
            setCurrentScreen('group-management');
          } else {
            setCurrentScreen('invite-onboarding');
          }
        } else {
          setCurrentScreen('invite-onboarding');
        }
        return;
      }
      
      // Default routing
      if (user) {
        setCurrentScreen('main');
      } else {
        setCurrentScreen('onboarding');
      }
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, [user]);

  const handleOnboardingComplete = (newUser: User) => {
    setUser(newUser);
    setCurrentScreen('main');
    setActiveTab('feed');
  };

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
        
        // Switch to adventures tab
        setActiveTab('adventures');
      }, 2000);
    } else {
      // Group mode - just created
      toast.info('Invites sent! 👥', {
        description: 'Waiting for group members to join...',
      });
      
      // Switch to adventures tab
      setActiveTab('adventures');
    }
  };

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
    // Set the user as logged in
    setUser(newUser);
    
    // Find the adventure request and add the user as a member
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
      
      setSelectedGroupAdventure(updatedRequest);
      setCurrentScreen('group-management');
      
      toast.success(`Welcome to the adventure, ${newUser.name}! 🎉`);
    }
  };

  const handleGroupManagementBack = () => {
    setCurrentScreen('main');
    setSelectedGroupAdventure(null);
  };

  const handleGroupAdventureClick = (adventureRequest: AdventureRequest) => {
    setSelectedGroupAdventure(adventureRequest);
    setCurrentScreen('group-management');
  };

  const handleSaveTrip = (adventure: Adventure, rating: number) => {
    setSavedTrips(prev => {
      // Check if already saved
      if (prev.find(item => item.adventure.id === adventure.id)) {
        return prev;
      }
      return [...prev, { adventure, rating }];
    });
  };

  const handleRemoveSavedTrip = (adventureId: string) => {
    setSavedTrips(prev => prev.filter(item => item.adventure.id !== adventureId));
    toast.success('Trip removed from saved');
  };

  const handleDiscardTrip = (adventure: Adventure) => {
    setDiscardedTrips(prev => [...prev, adventure]);
  };

  return (
    <div className="min-h-screen bg-white">
      {currentScreen === 'onboarding' && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}

      {currentScreen === 'group-join' && groupInviteId && (
        <GroupJoinScreen 
          inviteId={groupInviteId} 
          onJoin={handleGroupJoin} 
        />
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
    </div>
  );
}
