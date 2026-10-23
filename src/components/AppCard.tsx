import { Download, Star, Shield, GitBranch, AlertTriangle } from 'lucide-react';
import type { AppItem } from '@/types';

interface AppCardProps {
  app: AppItem;
  onClick: () => void;
}

function formatDownloads(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function AppCard({ app, onClick }: AppCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-xl hover:shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700 dark:hover:shadow-black/30"
    >
      <div className="flex items-start gap-3 p-4">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
          <img
            src={app.iconUrl}
            alt={app.name}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = `<span class="text-lg font-bold text-slate-500 dark:text-slate-300">${initials(app.name)}</span>`;
              }
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
              {app.name}
            </h3>
            {app.antiFeatures.length > 0 && (
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
            )}
          </div>
          <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
            {app.author}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-md bg-teal-50 px-1.5 py-0.5 text-[10px] font-semibold text-teal-700 dark:bg-teal-950/50 dark:text-teal-400">
              {app.license}
            </span>
            {app.categories.slice(0, 1).map((c) => (
              <span
                key={c}
                className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="px-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
        {app.summary}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 px-4 py-3 dark:border-slate-800/60">
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-200">{app.rating.toFixed(1)}</span>
          </span>
          <span className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5" />
            {formatDownloads(app.downloads)}
          </span>
          {app.antiFeatures.length === 0 && (
            <span className="hidden items-center gap-1 sm:flex">
              <Shield className="h-3.5 w-3.5 text-teal-500" />
              <span className="text-teal-600 dark:text-teal-400">Güvenli</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-teal-500 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
          <GitBranch className="h-3.5 w-3.5" />
          İncele
        </div>
      </div>
    </button>
  );
}
