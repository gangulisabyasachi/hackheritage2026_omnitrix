'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export const MedicalDisclaimer: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { t } = useLanguage();

  if (compact) {
    return (
      <div className="bg-amber-50/90 border border-amber-200/80 rounded-lg p-2.5 flex items-center gap-2 text-xs text-amber-900">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
        <span>{t.disclaimer}</span>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3 text-sm text-amber-900 shadow-sm">
      <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <h4 className="font-semibold text-amber-950 mb-0.5">Medical Safety & Platform Notice</h4>
        <p className="leading-relaxed text-amber-800 text-xs sm:text-sm">{t.disclaimer}</p>
      </div>
    </div>
  );
};
