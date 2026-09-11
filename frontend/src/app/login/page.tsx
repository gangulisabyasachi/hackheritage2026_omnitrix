'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { audioService } from '@/lib/audio';
import { Heart, Lock, Mail, ArrowRight, UserCheck, Stethoscope, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    audioService.playFlip();

    try {
      const res = await api.login(email, password);
      if (res.success) {
        const role = res.user.role;
        if (role === 'patient') router.push('/patient');
        else if (role === 'healthcare_worker') router.push('/healthcare');
        else router.push('/caregiver');
      } else {
        setError(res.message || 'Invalid credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    audioService.playFlip();
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fdfbf7]">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/90 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-600 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md mb-4">
            <Heart className="w-9 h-9 fill-white/20 stroke-white stroke-[2.2]" />
          </div>
          <h2 className="text-3xl font-black text-stone-900 tracking-tight">Sign In to Smriti</h2>
          <p className="text-stone-500 text-sm mt-1">
            Access the cognitive wellness & memory assistance portal
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full touch-target-lg py-4 px-6 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 disabled:opacity-50 text-white font-extrabold text-lg rounded-2xl shadow-md transition-transform active:scale-98 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Quick Demo Credentials Autofill */}
        <div className="pt-4 border-t border-stone-100">
          <p className="text-xs font-bold uppercase text-stone-400 text-center mb-3">
            Quick 1-Click Demo Accounts
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => fillDemo('caregiver@smriti.org', 'REDACTED_DEMO_PASSWORD')}
              className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold rounded-xl border border-purple-200 text-center transition-colors"
            >
              Caregiver
            </button>
            <button
              onClick={() => fillDemo('doctor@smriti.org', 'REDACTED_DEMO_PASSWORD')}
              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-900 font-bold rounded-xl border border-rose-200 text-center transition-colors"
            >
              Doctor
            </button>
            <button
              onClick={() => fillDemo('patient@smriti.org', 'REDACTED_DEMO_PASSWORD')}
              className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-xl border border-amber-200 text-center transition-colors"
            >
              Patient
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
