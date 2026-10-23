import { Search, Sun, Moon, RefreshCw, Github, Package, Database, LogOut, User, Trash2, Settings, MessageCircle } from 'lucide-react';
import type { ThemeMode, SortOption } from '@/types';

interface HeaderProps {
  search: string;
  setSearch: (v: string) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  sortOption: SortOption;
  setSortOption: (v: SortOption) => void;
  onRefresh: () => void;
  loading: boolean;
  appCount: number;
  onToggleSidebar: () => void;
  onOpenRepoManager: () => void;
  userEmail: string | null;
  onSignOut: () => void;
  onDeleteAccount: () => void;
  onOpenSettings: () => void;
  onOpenChat: () => void;
}

const SORT_LABELS: Record<SortOption, string> = {
  name: 'İsim',
  rating: 'Puan',
  downloads: 'İndirme',
  updated: 'Güncel',
  newest: 'Yeni Eklenen',
};

export function Header({
  search,
  setSearch,
  theme,
  toggleTheme,
  sortOption,
  setSortOption,
  onRefresh,
  loading,
  appCount,
  onToggleSidebar,
  onOpenRepoManager,
  userEmail,
  onSignOut,
  onDeleteAccount,
  onOpenSettings,
  onOpenChat,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          onClick={onToggleSidebar}
          className="flex items-center gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 lg:px-3"
          aria-label="Menü"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-500/20">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div className="hidden text-left sm:block">
            <div className="text-base font-bold leading-tight text-slate-900 dark:text-white">
              ÖzgürMağaza
            </div>
            <div className="text-[11px] font-medium leading-tight text-teal-600 dark:text-teal-400">
              {appCount} uygulama
            </div>
          </div>
        </button>

        <div className="relative flex-1 max-w-2xl">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Uygulama, kategori veya geliştirici ara..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-teal-400 dark:focus:bg-slate-950"
          />
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <button
            onClick={onOpenRepoManager}
            className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Database className="h-4.5 w-4.5" />
            <span className="hidden lg:inline">Kaynaklar</span>
          </button>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition-all hover:bg-slate-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map((k) => (
              <option key={k} value={k}>
                {SORT_LABELS[k]}
              </option>
            ))}
          </select>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Yenile"
          >
            <RefreshCw className={`h-4.5 w-4.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Tema değiştir"
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          <button
            onClick={onOpenChat}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Sohbet"
          >
            <MessageCircle className="h-4.5 w-4.5" />
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="GitHub"
          >
            <Github className="h-4.5 w-4.5" />
          </a>

          <div className="group relative">
            <button className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 px-3 text-sm font-semibold text-white shadow-md shadow-teal-500/20 transition-all hover:shadow-lg">
              <User className="h-4 w-4" />
              <span className="hidden max-w-[120px] truncate lg:inline">
                {userEmail?.split('@')[0] ?? 'Kullanıcı'}
              </span>
            </button>
            <div className="invisible absolute right-0 top-full mt-1 w-48 rounded-xl border border-slate-200 bg-white p-1.5 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100 dark:border-slate-800 dark:bg-slate-900">
              <div className="truncate px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                {userEmail}
              </div>
              <button
                onClick={onOpenSettings}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Settings className="h-4 w-4" /> Ayarlar
              </button>
              <button
                onClick={onSignOut}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" /> Çıkış Yap
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={onOpenChat}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Sohbet"
          >
            <MessageCircle className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={onOpenRepoManager}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Kaynaklar"
          >
            <Database className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Tema değiştir"
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
