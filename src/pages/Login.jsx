import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogIn,
  Mail,
  Lock,
  Shield,
  User,
  AlertCircle,
  Eye,
  EyeOff,
  Flame,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import animeBg from '../assets/auth_anime_bg.jpg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Enter a valid email format';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      if (res.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setServerError(res.error || 'Login failed. Please check your credentials.');
    }
  };

  const handleQuickLogin = async (demoEmail) => {
    setIsSubmitting(true);
    setServerError('');
    const res = await login(demoEmail, 'fanhub2026');
    setIsSubmitting(false);
    if (res.success) {
      if (res.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setServerError(res.error || 'Quick login failed.');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] w-full -mt-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-8 py-4 sm:py-6 flex flex-col justify-between overflow-hidden bg-[#070204]">
      {/* Background Image Layer with Crimson & Ruby Red Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={animeBg}
          alt="Anime Community Atmosphere"
          className="w-full h-full object-cover object-left opacity-35 filter saturate-125 contrast-125 hue-rotate-[-30deg]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080205]/95 via-[#120308]/90 to-[#070204]/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070204] via-transparent to-[#080205]/80" />

        {/* Ambient Red Glows */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-red-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-rose-600/20 rounded-full blur-[140px]" />
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
          <span className="hidden xs:inline">Don't have an account?</span>
          <Link
            to="/register"
            className="inline-flex items-center gap-1 text-red-400 hover:text-white font-black transition-colors"
          >
            <span>Register</span>
            <ArrowRight className="w-3.5 h-3.5 text-red-500" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-20 max-w-md w-full mx-auto my-auto pb-6">
        <div className="relative rounded-2xl p-5 sm:p-6 bg-[#0d0407]/95 backdrop-blur-2xl border-2 border-red-500/70 shadow-[0_0_40px_rgba(239,68,68,0.35)] transition-all">
          
          {/* Header / Avatar Box */}
          <div className="text-center space-y-2 mb-4">
            <div className="inline-flex p-2.5 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-600/20 border border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
              <Flame className="w-5 h-5 text-red-500 fill-red-500" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
                Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-white">Back</span>
              </h1>
              <p className="text-[11px] text-zinc-400 font-medium">
                Sign in to access your fandom collection and perks!
              </p>
            </div>

            <div className="w-10 h-0.5 mx-auto rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          </div>

          {serverError && (
            <div className="mb-3 p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            
            {/* Email Address */}
            <div className="space-y-0.5">
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                <Mail className="w-3 h-3 text-red-400" />
                <span>Email Address</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.hunter@fanhub.io"
                  className="w-full pl-9 pr-3 py-2 bg-[#120509]/90 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
                />
              </div>
              {errors.email && (
                <p className="text-[10px] text-red-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-2.5 h-2.5" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                  <Lock className="w-3 h-3 text-red-400" />
                  <span>Password</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[10px] font-bold text-red-400 hover:text-white transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2 bg-[#120509]/90 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] text-red-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-2.5 h-2.5" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Sign In Button */}
            <div className="pt-1.5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(239,68,68,0.5)] hover:shadow-[0_0_35px_rgba(239,68,68,0.7)] flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.01] disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Instant Demo Sign-In */}
          <div className="pt-2.5 border-t border-white/10 mt-3.5 space-y-1.5">
            <p className="text-[10px] text-zinc-400 text-center uppercase tracking-widest font-black">
              Instant Demo Sign-In
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('alex.hunter@fanhub.io')}
                className="flex items-center justify-center gap-1.5 p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-white border border-red-500/40 text-[11px] font-bold transition-all"
              >
                <User className="w-3 h-3 text-red-400" />
                <span>User Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('marcus.vance@fanhub.io')}
                className="flex items-center justify-center gap-1.5 p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-white border border-red-500/40 text-[11px] font-bold transition-all"
              >
                <Shield className="w-3 h-3 text-red-400" />
                <span>Admin Demo</span>
              </button>
            </div>
          </div>

          {/* Bottom Register Text */}
          <div className="text-center text-[11px] text-zinc-300 pt-3">
            <span>Don't have an account?</span>
            <Link
              to="/register"
              className="inline-flex items-center gap-1 text-red-400 hover:text-white font-bold ml-1.5 transition-colors"
            >
              <span>Create account</span>
              <ArrowRight className="w-3 h-3 text-red-500" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
