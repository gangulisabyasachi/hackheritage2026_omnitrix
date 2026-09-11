'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { SupportedLanguage } from '@/lib/i18n/translations';
import { audioService } from '@/lib/audio';
import {
  Heart,
  Volume2,
  VolumeX,
  Globe,
  UserCheck,
  Stethoscope,
  Sparkles,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { api } from '@/lib/api';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [soundOn, setSoundOn] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    setSoundOn(audioService.isEnabled());
    api
      .getMe()
      .then((res) => {
        if (res.success) setCurrentUser(res.user);
      })
      .catch(() => {});
  }, []);

  const toggleSound = () => {
    const newState = audioService.toggleSound();
    setSoundOn(newState);
    if (newState) audioService.playFlip();
  };

  const handleLogout = () => {
    api.setToken(null);
    setCurrentUser(null);
    router.push('/');
  };

  const isPatientView = pathname.startsWith('/patient');
  const isCaregiverView = pathname.startsWith('/caregiver');
  const isHealthcareView = pathname.startsWith('/healthcare');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl p-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Heart className="w-7 h-7 fill-white/20 stroke-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tight text-stone-900 group-hover:text-amber-700 transition-colors">
                  {t.appName}
                </span>
                <span className="bg-rose-100 text-rose-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-rose-200">
                  NER Edition
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </Link>

          {/* Navigation Links for Active Mode */}
          <nav className="hidden md:flex items-center gap-1.5 bg-stone-50 p-1.5 rounded-2xl border border-stone-200/80">
            <Link
              href="/patient"
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                isPatientView
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-700 hover:text-amber-700 hover:bg-stone-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {t.roles.patient}
            </Link>

            <Link
              href="/caregiver"
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                isCaregiverView
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-700 hover:text-amber-700 hover:bg-stone-100'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              {t.roles.caregiver}
            </Link>

            <Link
              href="/healthcare"
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                isHealthcareView
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-700 hover:text-amber-700 hover:bg-stone-100'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              {t.roles.clinician}
            </Link>
          </nav>

          {/* Controls: Language, Sound, User */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative flex items-center bg-stone-100/90 rounded-xl px-2 py-1.5 border border-stone-200">
              <Globe className="w-4 h-4 text-stone-500 mr-1.5" />
              <select
                aria-label="Select Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-sm font-medium text-stone-800 cursor-pointer focus:outline-none pr-1"
              >
                <option value="en">English (EN)</option>
                <option value="as">অসমীয়া (Assamese)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="bn">বাংলা (Bengali)</option>
              </select>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              aria-label={soundOn ? 'Mute sound effects' : 'Enable sound effects'}
              className="p-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-colors"
              title={soundOn ? t.common.soundOn : t.common.soundOff}
            >
              {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-stone-400" />}
            </button>

            {/* Quick Demo Switch / Auth button */}
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-rose-700 hover:bg-rose-50 border border-stone-200 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.common.logout}</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                {t.common.login}
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleSound}
              aria-label="Toggle sound"
              className="p-2 rounded-xl border border-stone-200 text-stone-700"
            >
              {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-stone-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <div className="grid grid-cols-1 gap-2">
            <Link
              href="/patient"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-3 rounded-xl font-bold flex items-center gap-3 ${
                isPatientView ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-800'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              {t.roles.patient}
            </Link>

            <Link
              href="/caregiver"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-3 rounded-xl font-bold flex items-center gap-3 ${
                isCaregiverView ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-800'
              }`}
            >
              <UserCheck className="w-5 h-5" />
              {t.roles.caregiver}
            </Link>

            <Link
              href="/healthcare"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-3 rounded-xl font-bold flex items-center gap-3 ${
                isHealthcareView ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-800'
              }`}
            >
              <Stethoscope className="w-5 h-5" />
              {t.roles.clinician}
            </Link>
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <label htmlFor="mobile-lang-select" className="text-xs text-stone-500">Language / ভাষা:</label>
            <select
              id="mobile-lang-select"
              aria-label="Select Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-stone-100 text-sm font-semibold rounded-lg px-2 py-1 border border-stone-300"
            >
              <option value="en">English</option>
              <option value="as">অসমীয়া (Assamese)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="bn">বাংলা (Bengali)</option>
            </select>
          </div>
        </div>
      )}
    </header>
  );
};
