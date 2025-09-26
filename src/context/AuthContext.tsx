"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth, createUserProfile, getUserProfile, updateUserProfile, signInWithGoogle, logOut } from '@/lib/firebase';
import { mockAuth, onAuthStateChanged as mockOnAuthStateChanged } from '@/lib/mock-auth';
import type { User } from '@/lib/types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCK) {
      const unsubscribe = mockOnAuthStateChanged((mockUser) => {
        setUser(mockUser);
        setFirebaseUser(null);
        setLoading(false);
      });
      return unsubscribe;
    } else {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setFirebaseUser(firebaseUser);
        
        if (firebaseUser) {
          // Get or create user profile
          let userProfile = await getUserProfile(firebaseUser.uid);
          
          if (!userProfile) {
            // Create new user profile
            const newUser: Partial<User> = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || '',
              email: firebaseUser.email || '',
              profilePic: {
                id: 'profile-pic',
                imageUrl: firebaseUser.photoURL || '/placeholder-avatar.png',
                imageHint: `Profile picture of ${firebaseUser.displayName || 'user'}`,
                description: `Profile picture of ${firebaseUser.displayName || 'user'}`
              },
              preferences: {
                interests: [],
                hobbies: [],
                likesDislikes: '',
                description: ''
              },
              consentToMatch: false
            };
            
            await createUserProfile(firebaseUser.uid, newUser);
            userProfile = newUser as User;
          }
          
          setUser(userProfile);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      });
      return unsubscribe;
    }
  }, []);

  const signIn = async () => {
    try {
      if (USE_MOCK) {
        await mockAuth.signIn();
        // state will be updated via mock listener
      } else {
        await signInWithGoogle();
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (USE_MOCK) {
        await mockAuth.signOut();
      } else {
        await logOut();
      }
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!firebaseUser && !USE_MOCK) return;
    try {
      if (USE_MOCK) {
        const updated = await mockAuth.updateProfile(updates);
        setUser(updated);
      } else if (firebaseUser) {
        await updateUserProfile(firebaseUser.uid, updates);
        setUser(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const value = {
    user,
    firebaseUser,
    loading,
    signIn,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
