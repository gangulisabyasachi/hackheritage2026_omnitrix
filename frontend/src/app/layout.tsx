import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { Navbar } from '@/components/common/Navbar';

export const metadata: Metadata = {
  title: 'Smriti NER — Cognitive Gaming & Memory Assistance Platform',
  description:
    'AI-Based Cognitive Gaming and Memory Assistance Platform for Elderly Dementia Patients in the North Eastern Region (NER)',
  keywords:
    'cognitive engagement, dementia care, elderly assistance, North East India, Assam, memory games, adaptive AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#fdfbf7] text-stone-900 selection:bg-amber-100 selection:text-amber-900">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <footer className="bg-stone-900 text-stone-300 py-8 border-t border-stone-800 text-xs sm:text-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-stone-100 text-base">
                  Smriti NER (স্মৃতি) — HackHeritage 2026
                </p>
                <p className="text-stone-400 text-xs mt-1">
                  Empowering elderly cognitive wellness, memory recall, and caregiver connection across North East India.
                </p>
              </div>
              <div className="text-right text-stone-400 text-xs">
                <p>Designed with ❤️ for accessible, high-contrast, low-cognitive-load care.</p>
                <p className="mt-0.5">Non-clinical cognitive activity monitoring platform.</p>
              </div>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
