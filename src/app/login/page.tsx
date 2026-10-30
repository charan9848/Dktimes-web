'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      console.error(err);
      setError(
        err.code === 'auth/invalid-credential'
          ? 'Invalid email or password. Please verify your credentials.'
          : err.message || 'Failed to sign in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#FFFDF7] dark:bg-[#141414] rounded-2xl border border-[rgba(33,29,24,0.12)] dark:border-white/10 p-6 md:p-8 shadow-sm transition-colors">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <h1 className="font-serif font-black text-2xl text-[#1C3D5A] dark:text-sky-400 tracking-tight">DK TIMES</h1>
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6F675C] dark:text-slate-400 mt-1">
            Reader Portal Sign In
          </p>
          <h2 className="text-xl font-bold text-[#211D18] dark:text-white mt-3">Welcome Back</h2>
          <p className="text-xs text-[#6F675C] dark:text-slate-400 mt-1">
            Sign in to unlock personalized editions, saved stories, and commenting.
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold p-3 rounded-xl flex items-center gap-2">
            <span>•</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F675C] dark:text-slate-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F675C] dark:text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#F5F1E8] dark:bg-white/10 border border-[rgba(33,29,24,0.15)] dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-[#211D18] dark:text-white focus:outline-none focus:border-[#1C3D5A] dark:focus:border-sky-400 placeholder:text-[#6F675C]/70 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F675C] dark:text-slate-400">
                Password
              </label>
              <a href="#" className="text-[10px] font-semibold text-[#1C3D5A] dark:text-sky-400 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F675C] dark:text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F5F1E8] dark:bg-white/10 border border-[rgba(33,29,24,0.15)] dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-[#211D18] dark:text-white focus:outline-none focus:border-[#1C3D5A] dark:focus:border-sky-400 placeholder:text-[#6F675C]/70 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1C3D5A] hover:bg-[#142A3E] dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-sm mt-2 cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign In to DK Times'} <ArrowRight size={14} />
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[rgba(33,29,24,0.1)] dark:border-white/10"></div>
          </div>
          <span className="relative bg-[#FFFDF7] dark:bg-[#141414] px-3 text-[10px] uppercase font-bold text-[#6F675C] dark:text-slate-400">
            Or continue with
          </span>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={loading}
          className="w-full bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/15 border border-[rgba(33,29,24,0.15)] dark:border-white/10 text-[#211D18] dark:text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google Account
        </button>

        <p className="text-center text-xs text-[#6F675C] dark:text-slate-400 mt-6">
          Don&apos;t have an account yet?{' '}
          <Link href="/signup" className="font-bold text-[#1C3D5A] dark:text-sky-400 hover:underline">
            Register for Free
          </Link>
        </p>
      </div>
    </main>
  );
}
