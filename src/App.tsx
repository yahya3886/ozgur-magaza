import { useState, useMemo, useCallback } from 'react';
import { Package, AlertCircle, Search as SearchIcon } from 'lucide-react';
import type { AppItem, SortOption } from '@/types';
import { CATEGORIES } from '@/data';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useRepos } from '@/hooks/useRepos';
import { useApps } from '@/hooks/useApps';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { AppCard } from '@/components/AppCard';
import { AppDetail } from '@/components/AppDetail';
import { AuthScreen } from '@/components/AuthScreen';
import { RepoManager } from '@/components/RepoManager';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { user, loading: authLoading, signIn, signUp, signInAnonymously, resetPassword, signOut } = useAuth();
  const { repos, loading: reposLoading, addRepo, removeRepo, toggleRepo } = useRepos(user?.id ?? null);
  const { apps, loading, error, refetch } = useApps(repos);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortOption, setSortOption] = useState<SortOption>('updated');
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [repoManagerOpen, setRepoManagerOpen] = useState(false);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: apps.length };
    for (const app of apps) {
      for (const cat of app.categories) {
        counts[cat] = (counts[cat] ?? 0) + 1;
      }
    }
    return counts;
  }, [apps]);

  const totalDownloads = useMemo(
    () => apps.reduce((sum, a) => sum + a.downloads, 0),
    [apps],
  );
  const avgRating = useMemo(
    () => (apps.length > 0 ? apps.reduce((s, a) => s + a.rating, 0) / apps.length : 0),
    [apps],
  );

  const filteredApps = useMemo(() => {
    let result = apps;

    if (activeCategory !== 'all') {
      result = result.filter((a) => a.categories.includes(activeCategory));
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.author.toLowerCase().includes(q) ||
          a.categories.some((c) => c.toLowerCase().includes(q)) ||
          a.packageName.toLowerCase().includes(q),
      );
    }

    const sorted = [...result];
    switch (sortOption) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'downloads':
        sorted.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'updated':
        sorted.sort((a, b) => b.lastUpdatedDate.localeCompare(a.lastUpdatedDate));
        break;
      case 'newest':
        sorted.sort((a, b) => b.addedDate.localeCompare(a.addedDate));
        break;
    }
    return sorted;
  }, [apps, activeCategory, search, sortOption]);

  const handleAppClick = useCallback((app: AppItem) => {
    setSelectedApp(app);
  }, []);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-500/30">
          <Package className="h-6 w-6 animate-pulse text-white" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onSignIn={signIn} onSignUp={signUp} onSignInAnonymously={signInAnonymously} onResetPassword={resetPassword} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <Header
        search={search}
        setSearch={setSearch}
        theme={theme}
        toggleTheme={toggleTheme}
        sortOption={sortOption}
        setSortOption={setSortOption}
        onRefresh={refetch}
        loading={loading}
        appCount={apps.length}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onOpenRepoManager={() => setRepoManagerOpen(true)}
        userEmail={user.email ?? null}
        onSignOut={signOut}
      />

      <Sidebar
        categories={CATEGORIES}
        activeCategory={activeCategory}
        setCategory={setActiveCategory}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        categoryCounts={categoryCounts}
        totalApps={apps.length}
        totalDownloads={totalDownloads}
        avgRating={avgRating}
      />

      <main className="lg:pl-72">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                {activeCategory === 'all'
                  ? 'Tüm Uygulamalar'
                  : CATEGORIES.find((c) => c.id === activeCategory)?.name ?? 'Uygulamalar'}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {filteredApps.length} uygulama bulundu
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex gap-3">
                    <div className="h-14 w-14 rounded-xl bg-slate-200 dark:bg-slate-800" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
                    </div>
                  </div>
                  <div className="mt-3 h-8 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              ))}
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                <SearchIcon className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-700 dark:text-slate-300">
                Uygulama bulunamadı
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Arama kriterlerinizi değiştirmeyi deneyin.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setActiveCategory('all');
                }}
                className="mt-4 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-600"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredApps.map((app) => (
                <AppCard key={app.id} app={app} onClick={() => handleAppClick(app)} />
              ))}
            </div>
          )}

          <footer className="mt-12 border-t border-slate-200 pt-6 dark:border-slate-800">
            <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Package className="h-4 w-4 text-teal-500" />
                ÖzgürMağaza — Açık kaynak Android uygulama mağazası
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500">
                Veriler F-Droid ve kullanıcı kaynaklarından çekilir
              </div>
            </div>
          </footer>
        </div>
      </main>

      <AppDetail app={selectedApp} onClose={() => setSelectedApp(null)} />

      {repoManagerOpen && (
        <RepoManager
          repos={repos}
          loading={reposLoading}
          onAdd={addRepo}
          onRemove={removeRepo}
          onToggle={toggleRepo}
          onClose={() => setRepoManagerOpen(false)}
        />
      )}
    </div>
  );
}
