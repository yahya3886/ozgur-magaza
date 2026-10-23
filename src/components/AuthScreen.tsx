import { useState } from 'react';
import { Package, Mail, Lock, LogIn, UserPlus, AlertCircle, Loader2, KeyRound, ArrowLeft, CheckCircle2, UserRound, Eye, EyeOff } from 'lucide-react';

interface AuthScreenProps {
  onSignIn: (email: string, password: string) => Promise<{ error: string | null; needsConfirmation?: boolean }>;
  onSignUp: (email: string, password: string) => Promise<{ error: string | null; confirmationSent?: boolean }>;
  onSignInAnonymously: () => Promise<{ error: string | null }>;
  onResetPassword: (email: string) => Promise<{ error: string | null }>;
}

type View = 'auth' | 'forgot-password' | 'confirmation-sent';

export function AuthScreen({ onSignIn, onSignUp, onSignInAnonymously, onResetPassword }: AuthScreenProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [view, setView] = useState<View>('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const resetState = () => {
    setError(null);
    setInfo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('E-posta ve şifre gerekli.');
      return;
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı.');
      return;
    }
    setSubmitting(true);
    resetState();
    if (mode === 'signin') {
      const result = await onSignIn(email.trim(), password);
      setSubmitting(false);
      if (result.error) setError(result.error);
    } else {
      const result = await onSignUp(email.trim(), password);
      setSubmitting(false);
      if (result.error) {
        setError(result.error);
      } else if (result.confirmationSent) {
        setView('confirmation-sent');
      }
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('E-posta adresinizi girin.');
      return;
    }
    setSubmitting(true);
    resetState();
    const result = await onResetPassword(email.trim());
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else {
      setInfo('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
    }
  };

  const handleAnonSignIn = async () => {
    setSubmitting(true);
    resetState();
    const result = await onSignInAnonymously();
    setSubmitting(false);
    if (result.error) setError(result.error);
  };

  const switchMode = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    resetState();
  };

  // ── Confirmation sent view ──
  if (view === 'confirmation-sent') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-100 px-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)] dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Hoş geldiniz!</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Hesabınız oluşturuldu. E-posta adresinize bir doğrulama bağlantısı gönderdik.
              Lütfen e-postanızı kontrol edin ve bağlantıya tıklayarak hesabınızı doğrulayın.
            </p>
            <button
              onClick={() => { setView('auth'); switchMode('signin'); }}
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-teal-600 text-sm font-semibold text-white shadow-[0_1px_4px_rgba(0,0,0,0.12),0_4px_12px_rgba(13,148,136,0.3)] transition-all hover:bg-teal-700 hover:shadow-[0_2px_8px_rgba(0,0,0,0.12),0_6px_16px_rgba(13,148,136,0.4)] active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4" /> Giriş ekranına dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Forgot password view ──
  if (view === 'forgot-password') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-100 px-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)] dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => { setView('auth'); resetState(); setInfo(null); }}
              className="mb-4 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
            >
              <ArrowLeft className="h-4 w-4" /> Geri
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Şifre Sıfırlama</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
              </p>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {info && (
              <div className="mb-4 flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {info}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  E-posta
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-teal-400"
                    autoComplete="email"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-teal-600 text-sm font-semibold text-white shadow-[0_1px_4px_rgba(0,0,0,0.12),0_4px_12px_rgba(13,148,136,0.3)] transition-all hover:bg-teal-700 hover:shadow-[0_2px_8px_rgba(0,0,0,0.12),0_6px_16px_rgba(13,148,136,0.4)] active:scale-[0.98] disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <KeyRound className="h-5 w-5" /> Sıfırlama Bağlantısı Gönder
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Main auth view ──
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-100 px-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-[0_2px_8px_rgba(13,148,136,0.25),0_8px_24px_rgba(13,148,136,0.2)]">
            <Package className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">ÖzgürMağaza</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Açık kaynak Android uygulama mağazası
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)] dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          {/* Material Design segmented control */}
          <div className="mb-6 flex rounded-full bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => switchMode('signin')}
              className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-all duration-200 ${
                mode === 'signin'
                  ? 'bg-white text-teal-600 shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:bg-slate-700 dark:text-teal-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-all duration-200 ${
                mode === 'signup'
                  ? 'bg-white text-teal-600 shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:bg-slate-700 dark:text-teal-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                E-posta
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-teal-400"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Şifre
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-teal-400"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === 'signin' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setView('forgot-password'); resetState(); setInfo(null); }}
                  className="text-sm font-medium text-teal-600 transition-colors hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                >
                  Şifremi unuttum
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-teal-600 text-sm font-semibold text-white shadow-[0_1px_4px_rgba(0,0,0,0.12),0_4px_12px_rgba(13,148,136,0.3)] transition-all hover:bg-teal-700 hover:shadow-[0_2px_8px_rgba(0,0,0,0.12),0_6px_16px_rgba(13,148,136,0.4)] active:scale-[0.98] disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : mode === 'signin' ? (
                <>
                  <LogIn className="h-5 w-5" /> Giriş Yap
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" /> Hesap Oluştur
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">veya</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* Anonymous sign-in — Material Design outlined button */}
          <button
            onClick={handleAnonSignIn}
            disabled={submitting}
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-full border-2 border-slate-200 bg-transparent text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.98] disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <UserRound className="h-5 w-5" />
            Misafir olarak devam et
          </button>

          <p className="mt-5 text-center text-xs text-slate-400 dark:text-slate-500">
            {mode === 'signin'
              ? 'Hesabınız yok mu? Yukarıdaki Kayıt Ol sekmesine geçin.'
              : 'Zaten hesabınız var mı? Yukarıdaki Giriş Yap sekmesine geçin.'}
          </p>
        </div>
      </div>
    </div>
  );
}
