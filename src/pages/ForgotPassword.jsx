import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Flame, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import animeBg from '../assets/auth_anime_bg.jpg';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email address');
      return;
    }

    setLoading(true);
    const res = await forgotPassword(email);
    setLoading(false);

    if (res.success) {
      setSuccessMessage(res.message || 'If an account with that email exists, password reset instructions have been sent.');
    } else {
      setError(res.error || 'Failed to send password reset email.');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] w-full -mt-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-8 py-4 sm:py-6 flex flex-col justify-between overflow-hidden bg-[#070204]">
      {/* Background Image Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={animeBg}
          alt="Anime Community Atmosphere"
          className="w-full h-full object-cover object-left opacity-35 filter saturate-125 contrast-125 hue-rotate-[-30deg]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080205]/95 via-[#120308]/90 to-[#070204]/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070204] via-transparent to-[#080205]/80" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 flex items-center justify-between py-2 border-b border-white/10 mb-4 sm:mb-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 via-red-600 to-rose-700 p-0.5 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            <div className="w-full h-full bg-[#0d0305] rounded-[10px] flex items-center justify-center">
              <Flame className="w-4 h-4 text-red-500 fill-red-500" />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-black tracking-tight text-white font-display">
              FAN HUB
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm shadow-red-600/50">
              PLUS
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 text-xs text-zinc-300">
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-red-400 hover:text-white font-black transition-colors"
          >
            <span>Back to Login</span>
            <ArrowRight className="w-3.5 h-3.5 text-red-500" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-20 max-w-md w-full mx-auto my-auto pb-6">
        <div className="relative rounded-2xl p-5 sm:p-6 bg-[#0d0407]/95 backdrop-blur-2xl border-2 border-red-500/70 shadow-[0_0_40px_rgba(239,68,68,0.35)] transition-all">
          
          <div className="text-center space-y-2 mb-4">
            <div className="inline-flex p-2.5 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-600/20 border border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
              <Mail className="w-5 h-5 text-red-500" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
                Forgot <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-white">Password?</span>
              </h1>
              <p className="text-[11px] text-zinc-400 font-medium">
                Enter your email address to receive a secure password reset link.
              </p>
            </div>

            <div className="w-10 h-0.5 mx-auto rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          </div>

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-0.5">
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                <Mail className="w-3 h-3 text-red-400" />
                <span>Account Email Address</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@fanhub.io"
                  disabled={loading}
                  className="w-full pl-9 pr-3 py-2 bg-[#120509]/90 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(239,68,68,0.5)] flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Reset Link...</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span>Send Reset Email</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-[11px] text-zinc-400 pt-4 border-t border-white/10 mt-4">
            <span>Remembered your password?</span>
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-red-400 hover:text-white font-bold ml-1.5 transition-colors"
            >
              <span>Login</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
