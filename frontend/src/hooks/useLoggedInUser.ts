import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { User } from '@supabase/supabase-js';

export const useLoggedInUser = () => {
  const [user, setUser] = useState<User | null>(null); // Use the User type from Supabase
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the user on mount
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      console.log('Fetched user:', data?.user); // Debugging

      if (!error) {
        setUser(data?.user || null);
      }

      setLoading(false);
    };
    
    fetchUser();

    // Listen for authentication state changes
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session?.user); // Debugging
      setUser(session?.user || null);
    });

    // Cleanup the listener when the component unmounts
    return () => {
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  const clearUser = () => {
    setUser(null); // Clear the user state explicitly
  };

  return { user, loading, clearUser };
};
