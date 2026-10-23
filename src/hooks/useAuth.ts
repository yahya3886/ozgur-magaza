import { useState, useEffect, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segments: string[] = [];
  for (let s = 0; s < 4; s++) {
    let seg = '';
    for (let i = 0; i < 5; i++) {
      seg += chars[Math.floor(Math.random() * chars.length)];
    }
    segments.push(seg);
  }
  return segments.join('-');
}

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  guestCode: string | null;
  signInAnonymously: () => Promise<{ error: string | null; code?: string }>;
  restoreWithCode: (code: string) => Promise<{ error: string | null }>;
  deleteAccount: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestCode, setGuestCode] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        const stored = localStorage.getItem('guest_code');
        if (stored) setGuestCode(stored);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (!sess?.user) {
        setGuestCode(null);
      }
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInAnonymously = useCallback(async () => {
    const { error } = await supabase.auth.signInAnonymously();
    if (error) return { error: error.message };

    const { data: { user: newUser } } = await supabase.auth.getUser();
    if (!newUser) return { error: 'Oturum olusturulamadi.' };

    const plainCode = generateCode();
    const hashed = await sha256(plainCode);

    const { error: insertError } = await supabase.from('user_codes').insert({
      code_hash: hashed,
      display_name: 'Misafir',
    });

    if (insertError) {
      return { error: 'Kod kaydedilemedi: ' + insertError.message };
    }

    localStorage.setItem('guest_code', plainCode);
    setGuestCode(plainCode);
    return { error: null, code: plainCode };
  }, []);

  const restoreWithCode = useCallback(async (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return { error: 'Kod girin.' };

    const { error: anonError } = await supabase.auth.signInAnonymously();
    if (anonError) return { error: anonError.message };

    const hashed = await sha256(trimmed);
    const { data, error: rpcError } = await supabase.rpc('restore_code', {
      code_text: hashed,
    });

    if (rpcError) return { error: 'Kod gecerli degil.' };
    if (!data) return { error: 'Kod bulunamadi.' };

    localStorage.setItem('guest_code', trimmed);
    setGuestCode(trimmed);
    return { error: null };
  }, []);

  const deleteAccount = useCallback(async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (!currentSession) return { error: 'Oturum bulunamadi.' };

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const response = await fetch(`${supabaseUrl}/functions/v1/delete-account`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentSession.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: 'Hesap silinemedi.' }));
      return { error: data.error ?? 'Hesap silinemedi.' };
    }

    localStorage.removeItem('guest_code');
    setGuestCode(null);
    await supabase.auth.signOut();
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem('guest_code');
    setGuestCode(null);
    await supabase.auth.signOut();
  }, []);

  return { user, session, loading, guestCode, signInAnonymously, restoreWithCode, deleteAccount, signOut };
}
