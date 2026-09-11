'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { audioService } from '@/lib/audio';
import { api } from '@/lib/api';
import {
  ArrowLeft,
  RefreshCw,
  Trophy,
  Eye,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

interface ObjectItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
  funFact: string;
  options: string[];
}

const OBJECT_QUESTIONS: ObjectItem[] = [
  {
    id: 'japi',
    name: 'Assam Japi (জাপী)',
    emoji: '👒',
    category: 'Cultural Headgear',
    funFact: 'A conical traditional hat woven from tightly spun bamboo and tokou leaves, symbolizing Assamese respect and honor.',
    options: ['Assam Japi (জাপী)', 'Bamboo Basket', 'Umbrella', 'Hand Fan'],
  },
  {
    id: 'tea',
    name: 'Assam Tea Kettle (চাহৰ কেটলী)',
    emoji: '☕',
    category: 'Kitchen & Daily Life',
    funFact: 'Assam produces some of the finest malty black tea in the world, savored in millions of households every morning.',
    options: ['Assam Tea Kettle', 'Clay Pot', 'Water Jug', 'Coffee Mug'],
  },
  {
    id: 'gamusa',
    name: 'Gamusa Scarf (গামোচা)',
    emoji: '🧣',
    category: 'Cultural Textile',
    funFact: 'A white cotton towel woven with red floral patterns, presented to guests and elders as a sacred token of love and devotion.',
    options: ['Gamusa Scarf', 'Woolen Shawl', 'Curtain', 'Cotton Blanket'],
  },
  {
    id: 'rhino',
    name: 'One-Horned Rhino (গঁড়)',
    emoji: '🦏',
    category: 'Wildlife & Nature',
    funFact: 'Kaziranga National Park in Assam is the proud home to the world’s largest population of great one-horned rhinoceroses.',
    options: ['One-Horned Rhino', 'Wild Elephant', 'Royal Bengal Tiger', 'Water Buffalo'],
  },
  {
    id: 'diya',
    name: 'Clay Diya / Lamp (চাকি)',
    emoji: '🪔',
    category: 'Household & Festivity',
    funFact: 'Lit on festival evenings with mustard oil, bringing light, peace, and warmth to every room.',
    options: ['Clay Diya / Lamp', 'Wax Candle', 'Electric Bulb', 'Flashlight'],
  },
  {
    id: 'nemu',
    name: 'Kaji Nemu Lemon (কাজী নেমু)',
    emoji: '🍋',
    category: 'Local Fruits',
    funFact: 'The fragrant, elongated Assam lemon famous for its uplifting aroma and refreshing vitamin-rich juice.',
    options: ['Kaji Nemu Lemon', 'Green Mango', 'Guava', 'Cucumber'],
  },
];

