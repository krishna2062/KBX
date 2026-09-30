import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { adminApi } from '../services/adminApi';

interface AdminLoginPageProps {
  onLoginSuccess: (user: any, token: string) => void;
  sessionExpiredMessage?: string | null;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  sessionExpiredMessage
}) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login || !password) {
      setError('Please enter both your email/username and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await adminApi.login(login, password, rememberMe);
      if (res.success && res.token && res.user) {
        adminApi.setToken(res.token, rememberMe);
        onLoginSuccess(res.user, res.token);
      } else {
        setError(res.message || 'Invalid credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040705] text-[#e8f0eb] flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative overflow-hidden font-sans selection:bg-[#10b981]/30 selection:text-[#34d399]">
      {/* Background radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(ellipse 450px 300px at 50% 50%, rgba(16, 185, 129, 0.08), transparent 70%)'
        }}
      />

      {/* Subtle grid backdrop overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a1a120a_1px,transparent_1px),linear-gradient(to_bottom,#0a1a120a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none -z-10" />

      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center font-display font-bold text-lg text-[#050807] shadow-[0_0_24px_rgba(16,185,129,0.35)] mb-4">
            K
          </div>
          <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-semibold block mb-1">
            KBX Control Center
          </span>
          <h1 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight">
            Welcome back.
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 font-normal">
            Sign in to manage your website.
          </p>
        </div>

        {/* Card Surface */}
        <div className="rounded-2xl bg-[#07130e]/90 border border-emerald-500/20 backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          {sessionExpiredMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0 text-amber-400" />
              <span>{sessionExpiredMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5 font-medium">
                Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <User size={15} />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="krishna@kbx.dev or admin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#040906] border border-white/10 text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase text-gray-400 font-medium">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] font-mono text-emerald-400/90 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock size={15} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#040906] border border-white/10 text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#040906] border-white/20 text-emerald-500 focus:ring-emerald-500/30 accent-emerald-500"
                />
                <span className="text-xs text-gray-300">Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-[#050807] font-medium text-xs tracking-wider uppercase transition-colors cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_28px_rgba(52,211,153,0.5)]"
            >
              <span>{loading ? 'Verifying...' : 'Sign In to Dashboard'}</span>
              <ArrowRight size={14} />
            </button>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-mono text-gray-500 text-center">
          <ShieldCheck size={14} className="text-emerald-500/70" />
          <span>Protected system · Authorized access only</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowForgotModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-[#07130e] border border-emerald-500/30 p-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-medium text-base text-white mb-2">
              Password Recovery
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-4 font-normal">
              For security, administrator password reset instructions are logged to the local server configuration console. Default owner credentials are established in your secure server environment.
            </p>
            <div className="p-3 rounded-lg bg-[#040906] border border-white/10 text-[11px] font-mono text-emerald-400 mb-5">
              Default administrator: <span className="text-white">admin</span> or <span className="text-white">krishna@kbx.dev</span>
            </div>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-colors cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
