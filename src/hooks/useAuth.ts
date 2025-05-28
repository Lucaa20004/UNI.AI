import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

export type UserRole = 'user' | 'admin';

interface Profile {
  id: string;
  role: UserRole;
  username: string | null;
  updated_at: string;
  created_at: string;
  is_guest: boolean;
}

interface UseAuthReturn {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isGuest: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  continueAsGuest: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(localStorage.getItem('isGuest') === 'true');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Test Supabase connection on initialization
  useEffect(() => {
    supabase.from('profiles').select('*').limit(1)
      .then(({ error }) => {
        if (error) {
          console.error("Supabase connection failed:", error);
          toast({
            title: "Connection Error",
            description: "Failed to connect to Supabase",
            variant: "destructive",
          });
        }
      });
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        setIsGuest(false);
        localStorage.removeItem('isGuest');
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        setIsGuest(false);
        localStorage.removeItem('isGuest');
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: userId,
            role: 'user',
            is_guest: false
          }]);

        if (insertError) throw insertError;
        return fetchProfile(userId); // Retry after creation
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user profile",
        variant: "destructive",
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate('/chat');
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      toast({
        title: "Success",
        description: "Please check your email to confirm your account",
      });
      navigate('/login');
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsGuest(false);
      localStorage.removeItem('isGuest');
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error) {
      console.error('Google sign in error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const continueAsGuest = async () => {
    if (user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ is_guest: true })
          .eq('id', user.id);
        
        if (error) throw error;
      } catch (error) {
        console.error('Error updating guest status:', error);
      }
    }
    setIsGuest(true);
    localStorage.setItem('isGuest', 'true');
    navigate('/chat');
  };

  return {
    user,
    profile,
    loading,
    isGuest,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    continueAsGuest,
  };
}