import {
  LayoutGrid,
  Globe,
  MessageCircle,
  PlayCircle,
  Gamepad2,
  Code2,
  Settings,
  Wrench,
  BookOpen,
  ShieldCheck,
  FlaskConical,
  Wifi,
  X,
  Package,
  Download,
  Star,
  TrendingUp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Category } from '@/types';

interface SidebarProps {
  categories: Category[];
  activeCategory: string;
  setCategory: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  categoryCounts: Record<string, number>;
  totalApps: number;
  totalDownloads: number;
  avgRating: number;
}

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutGrid,
  Globe,
  MessageCircle,
  PlayCircle,
  Gamepad2,
  Code2,
  Settings,
  Wrench,
  BookOpen,
  ShieldCheck,
  FlaskConical,
  Wifi,
};

export function Sidebar({
  categories,
  activeCategory,
  setCategory,
  isOpen,
  onClose,
  categoryCounts,
  totalApps,
  totalDownloads,
  avgRating,
}: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-16 z-20 h-[calc(100vh-4rem)] w-72 transform overflow-y-auto border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 lg:hidden">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Kategoriler</span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-3 py-4">
          <div className="mb-4 grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-teal-50 p-3 text-center dark:bg-teal-950/40">
              <Package className="mx-auto mb-1 h-4 w-4 text-teal-600 dark:text-teal-400" />
              <div className="text-lg font-bold text-slate-900 dark:text-white">{totalApps}</div>
              <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Uygulama</div>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-center dark:bg-blue-950/40">
              <Download className="mx-auto mb-1 h-4 w-4 text-blue-600 dark:text-blue-400" />
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {totalDownloads >= 1e6 ? `${(totalDownloads / 1e6).toFixed(0)}M` : `${(totalDownloads / 1e3).toFixed(0)}K`}
              </div>
              <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">İndirme</div>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-center dark:bg-amber-950/40">
              <Star className="mx-auto mb-1 h-4 w-4 fill-amber-500 text-amber-500" />
              <div className="text-lg font-bold text-slate-900 dark:text-white">{avgRating.toFixed(1)}</div>
              <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Puan</div>
            </div>
          </div>

          <div className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Kategoriler
          </div>

          <nav className="space-y-0.5">
            {categories.map((cat) => {
              const Icon = ICON_MAP[cat.icon] ?? LayoutGrid;
              const isActive = activeCategory === cat.id;
              const count = categoryCounts[cat.id] ?? 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategory(cat.id);
                    onClose();
                  }}
                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/20'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'}`} />
                  <span className="flex-1 text-left">{cat.name}</span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="mt-6 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <TrendingUp className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              Özgür Yazılım
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Tüm uygulamalar açık kaynak kodludur ve özgür yazılım lisansı altında dağıtılır.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
