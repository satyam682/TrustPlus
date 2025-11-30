
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthChange, getCurrentUser } from '../../services/auth';
import { loadUserData, saveApp, saveFeedback, deleteApp as deleteAppFirestore, saveUserProfile } from '../../services/firestore';

// Types
export interface AppData {
  id: string;
  name: string;
  url: string;
  platform: string;
  iconBg: string;
  status: 'active' | 'paused';
  createdAt: string;
  description?: string;
}

export interface FeedbackData {
  id: number;
  appId: string;
  appName: string;
  user: string;
  email?: string;
  time: string;
  timestamp: string;
  content: string;
  rating: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  tags: string[];
  isVerified: boolean;
}

export interface UserData {
  name: string;
  email: string;
  company: string;
  jobTitle: string;
  photoUrl: string | null;
}

export interface FlaggedFeedbackData extends FeedbackData {
  detectionReason: string;
  detectedIssues: string[];
  confidence: number;
  category: 'suspicious' | 'fake';
}

interface DataContextType {
  apps: AppData[];
  feedbacks: FeedbackData[];
  flaggedFeedback: FlaggedFeedbackData[];
  user: UserData;
  theme: 'light' | 'dark';
  isAuthenticated: boolean;
  isLoading: boolean;
  addApp: (app: Omit<AppData, 'id' | 'createdAt' | 'iconBg' | 'status'>, customId?: string) => Promise<void>;
  addFeedback: (feedback: Omit<FeedbackData, 'id' | 'timestamp' | 'time' | 'sentiment' | 'tags' | 'isVerified'>) => Promise<void>;
  addFlaggedFeedback: (feedback: Omit<FlaggedFeedbackData, 'id' | 'timestamp' | 'time' | 'sentiment' | 'tags' | 'isVerified'>) => Promise<void>;
  updateUser: (data: Partial<UserData>) => Promise<void>;
  toggleTheme: (theme: 'light' | 'dark') => void;
  deleteApp: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const defaultUser: UserData = {
  name: "User",
  email: "",
  company: "",
  jobTitle: "",
  photoUrl: null
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apps, setApps] = useState<AppData[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [flaggedFeedback, setFlaggedFeedback] = useState<FlaggedFeedbackData[]>([]);
  const [user, setUser] = useState<UserData>(defaultUser);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in
        setIsAuthenticated(true);
        setCurrentUserId(firebaseUser.uid);

        // Load user data from Firestore
        try {
          const data = await loadUserData(firebaseUser.uid);

          if (data.profile) {
            setUser(data.profile);
          } else {
            // Set basic info from Firebase Auth
            setUser({
              name: firebaseUser.displayName || "User",
              email: firebaseUser.email || "",
              company: "",
              jobTitle: "",
              photoUrl: firebaseUser.photoURL
            });
          }

          setApps(data.apps);
          setFeedbacks(data.feedback);
          setFlaggedFeedback(data.flaggedFeedback || []);
        } catch (error) {
          console.error('Error loading user data:', error);
        }

        setIsLoading(false);
      } else {
        // User is logged out
        setIsAuthenticated(false);
        setCurrentUserId(null);
        setApps([]);
        setFeedbacks([]);
        setFlaggedFeedback([]);
        setUser(defaultUser);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Theme effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#111827';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
    }
  }, [theme]);

  // Add app function with Firestore sync
  const addApp = async (newApp: Omit<AppData, 'id' | 'createdAt' | 'iconBg' | 'status'>, customId?: string) => {
    if (!currentUserId) {
      console.error('No user logged in');
      throw new Error('User not authenticated');
    }

    const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-500', 'bg-pink-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const app: AppData = {
      ...newApp,
      id: customId || `app_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'active',
      iconBg: randomColor
    };

    try {
      // Save to Firestore
      await saveApp(currentUserId, app);

      // Update local state
      setApps(prev => [app, ...prev]);
    } catch (error) {
      console.error('Error adding app:', error);
      throw error;
    }
  };

  // Add feedback function with Firestore sync
  const addFeedback = async (newFeedback: Omit<FeedbackData, 'id' | 'timestamp' | 'time' | 'sentiment' | 'tags' | 'isVerified'>) => {
    if (!currentUserId) {
      console.error('No user logged in');
      return;
    }

    // Simple sentiment analysis
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (newFeedback.rating >= 4) sentiment = 'positive';
    else if (newFeedback.rating <= 2) sentiment = 'negative';

    const feedback: FeedbackData = {
      ...newFeedback,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      time: "Just now",
      sentiment,
      tags: ["New"],
      isVerified: true
    };

    try {
      // Save to Firestore
      await saveFeedback(currentUserId, feedback);

      // Update local state
      setFeedbacks(prev => [feedback, ...prev]);
    } catch (error) {
      console.error('Error adding feedback:', error);
      throw error;
    }
  };

  // Update user function with Firestore sync
  const updateUser = async (data: Partial<UserData>) => {
    if (!currentUserId) {
      console.error('No user logged in');
      return;
    }

    const updatedUser = { ...user, ...data };

    try {
      // Save to Firestore
      await saveUserProfile(currentUserId, updatedUser);

      // Update local state
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  // Toggle theme (keep in localStorage for now)
  const toggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('tp_theme', newTheme);
  };

  // Delete app with Firestore sync
  const deleteApp = async (id: string) => {
    if (!currentUserId) {
      console.error('No user logged in');
      return;
    }

    try {
      // Delete from Firestore
      await deleteAppFirestore(currentUserId, id);

      // Update local state
      setApps(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting app:', error);
      throw error;
    }
  };

  // Add flagged feedback (detected as fake/spam)
  const addFlaggedFeedback = async (newFeedback: Omit<FlaggedFeedbackData, 'id' | 'timestamp' | 'time' | 'sentiment' | 'tags' | 'isVerified'>) => {
    if (!currentUserId) {
      console.error('No user logged in');
      return;
    }

    const feedback: FlaggedFeedbackData = {
      ...newFeedback,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      time: "Just now",
      sentiment: 'negative',
      tags: ["Flagged", "AI-Detected"],
      isVerified: false
    };

    // No Firestore save needed for now - just keep in memory
    setFlaggedFeedback(prev => [feedback, ...prev]);
  };

  return (
    <DataContext.Provider value={{
      apps,
      feedbacks,
      flaggedFeedback,
      user,
      theme,
      isAuthenticated,
      isLoading,
      addApp,
      addFeedback,
      addFlaggedFeedback,
      updateUser,
      toggleTheme,
      deleteApp
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
