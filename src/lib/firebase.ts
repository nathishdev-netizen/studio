import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import type { User } from '@/lib/types';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logOut = () => signOut(auth);

// User data functions
export const createUserProfile = async (userId: string, userData: Partial<User>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Conversation memory functions
export const saveConversationMemory = async (userId: string, memory: {
  keyEvents: string[];
  interests: string[];
  goals: string[];
  challenges: string[];
  achievements: string[];
  preferences: string[];
  relationshipUpdates: string[];
}) => {
  try {
    const memoryRef = collection(db, 'conversationMemories');
    await addDoc(memoryRef, {
      userId,
      ...memory,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error saving conversation memory:', error);
    throw error;
  }
};

export const getConversationMemories = async (userId: string, limitCount: number = 10) => {
  try {
    const memoriesRef = collection(db, 'conversationMemories');
    const q = query(
      memoriesRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting conversation memories:', error);
    return [];
  }
};

// Chat history functions
export const saveChatMessage = async (userId: string, message: {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  moodAnalysis?: any;
}) => {
  try {
    const chatRef = collection(db, 'chatHistory');
    await addDoc(chatRef, {
      userId,
      ...message
    });
  } catch (error) {
    console.error('Error saving chat message:', error);
    throw error;
  }
};

export const getChatHistory = async (userId: string, limitCount: number = 50) => {
  try {
    const chatRef = collection(db, 'chatHistory');
    const q = query(
      chatRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'asc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
};
