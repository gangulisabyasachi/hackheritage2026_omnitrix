'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { api } from '@/lib/api';
import { audioService } from '@/lib/audio';
import { MoodSelector } from '@/components/patient/MoodSelector';
import { VoiceAssistantModal } from '@/components/patient/VoiceAssistantModal';
import {
  Brain,
  Puzzle,
  Eye,
  CalendarClock,
  HeartHandshake,
  CheckCircle2,
  Circle,
  Mic,
  Sparkles,
  ChevronRight,
  Pill,
  Droplets,
  Calendar,
} from 'lucide-react';

export default function PatientHomePage() {
  const { t } = useLanguage();
  const [patient, setPatient] = useState<any>(null);
  const [routines, setRoutines] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load demo patient data
  useEffect(() => {
    async function loadData() {
      try {
        const patientsRes = await api.getPatients();
        let targetPatient = null;
        if (patientsRes.patients && patientsRes.patients.length > 0) {
          targetPatient = patientsRes.patients[0];
        }

        if (targetPatient) {
          const detail = await api.getPatientById(targetPatient._id);
          if (detail.patient) {
            setPatient(detail.patient);
            setRoutines(detail.patient.routines || []);
            setReminders(detail.patient.reminders || []);
          }
        }
      } catch (err) {
        console.warn('Error loading patient data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleCheckItem = (id: string) => {
    audioService.playFlip();
    setCompletedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const patientId = patient?._id || 'demo-patient-id';
  const patientName = patient?.name || 'Mrs. Ananya Das';

  const games = [
    {
      id: 'memory-match',
      title: t.games.memoryMatch,
      desc: t.games.memoryMatchDesc,
      icon: Brain,
      gradient: 'from-amber-500 to-amber-700',
      bgCard: 'bg-amber-50/70 border-amber-200 hover:border-amber-400',
      textColor: 'text-amber-950',
      href: '/patient/games/memory-match',
    },
    {
      id: 'pattern-completion',
      title: t.games.patternCompletion,
      desc: t.games.patternCompletionDesc,
      icon: Puzzle,
      gradient: 'from-rose-500 to-rose-700',
      bgCard: 'bg-rose-50/70 border-rose-200 hover:border-rose-400',
      textColor: 'text-rose-950',
      href: '/patient/games/pattern-completion',
    },
    {
      id: 'object-recognition',
      title: t.games.objectRecognition,
      desc: t.games.objectRecognitionDesc,
      icon: Eye,
      gradient: 'from-emerald-500 to-emerald-700',
      bgCard: 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-400',
      textColor: 'text-emerald-950',
      href: '/patient/games/object-recognition',
    },
    {
      id: 'routine-recall',
      title: t.games.routineRecall,
      desc: t.games.routineRecallDesc,
      icon: CalendarClock,
      gradient: 'from-sky-500 to-sky-700',
      bgCard: 'bg-sky-50/70 border-sky-200 hover:border-sky-400',
      textColor: 'text-sky-950',
      href: '/patient/games/routine-recall',
    },
    {
      id: 'family-memory',
      title: t.games.familyMemory,
      desc: t.games.familyMemoryDesc,
      icon: HeartHandshake,
      gradient: 'from-purple-500 to-purple-700',
      bgCard: 'bg-purple-50/70 border-purple-200 hover:border-purple-400',
      textColor: 'text-purple-950',
      href: '/patient/games/family-memory',
    },
  ];

  return (
    <div className="flex-1 bg-[#fbf9f4] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Welcome Header */}
        <section aria-label="Welcome and summary" className="bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                North East Cognitive Wellness
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                {t.patientHome.goodMorning.replace('Mrs. Ananya Das', patientName)}
              </h1>
              <p className="mt-2 text-amber-100 text-base sm:text-lg max-w-xl">
                Welcome to your peaceful memory companion. Take your time, relax, and enjoy today&apos;s gentle brain exercises.
              </p>
            </div>

            {/* Quick Talk Button in Header */}
            <button
              onClick={() => {
                audioService.playFlip();
                setIsVoiceModalOpen(true);
              }}
              className="touch-target-lg px-7 py-4 bg-white text-stone-900 hover:bg-amber-50 rounded-2xl shadow-lg font-bold text-lg flex items-center gap-3 transition-transform active:scale-95 shrink-0"
            >
              <Mic className="w-6 h-6 text-rose-600 fill-rose-100" />
              <span>{t.patientHome.talkToAssistant}</span>
            </button>
          </div>
        </section>

        {/* Daily Mood Selector */}
        <MoodSelector patientId={patientId} initialMood={patient?.todayMood} />

        {/* Today's Cognitive Games */}
        <section aria-label="Brain activities">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                {t.patientHome.todayActivities}
              </h2>
              <p className="text-stone-600 text-sm sm:text-base">
                Select any activity to stimulate memory, focus, and visual joy.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {games.map((g) => {
              const Icon = g.icon;
              return (
                <Link
                  key={g.id}
                  href={g.href}
                  onClick={() => audioService.playFlip()}
                  className={`touch-target-lg p-6 rounded-3xl border-2 ${g.bgCard} shadow-sm hover:shadow-md transition-all flex flex-col justify-between group active:scale-98`}
                >
                  <div>
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${g.gradient} text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-9 h-9 stroke-[2.2]" />
                    </div>
                    <h3 className={`text-xl sm:text-2xl font-bold ${g.textColor} mb-1`}>
                      {g.title}
                    </h3>
                    <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                      {g.desc}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-stone-200/60">
                    <span className="text-sm font-bold text-stone-800">
                      {t.games.playNow}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-stone-700 group-hover:translate-x-1 transition-transform shadow-xs">
                      <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Today's Schedule and Medicines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Schedule */}
          <section aria-label="Today's schedule" className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <CalendarClock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
                  {t.patientHome.todayRoutine}
                </h2>
                <p className="text-xs sm:text-sm text-stone-500">
                  Tap any item to mark it completed for today
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {routines.length > 0 ? (
                routines.map((r, i) => {
                  const isDone = completedItems[r._id || i] ?? false;
                  return (
                    <button
                      key={r._id || i}
                      onClick={() => toggleCheckItem(r._id || i)}
                      className={`w-full touch-target text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${isDone
                          ? 'bg-stone-50/80 border-stone-200 text-stone-400'
                          : 'bg-amber-50/40 hover:bg-amber-50 border-amber-100 text-stone-800'
                        }`}
                    >
                      <div className="flex items-center gap-3.5">
                        {isDone ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="w-6 h-6 text-amber-500 shrink-0" />
                        )}
                        <div>
                          <span className="font-bold text-base sm:text-lg block">
                            {r.activity}
                          </span>
                          {r.description && (
                            <span className="text-xs sm:text-sm text-stone-500 block">
                              {r.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold px-3 py-1 bg-white rounded-xl border border-stone-200 text-stone-600 shrink-0">
                        {r.time}
                      </span>
                    </button>
                  );
                })
              ) : (
                <p className="text-stone-500 text-center py-6">
                  No routine items loaded. Your caregiver will schedule your day!
                </p>
              )}
            </div>
          </section>

          {/* Today's Reminders & Medicines */}
          <section aria-label="Reminders and medicine" className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center">
                <Pill className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
                  Medicine & Hydration Reminders
                </h2>
                <p className="text-xs sm:text-sm text-stone-500">
                  Carefully scheduled with your family doctor
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {reminders.length > 0 ? (
                reminders.map((rem, i) => {
                  const isDone = rem.status === 'completed' || completedItems[`rem_${rem._id || i}`];
                  return (
                    <button
                      key={rem._id || i}
                      onClick={() => toggleCheckItem(`rem_${rem._id || i}`)}
                      className={`w-full touch-target text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${isDone
                          ? 'bg-stone-50/80 border-stone-200 text-stone-400'
                          : 'bg-rose-50/40 hover:bg-rose-50 border-rose-100 text-stone-800'
                        }`}
                    >
                      <div className="flex items-center gap-3.5">
                        {rem.type === 'hydration' ? (
                          <Droplets className="w-6 h-6 text-sky-500 shrink-0" />
                        ) : (
                          <Pill className="w-6 h-6 text-rose-500 shrink-0" />
                        )}
                        <div>
                          <span className="font-bold text-base sm:text-lg block">
                            {rem.title}
                          </span>
                          {rem.description && (
                            <span className="text-xs sm:text-sm text-stone-500 block">
                              {rem.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold px-3 py-1 bg-white rounded-xl border border-stone-200 text-stone-600 shrink-0">
                        {rem.scheduledTime}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm">
                  ✨ All scheduled medicines and hydration for today are up to date!
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Floating Voice Assistant Action Bar for Elderly Ease */}
        <div className="sticky bottom-6 z-30 flex justify-center">
          <button
            onClick={() => {
              audioService.playFlip();
              setIsVoiceModalOpen(true);
            }}
            className="touch-target-lg px-8 py-4.5 bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 hover:from-amber-700 hover:to-rose-700 text-white rounded-full shadow-2xl flex items-center gap-4 text-xl font-extrabold transform hover:scale-105 active:scale-95 transition-all ring-4 ring-white/80"
          >
            <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
              <Mic className="w-6 h-6" />
            </span>
            <span>🎤 {t.patientHome.talkToAssistant}</span>
          </button>
        </div>
      </div>

      {/* Voice Modal */}
      <VoiceAssistantModal
        patientId={patientId}
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </div>
  );
}
