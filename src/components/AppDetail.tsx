import { useState } from 'react';
import {
  X,
  Download,
  Star,
  Shield,
  GitBranch,
  Globe,
  Bug,
  Mail,
  Calendar,
  AlertTriangle,
  Code2,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import type { AppItem } from '@/types';

interface AppDetailProps {
  app: AppItem | null;
  onClose: () => void;
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

export function AppDetail({ app, onClose }: AppDetailProps) {
  const [downloadStarted, setDownloadStarted] = useState(false);

  if (!app) return null;

  const latestRelease = app.releases[0];

  const handleDownload = () => {
    setDownloadStarted(true);
    window.open(latestRelease.downloadUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => setDownloadStarted(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/70 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />
      <div className="relative my-8 w-full max-w-3xl animate-[fadeIn_0.2s_ease] rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Kapat"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="h-28 rounded-t-2xl bg-gradient-to-br from-teal-500 via-emerald-600 to-teal-700" />

        <div className="px-6 pb-6 sm:px-8">
          <div className="-mt-12 flex items-end gap-4">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-gradient-to-br from-slate-100 to-slate-200 shadow-lg dark:border-slate-950 dark:from-slate-800 dark:to-slate-700">
              <img
                src={app.iconUrl}
                alt={app.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-2xl font-bold text-slate-500 dark:text-slate-300">${initials(app.name)}</span>`;
                  }
                }}
              />
            </div>
            <div className="flex-1 pb-2 pr-10">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{app.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {app.author} · v{app.suggestedVersion}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="flex items-center gap-1 rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-950/50 dark:text-teal-400">
              <Code2 className="h-3.5 w-3.5" /> {app.license}
            </span>
            {app.categories.map((c) => (
              <span
                key={c}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              >
                {c}
              </span>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
              <Star className="mb-1 h-4 w-4 fill-amber-400 text-amber-400" />
              <div className="text-lg font-bold text-slate-900 dark:text-white">{app.rating.toFixed(1)}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{formatDownloads(app.ratingCount)} oy</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
              <Download className="mb-1 h-4 w-4 text-blue-500" />
              <div className="text-lg font-bold text-slate-900 dark:text-white">{formatDownloads(app.downloads)}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">indirme</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
              <Calendar className="mb-1 h-4 w-4 text-slate-400" />
              <div className="text-sm font-bold text-slate-900 dark:text-white">{app.lastUpdatedDate}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">güncelleme</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
              <Shield className="mb-1 h-4 w-4 text-teal-500" />
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {app.antiFeatures.length === 0 ? 'Temiz' : `${app.antiFeatures.length} uyarı`}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">anti-özellik</div>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="mb-1.5 text-sm font-bold text-slate-900 dark:text-white">Açıklama</h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{app.description}</p>
          </div>

          {app.antiFeatures.length > 0 && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <div className="text-xs font-semibold text-amber-800 dark:text-amber-400">Anti-Özellikler</div>
                <div className="mt-0.5 text-xs text-amber-700 dark:text-amber-500">
                  {app.antiFeatures.join(', ')}
                </div>
              </div>
            </div>
          )}

          {latestRelease && (
            <div className="mt-5 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">Sürüm Bilgisi</h3>
              <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                <div>
                  <div className="text-slate-400 dark:text-slate-500">Sürüm</div>
                  <div className="font-semibold text-slate-700 dark:text-slate-200">{latestRelease.version}</div>
                </div>
                <div>
                  <div className="text-slate-400 dark:text-slate-500">Boyut</div>
                  <div className="font-semibold text-slate-700 dark:text-slate-200">{latestRelease.size}</div>
                </div>
                <div>
                  <div className="text-slate-400 dark:text-slate-500">Tarih</div>
                  <div className="font-semibold text-slate-700 dark:text-slate-200">{latestRelease.date}</div>
                </div>
                <div>
                  <div className="text-slate-400 dark:text-slate-500">Min. Android</div>
                  <div className="font-semibold text-slate-700 dark:text-slate-200">{latestRelease.minAndroidVersion}</div>
                </div>
              </div>
              {latestRelease.changelog && (
                <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {latestRelease.changelog}
                </p>
              )}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={app.sourceCodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <GitBranch className="h-3.5 w-3.5" /> Kaynak Kod
              <ExternalLink className="h-3 w-3 opacity-50" />
            </a>
            <a
              href={app.issueTrackerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Bug className="h-3.5 w-3.5" /> Hata Bildir
              <ExternalLink className="h-3 w-3 opacity-50" />
            </a>
            {app.websiteUrl && (
              <a
                href={app.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Globe className="h-3.5 w-3.5" /> Web Sitesi
                <ExternalLink className="h-3 w-3 opacity-50" />
              </a>
            )}
            <a
              href={`mailto:${app.authorEmail}`}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Mail className="h-3.5 w-3.5" /> E-posta
            </a>
          </div>

          <button
            onClick={handleDownload}
            className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all ${
              downloadStarted
                ? 'bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40'
            }`}
          >
            {downloadStarted ? (
              <>
                <CheckCircle2 className="h-5 w-5" /> İndirme başlatıldı!
              </>
            ) : (
              <>
                <Download className="h-5 w-5" /> APK İndir ({latestRelease?.size})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
