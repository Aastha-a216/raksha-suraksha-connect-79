import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  blood_group?: string;
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
      setSession(session);
      setUser(session?.user ?? null);
      fetchUserProfile(session?.user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        await fetchUserProfile(session?.user);
        setLoading(false);
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
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const sendOTP = async (phoneNumber: string): Promise<void> => {
    try {
      // Demo mode - simulate OTP sending
      if (!import.meta.env.VITE_SUPABASE_URL) {
        console.log('Demo mode: OTP would be sent to', phoneNumber);
        return;
      }

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
      // Demo mode - simulate successful OTP verification with any 6-digit code
      if (!import.meta.env.VITE_SUPABASE_URL) {
        if (otp.length === 6) {
          const mockUser = {
            id: 'demo-user-' + Date.now(),
            phone: phoneNumber,
            email: null,
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setUser(mockUser as any);
          return;
        } else {
          throw new Error('Please enter a 6-digit OTP');
        }
      }

      const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms'
      });

      if (error) {
        console.error('Error verifying OTP:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>): Promise<void> => {
    if (!user) throw new Error('No user logged in');

    const updatedProfile = {
      id: user.id,
      phone: user.phone || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...userProfile,
      ...profileData
    };

    try {
      // Demo mode - just update local state
      if (!import.meta.env.VITE_SUPABASE_URL) {
        setUserProfile(updatedProfile as UserProfile);
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(updatedProfile);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      setUserProfile(updatedProfile as UserProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      setUser(null);
      setSession(null);
      setUserProfile(null);
    } catch (error) {
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
