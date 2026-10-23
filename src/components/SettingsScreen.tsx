import { useState } from 'react';
import { X, AlertCircle, CheckCircle2, Loader2, Trash2, ShieldAlert, User, KeyRound, Copy, Check, ArrowLeft, Info } from 'lucide-react';

interface SettingsScreenProps {
  guestCode: string | null;
  onDeleteAccount: () => Promise<{ error: string | null }>;
  onSignOut: () => void;
  onClose: () => void;
}

export function SettingsScreen({ guestCode, onDeleteAccount, onSignOut, onClose }: SettingsScreenProps) {
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!guestCode) return;
    navigator.clipboard.writeText(guestCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteAccount = async () => {
    setSubmitting(true);
    setError(null);
    const result = await onDeleteAccount();
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Ayarlar</h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {error && (
            <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {info && (
            <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {info}
            </div>
          )}

          {/* Account info section */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Hesap Bilgileri</h3>
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-teal-500" />
                <span className="text-sm text-slate-600 dark:text-slate-300">Misafir hesap</span>
              </div>
            </div>
          </section>

          {/* Guest code section */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Misafir Kodun</h3>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              {guestCode ? (
                <>
                  <div className="mb-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>Bu kodla baska cihazlarda hesabina geri donebilirsin. Kodunu guvenli bir yerde sakla.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <KeyRound className="h-5 w-5 shrink-0 text-teal-500" />
                    <code className="flex-1 text-sm font-bold tracking-wider text-slate-900 dark:text-white break-all">
                      {guestCode}
                    </code>
                    <button
                      onClick={handleCopy}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      aria-label="Kodu kopyala"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Kod bulunamadi. Cikis yapip tekrar giris yaptiginizda yeni bir kod olusturulacak.
                </p>
              )}
            </div>
          </section>

          {/* Danger zone */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-red-500 dark:text-red-400">Tehlikeli Bolge</h3>
            <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50/50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
              <button
                onClick={onSignOut}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <ArrowLeft className="h-4 w-4 text-slate-500" />
                Cikis Yap
              </button>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex w-full items-center gap-3 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-600 transition-all hover:bg-red-50 dark:border-red-900/50 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  <Trash2 className="h-4 w-4" />
                  Hesabi Sil
                </button>
              ) : (
                <div className="rounded-xl border border-red-300 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/40">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-400">
                    <ShieldAlert className="h-5 w-5" />
                    Hesabinizi silmek uzeresiniz
                  </div>
                  <p className="mb-3 text-xs text-red-600 dark:text-red-400">
                    Bu islem geri alinamaz. Tum verileriniz kalici olarak silinecek.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={submitting}
                      className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 active:scale-[0.98] disabled:opacity-60"
                    >
                      {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Evet, sil'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Vazgec
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
