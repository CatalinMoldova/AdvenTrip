import { MOCK_USER, UserProfile } from '@/types/user';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER);
  const [isLoading, setIsLoading] = useState(false);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    // In a real app, this would call your API to update the profile
    // For now, we'll just update the local state
    setUserProfile((prev) => ({ ...prev, ...updates }));
    
    // Example of how you'd integrate with a backend:
    // setIsLoading(true);
    // try {
    //   const response = await fetch('/api/user/profile', {
    //     method: 'PATCH',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(updates),
    //   });
    //   const updatedProfile = await response.json();
    //   setUserProfile(updatedProfile);
    // } catch (error) {
    //   console.error('Failed to update profile:', error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <UserContext.Provider value={{ userProfile, updateUserProfile, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