export default function ObjectRecognitionGame() {
  const { t } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [isGameOver, setIsGameOver] = useState(false);
  const [adaptiveResult, setAdaptiveResult] = useState<any>(null);
  const [patientId, setPatientId] = useState<string>('');

  useEffect(() => {
    api.getPatients().then((res) => {
      if (res.patients && res.patients.length > 0) {
        setPatientId(res.patients[0]._id);
      }
    });
  }, []);

  const totalQuestions = 4;
  const currentItem = OBJECT_QUESTIONS[currentIdx % OBJECT_QUESTIONS.length];

  const handleOptionSelect = (option: string) => {
    if (isAnswered || isGameOver) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentItem.name;
    if (isCorrect) {
      audioService.playMatch();
      setScore((prev) => prev + 1);
    } else {
      audioService.playFlip();
      setMistakes((prev) => prev + 1);
    }

    // Auto advance after 2 seconds
    setTimeout(() => {
      if (currentIdx + 1 >= totalQuestions) {
        finishGame(isCorrect ? score + 1 : score, isCorrect ? mistakes : mistakes + 1);
      } else {
        setCurrentIdx((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      }
    }, 2000);
  };

  const finishGame = async (finalScore: number, finalMistakes: number) => {
    setIsGameOver(true);
    audioService.playCheer();

    const elapsedSeconds = Number(((Date.now() - startTime) / 1000).toFixed(1));
    const accuracy = Math.round((finalScore / totalQuestions) * 100);
    const overallScore = Math.max(
      40,
      Math.min(100, Math.round(0.7 * accuracy + 0.3 * Math.max(10, 100 - elapsedSeconds * 4)))
    );

    if (patientId) {
      try {
        const res = await api.submitGameSession('object-recognition', {
          patientId,
          difficulty: 2,
          score: overallScore,
          accuracy,
          responseTime: elapsedSeconds,
          attempts: 1,
          mistakes: finalMistakes,
          completed: true,
          metadata: { questionsCount: totalQuestions },
        });

        if (res.success) {
          setAdaptiveResult(res.adaptiveRecommendation);
        }
      } catch (err) {
        console.warn('Error recording session:', err);
      }
    }
  };

  const restartGame = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setMistakes(0);
    setIsGameOver(false);
    setAdaptiveResult(null);
    setStartTime(Date.now());
  };

  return (
    <div className="flex-1 bg-[#fdfbf7] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/patient"
            onClick={() => audioService.playFlip()}
            className="touch-target inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:bg-amber-50 font-bold shadow-xs transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t.common.home}</span>
          </Link>

          <button
            onClick={restartGame}
            className="touch-target p-2.5 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors"
            title="Restart"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Title Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {t.games.objectRecognition}
            </h1>
          </div>
          <p className="text-stone-600 text-sm sm:text-base">
            Look at the picture below and select the matching name. Take your time!
          </p>

          <div className="mt-4 flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-500 pt-3 border-t border-stone-100">
            <span>
              Question {currentIdx + 1} of {totalQuestions}
            </span>
            <span>Score: {score}</span>
          </div>
        </div>

        {/* Question & Choices */}
        {!isGameOver ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200/80 space-y-8 text-center">
            {/* Object Display */}
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center shadow-inner mb-4 animate-fadeIn">
                <span className="text-8xl sm:text-9xl select-none" role="img" aria-label={currentItem.name}>
                  {currentItem.emoji}
                </span>
              </div>
              <span className="text-xs uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-bold">
                {currentItem.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-2">
                What is this object? (ইটো কি বস্তু?)
              </h2>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentItem.options.map((opt, i) => {
                const isChosen = selectedOption === opt;
                const isCorrect = opt === currentItem.name;

                let btnStyle =
                  'bg-stone-50 hover:bg-amber-50/80 border-stone-300 text-stone-800';
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle =
                      'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-200';
                  } else if (isChosen && !isCorrect) {
                    btnStyle = 'bg-rose-100 border-rose-500 text-rose-950';
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleOptionSelect(opt)}
                    disabled={isAnswered}
                    className={`touch-target-lg p-5 rounded-2xl border-2 text-lg sm:text-xl font-bold transition-all flex items-center justify-between ${btnStyle} active:scale-98`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />
                    )}
                    {isAnswered && isChosen && !isCorrect && (
                      <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Fun Fact reveal on answer */}
            {isAnswered && (
              <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl text-stone-800 text-left text-sm sm:text-base animate-fadeIn">
                💡 <span className="font-bold">Heritage Note:</span> {currentItem.funFact}
              </div>
            )}
          </div>
        ) : (
          /* Game Over Modal */
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-emerald-300 animate-fadeIn space-y-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Trophy className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                  {t.games.completedMessage}
                </h2>
                <p className="text-stone-600 text-sm sm:text-base">
                  You identified {score} out of {totalQuestions} objects accurately!
                </p>
              </div>
            </div>

            {adaptiveResult && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-700" />
                  <h3 className="font-bold text-amber-950 text-base sm:text-lg">
                    {t.games.nextRecommended}
                  </h3>
                </div>
                <p className="text-amber-900 text-sm sm:text-base leading-relaxed">
                  {adaptiveResult.reason}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={restartGame}
                className="flex-1 touch-target-lg px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg rounded-2xl shadow-md transition-transform active:scale-98"
              >
                🎮 {t.games.playAgain}
              </button>
              <Link
                href="/patient"
                className="touch-target-lg px-6 py-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-lg rounded-2xl border border-stone-200 transition-colors text-center"
              >
                {t.games.returnHome}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
