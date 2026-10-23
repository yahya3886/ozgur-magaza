import { useState } from 'react';
import { Plus, Trash2, X, Link2, Database, Check, Loader2, AlertCircle, Power } from 'lucide-react';
import type { AppRepo } from '@/hooks/useRepos';
import { DEFAULT_FDROID_REPO } from '@/hooks/useRepos';

interface RepoManagerProps {
  repos: AppRepo[];
  loading: boolean;
  onAdd: (name: string, url: string) => Promise<{ error: string | null }>;
  onRemove: (id: string) => Promise<{ error: string | null }>;
  onToggle: (id: string, enabled: boolean) => Promise<{ error: string | null }>;
  onClose: () => void;
}

export function RepoManager({
  repos,
  loading,
  onAdd,
  onRemove,
  onToggle,
  onClose,
}: RepoManagerProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      setError('Ad ve URL gerekli.');
      return;
    }
    try {
      new URL(url.trim());
    } catch {
      setError('Geçerli bir URL girin.');
      return;
    }
    setAdding(true);
    setError(null);
    const result = await onAdd(name.trim(), url.trim());
    setAdding(false);
    if (result.error) {
      setError(result.error);
    } else {
      setName('');
      setUrl('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/70 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative my-8 w-full max-w-2xl animate-[fadeIn_0.2s_ease] rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Uygulama Kaynakları</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">JSON depo adreslerini yönet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Default repo — always shown, not removable */}
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-teal-200 bg-teal-50 p-3.5 dark:border-teal-900/50 dark:bg-teal-950/30">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-white">
              <Check className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {DEFAULT_FDROID_REPO.name}
              </div>
              <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                {DEFAULT_FDROID_REPO.url}
              </div>
            </div>
            <span className="rounded-md bg-teal-100 px-2 py-0.5 text-[11px] font-semibold text-teal-700 dark:bg-teal-900/50 dark:text-teal-400">
              Aktif
            </span>
          </div>

          {/* User repos */}
          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Eklediğiniz Kaynaklar
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            </div>
          ) : repos.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
              <Link2 className="mx-auto mb-2 h-6 w-6 text-slate-400" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Henüz ek kaynak eklemediniz.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 transition-colors ${
                    repo.enabled
                      ? 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50'
                      : 'border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30'
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    repo.enabled
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-300 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                  }`}>
                    <Database className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm font-semibold ${
                      repo.enabled
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      {repo.name}
                    </div>
                    <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {repo.url}
                    </div>
                  </div>
                  <button
                    onClick={() => onToggle(repo.id, !repo.enabled)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                      repo.enabled
                        ? 'text-teal-600 hover:bg-teal-100 dark:text-teal-400 dark:hover:bg-teal-950/40'
                        : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    title={repo.enabled ? 'Devre dışı bırak' : 'Etkinleştir'}
                  >
                    <Power className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onRemove(repo.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new repo form */}
          <div className="mt-5 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <Plus className="h-4 w-4 text-teal-500" />
              Yeni Kaynak Ekle
            </div>

            {error && (
              <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleAdd} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Kaynak adı (ör. Benim Depom)"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
              />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/apps.json"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={adding}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-teal-500 text-sm font-semibold text-white transition-colors hover:bg-teal-600 disabled:opacity-60"
              >
                {adding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="h-4 w-4" /> Ekle
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-slate-400 dark:text-slate-500">
            JSON dosyası, uygulama listesi içeren bir dizi olmalıdır. Her uygulama en azından
            <code className="mx-1 rounded bg-slate-100 px-1 py-0.5 text-[11px] dark:bg-slate-800">id</code>,
            <code className="mx-1 rounded bg-slate-100 px-1 py-0.5 text-[11px] dark:bg-slate-800">name</code> ve
            <code className="mx-1 rounded bg-slate-100 px-1 py-0.5 text-[11px] dark:bg-slate-800">releases</code> alanlarını içermelidir.
          </p>
        </div>
      </div>
    </div>
  );
}
