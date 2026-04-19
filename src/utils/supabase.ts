import { createClient } from '@supabase/supabase-js';

// Variables de entorno — configurar en .env.local:
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJhbGci...
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const isSupabaseConfigured = !!supabase;

// === AUTH HELPERS ===

export type AuthUser = {
  id: string;
  email: string;
  nombre?: string;
  profesion?: string;
  pais?: string;
};

export const authLogin = async (email: string, password: string) => {
  if (!supabase) throw new Error('Supabase no configurado');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
};

export const authRegister = async (email: string, password: string, metadata: Record<string, string>) => {
  if (!supabase) throw new Error('Supabase no configurado');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });
  if (error) throw error;
  return data.user;
};

export const authLogout = async () => {
  if (!supabase) return;
  await supabase.auth.signOut();
};

export const getSession = async () => {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  return {
    id: data.user.id,
    email: data.user.email ?? '',
    nombre: data.user.user_metadata?.nombre,
    profesion: data.user.user_metadata?.profesion,
    pais: data.user.user_metadata?.pais,
  };
};

export const onAuthChange = (callback: (user: AuthUser | null) => void) => {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
    if (!session?.user) { callback(null); return; }
    callback({
      id: session.user.id,
      email: session.user.email ?? '',
      nombre: session.user.user_metadata?.nombre,
      profesion: session.user.user_metadata?.profesion,
      pais: session.user.user_metadata?.pais,
    });
  });
  return () => data.subscription.unsubscribe();
};
