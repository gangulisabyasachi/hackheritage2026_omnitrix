'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { audioService } from '@/lib/audio';
import { api } from '@/lib/api';
import { MedicalDisclaimer } from '@/components/common/MedicalDisclaimer';
import {
  Heart,
  Brain,
  Sparkles,
  UserCheck,
  Stethoscope,
  Mic,
  ShieldCheck,
  Languages,
  Activity,
  ArrowRight,
  Key,
  Workflow,
} from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();
  const router = useRouter();

  const handleQuickDemoLogin = async (role: 'caregiver' | 'healthcare_worker' | 'patient') => {
    audioService.playFlip();

    const credentials = {
      caregiver: { email: 'caregiver@smriti.org', pass: 'REDACTED_DEMO_PASSWORD', dest: '/caregiver' },
      healthcare_worker: { email: 'doctor@smriti.org', pass: 'REDACTED_DEMO_PASSWORD', dest: '/healthcare' },
      patient: { email: 'patient@smriti.org', pass: 'REDACTED_DEMO_PASSWORD', dest: '/patient' },
    }[role];

    try {
      await api.login(credentials.email, credentials.pass);
      router.push(credentials.dest);
    } catch {
      router.push(credentials.dest);
    }
  };

  return (
    <div className="flex-1 bg-[#fdfbf7]">
      {/* Hero Section */}
      <section aria-label="Hero Introduction" className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-amber-100 bg-gradient-to-b from-amber-50/50 via-white to-[#fdfbf7]">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-rose-900 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-4 h-4 text-rose-600" />
            NeuroMitra — HackHeritage 2026 Innovation
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-tight">
            AI-Powered Cognitive Care & Memory Companion for the{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700">
              North Eastern Region
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
            A personalized, adaptive cognitive gaming platform designed for elderly dementia patients, their devoted caregivers, and healthcare workers across Assam and the North East.
          </p>

          {/* Flowchart Architecture Quick Link */}
          <div className="pt-2 flex justify-center">
            <Link
              href="/flowchart"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-100/90 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs sm:text-sm font-bold shadow-xs transition-all hover:scale-105"
            >
              <Workflow className="w-4 h-4 text-amber-700" />
              <span>Explore Interactive System Architecture & Flowchart</span>
              <ArrowRight className="w-4 h-4 text-amber-700" />
            </Link>
          </div>

          {/* Quick Portal Switcher Cards */}
          <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* 1. Patient Portal */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-md hover:shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-md mb-5 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Experience 1
                </span>
                <h3 className="text-2xl font-black text-stone-900 mt-1 mb-2">
                  Patient Portal
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  Extra-large buttons, high contrast, 5 cognitive games, daily routine checklists, and prominent voice assistant.
                </p>
              </div>

              <div className="space-y-2">
                <Link
                  href="/patient"
                  onClick={() => audioService.playFlip()}
                  className="w-full touch-target-lg py-3.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-base rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-colors text-center"
                >
                  <span>Launch Patient Mode</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => handleQuickDemoLogin('patient')}
                  className="w-full text-xs font-bold text-stone-500 hover:text-amber-800 py-1.5"
                >
                  🔑 Demo Login as Patient
                </button>
              </div>
            </div>

            {/* 2. Caregiver Portal */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-200 shadow-md hover:shadow-xl hover:border-purple-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-purple-700 text-white flex items-center justify-center shadow-md mb-5 group-hover:scale-105 transition-transform">
                  <UserCheck className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">
                  Experience 2
                </span>
                <h3 className="text-2xl font-black text-stone-900 mt-1 mb-2">
                  Caregiver Portal
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  Recharts cognitive trends, domain balance, personal memory albums, daily medication scheduling, and AI weekly summaries.
                </p>
              </div>

              <div className="space-y-2">
                <Link
                  href="/caregiver"
                  onClick={() => audioService.playFlip()}
                  className="w-full touch-target-lg py-3.5 px-4 bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-base rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-colors text-center"
                >
                  <span>Launch Caregiver Portal</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => handleQuickDemoLogin('caregiver')}
                  className="w-full text-xs font-bold text-stone-500 hover:text-purple-800 py-1.5"
                >
                  🔑 Demo Login as Caregiver
                </button>
              </div>
            </div>

            {/* 3. Healthcare Worker Portal */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-200 shadow-md hover:shadow-xl hover:border-rose-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-700 text-white flex items-center justify-center shadow-md mb-5 group-hover:scale-105 transition-transform">
                  <Stethoscope className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                  Experience 3
                </span>
                <h3 className="text-2xl font-black text-stone-900 mt-1 mb-2">
                  Clinician Portal
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  Multi-patient roster view, longitudinal engagement trajectories, domain consistency assessments, and printable consultation reports.
                </p>
              </div>

              <div className="space-y-2">
                <Link
                  href="/healthcare"
                  onClick={() => audioService.playFlip()}
                  className="w-full touch-target-lg py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-colors text-center"
                >
                  <span>Launch Clinician Portal</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => handleQuickDemoLogin('healthcare_worker')}
                  className="w-full text-xs font-bold text-stone-500 hover:text-rose-800 py-1.5"
                >
                  🔑 Demo Login as Doctor
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Credentials & Medical Disclaimer Section */}
      <section aria-label="Demo credentials and compliance" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <MedicalDisclaimer />

        {/* Demo Credentials Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center">
              <Key className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                Hackathon Demo Credentials
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Pre-seeded in database. Click any role button above or log in with these credentials:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <span className="text-xs uppercase font-bold text-purple-700 block">Caregiver</span>
              <p className="font-mono text-xs font-bold text-stone-900 mt-1">caregiver@smriti.org</p>
              <p className="font-mono text-xs text-stone-600">Password: REDACTED_DEMO_PASSWORD</p>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <span className="text-xs uppercase font-bold text-rose-700 block">Doctor / Clinician</span>
              <p className="font-mono text-xs font-bold text-stone-900 mt-1">doctor@smriti.org</p>
              <p className="font-mono text-xs text-stone-600">Password: REDACTED_DEMO_PASSWORD</p>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <span className="text-xs uppercase font-bold text-amber-700 block">Elderly Patient</span>
              <p className="font-mono text-xs font-bold text-stone-900 mt-1">patient@smriti.org</p>
              <p className="font-mono text-xs text-stone-600">Password: REDACTED_DEMO_PASSWORD</p>
            </div>
          </div>
        </div>

        {/* Core Architectural Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
            <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-stone-900 text-lg">Adaptive Cognitive Engine</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Dynamically evaluates accuracy, response speed, and mistakes (40% Acc, 25% Speed, 20% Comp, 15% Cons) to recommend personalized challenge levels with explainable human-readable reasoning.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
            <span className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-stone-900 text-lg">Grounded AI Memory Assistant</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Provides empathetic voice/chat assistance strictly grounded in the patient&apos;s real MongoDB profile, medicines, and daily routines with absolute zero hallucination.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
            <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Languages className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-stone-900 text-lg">NER Regional Accessibility</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Full multilingual support in Assamese (অসমীয়া), Bengali (বাংলা), Hindi (हिन्दी), and English, with culturally familiar North Eastern imagery (Assam tea, Japi, Gamusa, Kaziranga).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
