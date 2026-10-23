import { useState } from 'react';
import { Package, AlertCircle, Loader2, UserRound, KeyRound, Copy, Check, ArrowRight, Info } from 'lucide-react';

interface AuthScreenProps {
  onSignInAnonymously: () => Promise<{ error: string | null; code?: string }>;
  onRestoreWithCode: (code: string) => Promise<{ error: string | null }>;
}

type View = 'welcome' | 'code-created';

export function AuthScreen({ onSignInAnonymously, onRestoreWithCode }: AuthScreenProps) {
  const [view, setView] = useState<View>('welcome');
  const [restoreCode, setRestoreCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGuestLogin = async () => {
    setSubmitting(true);
    setError(null);
    const result = await onSignInAnonymously();
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else if (result.code) {
      setGeneratedCode(result.code);
      setView('code-created');
    }
  };

  const handleRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restoreCode.trim()) {
      setError('Kodunuzu girin.');
      return;
    }
    setSubmitting(true);
    setError(null);
    const result = await onRestoreWithCode(restoreCode);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Code created view ──
  if (view === 'code-created') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-100 px-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)] dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Hosgeldin!</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Misafir hesabin olusturuldu. Asagidaki kodu guvenli bir yere kaydet —
                bu kodla baska cihazlarda hesabina geri donebilirsin.
              </p>
            </div>

            <div className="mb-6 rounded-2xl border-2 border-dashed border-teal-300 bg-teal-50/50 p-4 dark:border-teal-700 dark:bg-teal-950/20">
              <div className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Senin Kodun
              </div>
              <div className="text-center text-lg font-bold tracking-wider text-slate-900 dark:text-white break-all">
                {generatedCode}
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="mb-3 flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-transparent text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.98] dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5 text-green-500" /> Kopyalandi!
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" /> Kodu Kopyala
                </>
              )}
            </button>

            <div className="mb-4 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Bu kodu kaybetmen halinde hesabina erisim saglanamaz. Kodu guvenli bir yere not et.</span>
            </div>

            <button
              onClick={() => { setView('welcome'); setGeneratedCode(''); }}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-teal-600 text-sm font-semibold text-white shadow-[0_1px_4px_rgba(0,0,0,0.12),0_4px_12px_rgba(13,148,136,0.3)] transition-all hover:bg-teal-700 active:scale-[0.98]"
            >
              Devam Et <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Welcome view ──
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-100 px-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-[0_2px_8px_rgba(13,148,136,0.25),0_8px_24px_rgba(13,148,136,0.2)]">
            <Package className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">OzgurMagaza</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Acik kaynak Android uygulama magazasi
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)] dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleGuestLogin}
            disabled={submitting}
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-teal-600 text-sm font-semibold text-white shadow-[0_1px_4px_rgba(0,0,0,0.12),0_4px_12px_rgba(13,148,136,0.3)] transition-all hover:bg-teal-700 hover:shadow-[0_2px_8px_rgba(0,0,0,0.12),0_6px_16px_rgba(13,148,136,0.4)] active:scale-[0.98] disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <UserRound className="h-5 w-5" /> Misafir Olarak Basla
              </>
            )}
          </button>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">kayitli kodun mu var?</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          <form onSubmit={handleRestore} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Kodun
              </label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={restoreCode}
                  onChange={(e) => setRestoreCode(e.target.value.toUpperCase())}
                  placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-mono font-semibold tracking-wider text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-teal-400"
                  autoComplete="off"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-transparent text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.98] disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <ArrowRight className="h-5 w-5" /> Kodla Gir
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
