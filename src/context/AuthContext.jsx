import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const userId = session?.user?.id;

  useEffect(() => {
    if (!supabase || !userId) {
      setIsAdmin(false);
      return;
    }
    let cancelled = false;
    supabase.rpc('is_admin').then(({ data, error }) => {
      if (!cancelled) setIsAdmin(!error && data === true);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) throw error;
    return { needsConfirmation: !data.session };
  }

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function requestPasswordReset(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    if (error) throw error;
  }

  async function updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  }

  const value = {
    user: session?.user ?? null,
    isAdmin,
    authLoading,
    signUp,
    signIn,
    signOut,
    requestPasswordReset,
    updatePassword,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}