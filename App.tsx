import React, { useState } from 'react';
import { User, AdventureRequest, Adventure } from './types';
import { OnboardingScreen } from './components/OnboardingScreen';
import { FeedTab } from './components/FeedTab';
import { AdventuresTab } from './components/AdventuresTab';
import { ProfileTab } from './components/ProfileTab';
import { BottomTabNavigation } from './components/BottomTabNavigation';
import { CreateAdventureWizard } from './components/CreateAdventureWizard';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { mockAdventures } from './data/mockData';

type Screen = 'onboarding' | 'main';
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
