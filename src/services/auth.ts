import { supabase, isSupabaseConfigured } from './supabase';
import { UserProfile, UserRole } from '../types/wedding';
import { DEMO_USERS } from '../data/seedData';

const STORAGE_SESSION_KEY = 'nuptia_current_user';

export async function getCurrentUser(): Promise<UserProfile | null> {
  // If Supabase is connected, check real session
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Query user role and profile from public.profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, email, full_name, phone, user_roles(role)')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const role = (profile as any).user_roles?.[0]?.role || 'customer';
          return {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            phone: profile.phone || '',
            role: role as UserRole,
            created_at: new Date().toISOString(),
          };
        }
      }
    } catch (e) {
      console.warn('Supabase auth getSession check failed, falling back to local session', e);
    }
  }

  // Fallback to local session
  const stored = localStorage.getItem(STORAGE_SESSION_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  return null;
}

export async function loginWithEmail(email: string, _password: string): Promise<{ user: UserProfile | null; error: string | null }> {
  const cleanEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: _password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        const user: UserProfile = {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          full_name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
          role: cleanEmail.includes('admin') ? 'admin' : 'customer',
          created_at: data.user.created_at,
        };
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
        return { user, error: null };
      }
    } catch (e: any) {
      return { user: null, error: e.message || 'Gagal login ke Supabase.' };
    }
  }

  // Offline / Demo Login
  const matched = DEMO_USERS.find(u => u.email.toLowerCase() === cleanEmail);
  if (matched) {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(matched));
    return { user: matched, error: null };
  }

  // Create simulated customer session for testing
  const newUser: UserProfile = {
    id: 'usr-' + Math.random().toString(36).substring(2, 9),
    email: cleanEmail,
    full_name: cleanEmail.split('@')[0].replace('.', ' ').toUpperCase(),
    role: cleanEmail.includes('admin') ? 'admin' : 'customer',
    created_at: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(newUser));
  return { user: newUser, error: null };
}

export async function registerWithEmail(email: string, _password: string, fullName: string, phone: string): Promise<{ user: UserProfile | null; error: string | null }> {
  const cleanEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: _password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          }
        }
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        const user: UserProfile = {
          id: data.user.id,
          email: cleanEmail,
          full_name: fullName,
          phone: phone,
          role: 'customer',
          created_at: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
        return { user, error: null };
      }
    } catch (e: any) {
      return { user: null, error: e.message || 'Gagal registrasi Supabase.' };
    }
  }

  // Offline registration
  const user: UserProfile = {
    id: 'usr-' + Math.random().toString(36).substring(2, 9),
    email: cleanEmail,
    full_name: fullName,
    phone: phone,
    role: cleanEmail.includes('admin') ? 'admin' : 'customer',
    created_at: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
  return { user, error: null };
}

export async function logoutUser(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signout failed', e);
    }
  }
  localStorage.removeItem(STORAGE_SESSION_KEY);
}

export async function resetPasswordRequest(email: string): Promise<{ success: boolean; message: string }> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (error) return { success: false, message: error.message };
    return { success: true, message: 'Tautan reset kata sandi telah dikirim ke email Anda.' };
  }
  return { success: true, message: 'Permintaan reset terkirim (Mode Demo: silakan gunakan akun Anda langsung).' };
}
