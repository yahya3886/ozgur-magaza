import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface AppRepo {
  id: string;
  name: string;
  url: string;
  is_default: boolean;
  enabled: boolean;
  created_at: string;
}

interface UseReposResult {
  repos: AppRepo[];
  loading: boolean;
  error: string | null;
  addRepo: (name: string, url: string) => Promise<{ error: string | null }>;
  removeRepo: (id: string) => Promise<{ error: string | null }>;
  toggleRepo: (id: string, enabled: boolean) => Promise<{ error: string | null }>;
  refetch: () => void;
}

const DEFAULT_FDROID_REPO = {
  name: 'F-Droid (Varsayılan)',
  url: 'https://raw.githubusercontent.com/bolt-app-store/bolt-app-store.github.io/main/apps.json',
};

export function useRepos(userId: string | null): UseReposResult {
  const [repos, setRepos] = useState<AppRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepos = useCallback(async () => {
    if (!userId) {
      setRepos([]);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('app_repos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (err) {
      setError(err.message);
      setRepos([]);
    } else {
      setRepos(data as AppRepo[]);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  const addRepo = useCallback(
    async (name: string, url: string) => {
      if (!userId) return { error: 'Giriş yapmalısınız' };
      const { error: err } = await supabase
        .from('app_repos')
        .insert({ name, url, user_id: userId });
      if (err) return { error: err.message };
      fetchRepos();
      return { error: null };
    },
    [userId, fetchRepos],
  );

  const removeRepo = useCallback(
    async (id: string) => {
      const { error: err } = await supabase.from('app_repos').delete().eq('id', id);
      if (err) return { error: err.message };
      fetchRepos();
      return { error: null };
    },
    [fetchRepos],
  );

  const toggleRepo = useCallback(
    async (id: string, enabled: boolean) => {
      const { error: err } = await supabase
        .from('app_repos')
        .update({ enabled })
        .eq('id', id);
      if (err) return { error: err.message };
      fetchRepos();
      return { error: null };
    },
    [fetchRepos],
  );

  return {
    repos,
    loading,
    error,
    addRepo,
    removeRepo,
    toggleRepo,
    refetch: fetchRepos,
  };
}

export { DEFAULT_FDROID_REPO };
