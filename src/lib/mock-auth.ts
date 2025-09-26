import type { User } from '@/lib/types';

// Create a fresh user with minimal data for onboarding
const createFreshUser = (): User => ({
  id: `user-${Date.now()}`,
  name: 'New User',
  email: 'user@example.com',
  profilePic: {
    id: 'default-profile',
    imageUrl: '/api/placeholder/150/150',
    imageHint: 'Default profile picture',
    description: 'Default user avatar'
  },
  // These will be filled during onboarding
  age: undefined,
  interests: undefined,
  personalityTraits: undefined,
  relationshipGoals: undefined,
  consentToMatch: false,
  preferences: undefined,
  profileSummary: undefined
});

// Mock authentication state
let currentUser: User | null = null;
let isAuthenticated = false;

export const mockAuth = {
  getCurrentUser: () => currentUser,
  isAuthenticated: () => isAuthenticated,
  
  signIn: async () => {
    // Simulate sign-in delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    currentUser = createFreshUser();
    isAuthenticated = true;
    triggerAuthStateChange();
    return currentUser;
  },
  
  signOut: async () => {
    currentUser = null;
    isAuthenticated = false;
    triggerAuthStateChange();
  },
  
  updateProfile: async (updates: Partial<User>) => {
    if (currentUser) {
      currentUser = { ...currentUser, ...updates };
    }
    return currentUser;
  }
};

// Mock auth state listeners
const authListeners: ((user: User | null) => void)[] = [];

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  authListeners.push(callback);
  // Immediately call with current state
  callback(currentUser);
  
  // Return unsubscribe function
  return () => {
    const index = authListeners.indexOf(callback);
    if (index > -1) {
      authListeners.splice(index, 1);
    }
  };
};

// Helper to trigger auth state changes
export const triggerAuthStateChange = () => {
  authListeners.forEach(callback => callback(currentUser));
};
