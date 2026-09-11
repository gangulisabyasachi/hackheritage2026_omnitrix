'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { audioService } from '@/lib/audio';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Check } from 'lucide-react';

interface MoodSelectorProps {
  patientId: string;
  initialMood?: string | null;
  onMoodRecorded?: (mood: string) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  patientId,
  initialMood = null,
  onMoodRecorded,
}) => {
  const { t } = useLanguage();
  const [selectedMood, setSelectedMood] = useState<string | null>(initialMood);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const moods = [
    {
      id: 'good',
      label: t.patientHome.feelingGood,
      emoji: '😊',
      bgClass: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-950',
      activeClass: 'ring-4 ring-emerald-500 bg-emerald-100 border-emerald-500',
    },
    {
      id: 'okay',
      label: t.patientHome.feelingOkay,
      emoji: '😐',
      bgClass: 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-950',
      activeClass: 'ring-4 ring-amber-500 bg-amber-100 border-amber-500',
    },
    {
      id: 'not_well',
      label: t.patientHome.feelingNotWell,
      emoji: '😟',
      bgClass: 'bg-rose-50 hover:bg-rose-100 border-rose-300 text-rose-950',
      activeClass: 'ring-4 ring-rose-500 bg-rose-100 border-rose-500',
    },
  ];

  const handleSelect = async (moodId: string) => {
    setSelectedMood(moodId);
    audioService.playFlip();
    setIsSubmitting(true);

    try {
      if (patientId) {
        await api.submitMood(patientId, moodId);
      }
      setShowThankYou(true);
      if (onMoodRecorded) onMoodRecorded(moodId);
      setTimeout(() => setShowThankYou(false), 4000);
    } catch (err) {
      console.warn('Could not record mood to backend:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section aria-label="Daily mood check-in" className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80">
      <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2">
        {t.patientHome.howAreYou}
      </h2>
      <p className="text-stone-600 text-sm sm:text-base mb-6">
        Tap the button that matches how your mind and body feel right now.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {moods.map((m) => {
          const isSelected = selectedMood === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleSelect(m.id)}
              disabled={isSubmitting}
              className={`touch-target-lg p-5 rounded-2xl border-2 text-left flex items-center justify-between transition-all transform active:scale-98 ${
                m.bgClass
              } ${isSelected ? m.activeClass : 'shadow-sm'}`}
            >
              <div className="flex items-center gap-3.5">
                <span className="text-3xl sm:text-4xl select-none" role="img" aria-label={m.id}>
                  {m.emoji}
                </span>
                <span className="text-lg sm:text-xl font-bold tracking-tight">
                  {m.label.replace(/^[^\s]+\s/, '')}
                </span>
              </div>
              {isSelected && (
                <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 stroke-[3]" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {showThankYou && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-center font-medium animate-fadeIn">
          🌸 Thank you for checking in! Your comfort and wellness are deeply cherished.
        </div>
      )}
    </section>
  );
};
