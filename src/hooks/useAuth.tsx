import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkIsAdmin = useCallback(async (userId: string) => {
    // Prefer RPC (security definer), but fall back to direct table read if RPC hangs/errors.
    const rpcPromise = supabase.rpc('is_admin', { _user_id: userId }) as unknown as Promise<{
      data: unknown;
      error: unknown;
    }>;

    const timeoutPromise = new Promise<{ data: unknown; error: unknown }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error('Admin check timeout') }), 2500)
    );

    try {
      const { data, error } = await Promise.race([rpcPromise, timeoutPromise]);
      if (!error && typeof data === 'boolean') return data;
    } catch {
      // ignore and fall back
    }

    const { data: row, error: selectError } = await supabase
      .from('admin_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    if (selectError) {
      console.error('Admin check fallback error:', selectError);
      return false;
    }

    return !!row;
  }, []);

  const applySession = useCallback(
    async (nextSession: Session | null) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      try {
        if (nextSession?.user) {
          const admin = await checkIsAdmin(nextSession.user.id);
          setIsAdmin(admin);
        } else {
          setIsAdmin(false);
        }
      } catch (e) {
        console.error('applySession error:', e);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    },
    [checkIsAdmin]
  );

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        void applySession(newSession);
      }
    );

    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      void applySession(existingSession);
    });

    return () => subscription.unsubscribe();
  }, [applySession]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    // Important: update local state even if onAuthStateChange doesn't fire in some environments
    if (!error) {
      await applySession(data.session ?? null);
    }

    return { error: error ? new Error(error.message) : null };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    return { error: error ? new Error(error.message) : null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    return { error: error ? new Error(error.message) : null };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error: error ? new Error(error.message) : null };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAdmin,
      isLoading,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
    }}>
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
