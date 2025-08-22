import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  user_id: string;
  name: string | null;
  phone: string | null;
  blood_group?: string | null;
  emergency_contacts: Array<{
    name: string;
    phone: string;
  }>;
  language: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  sendOTP: (phoneNumber: string) => Promise<void>;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.phone);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          fetchUserProfile(session.user);
        }, 0);
      }
      setLoading(false);
    });

    // Listen for auth changes - Never use async functions directly as callbacks
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.phone);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Defer profile fetching to prevent deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user);
          }, 0);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (user: User | null) => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else if (data) {
        // Type assertion to handle the Json type from database
        const profile: UserProfile = {
          ...data,
          emergency_contacts: Array.isArray(data.emergency_contacts) 
            ? data.emergency_contacts as Array<{name: string; phone: string}>
            : []
        };
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const sendOTP = async (phoneNumber: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) {
        console.error('Error sending OTP:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  };

  const verifyOTP = async (phoneNumber: string, otp: string): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms'
      });

      if (error) {
        console.error('Error verifying OTP:', error);
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        
        // Fetch or create profile after successful auth
        await fetchUserProfile(data.user);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>): Promise<void> => {
    if (!user) throw new Error('No user logged in');

    const updatedProfile = {
      user_id: user.id,
      phone: user.phone || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      emergency_contacts: [],
      language: 'en',
      ...userProfile,
      ...profileData
    };

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(updatedProfile);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      // Fetch updated profile to ensure we have the latest data
      await fetchUserProfile(user);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      // Check if there's actually a session to sign out
      if (!session) {
        console.log('No session to sign out');
        // Clear local state anyway
        setUser(null);
        setSession(null);
        setUserProfile(null);
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error && error.message !== 'Auth session missing!') {
        console.error('Error signing out:', error);
        throw error;
      }
      
      setUser(null);
      setSession(null);
      setUserProfile(null);
    } catch (error: any) {
      // Don't throw error for session missing - just clear state
      if (error?.message === 'Auth session missing!') {
        console.log('Session already missing, clearing local state');
        setUser(null);
        setSession(null);
        setUserProfile(null);
        return;
      }
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    userProfile,
    loading,
    sendOTP,
    verifyOTP,
    updateProfile,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
