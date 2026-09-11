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
  Puzzle,
  TrendingUp,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface PatternQuestion {
  id: number;
  sequence: Array<{ symbol: string; label: string }>;
  correctOption: { symbol: string; label: string };
  options: Array<{ symbol: string; label: string }>;
  explanation: string;
}

const PATTERN_SETS: PatternQuestion[] = [
  {
    id: 1,
    sequence: [
      { symbol: '🔴', label: 'Red' },
      { symbol: '🔵', label: 'Blue' },
      { symbol: '🔴', label: 'Red' },
      { symbol: '🔵', label: 'Blue' },
    ],
    correctOption: { symbol: '🔴', label: 'Red' },
    options: [
      { symbol: '🔴', label: 'Red Circle' },
      { symbol: '🟡', label: 'Yellow Circle' },
      { symbol: '🟢', label: 'Green Circle' },
      { symbol: '🟣', label: 'Purple Circle' },
    ],
    explanation: 'The pattern repeats every two steps: Red, Blue, Red, Blue, so Red comes next!',
  },
  {
    id: 2,
    sequence: [
      { symbol: '🌸', label: 'Flower' },
      { symbol: '🍃', label: 'Leaf' },
      { symbol: '🌸', label: 'Flower' },
      { symbol: '🍃', label: 'Leaf' },
    ],
    correctOption: { symbol: '🌸', label: 'Flower' },
    options: [
      { symbol: '🌸', label: 'Pink Flower' },
      { symbol: '☀️', label: 'Sun' },
      { symbol: '⭐', label: 'Star' },
      { symbol: '🍄', label: 'Mushroom' },
    ],
    explanation: 'Alternating between flower and leaf: Flower, Leaf, Flower, Leaf, so Flower is next!',
  },
  {
    id: 3,
    sequence: [
      { symbol: '☕', label: 'Tea' },
      { symbol: '☕', label: 'Tea' },
      { symbol: '🍋', label: 'Lemon' },
      { symbol: '☕', label: 'Tea' },
      { symbol: '☕', label: 'Tea' },
    ],
    correctOption: { symbol: '🍋', label: 'Lemon' },
    options: [
      { symbol: '🍋', label: 'Lemon (নেমু)' },
      { symbol: '☕', label: 'Tea Cup' },
      { symbol: '🥥', label: 'Coconut' },
      { symbol: '🍎', label: 'Apple' },
    ],
    explanation: 'Two tea cups followed by one lemon: Tea, Tea, Lemon, Tea, Tea, so Lemon comes next!',
  },
  {
    id: 4,
    sequence: [
      { symbol: '⭐', label: 'Star' },
      { symbol: '🌙', label: 'Moon' },
      { symbol: '⭐', label: 'Star' },
      { symbol: '🌙', label: 'Moon' },
    ],
    correctOption: { symbol: '⭐', label: 'Star' },
    options: [
      { symbol: '⭐', label: 'Star' },
      { symbol: '☁️', label: 'Cloud' },
      { symbol: '🌧️', label: 'Rain' },
      { symbol: '⚡', label: 'Lightning' },
    ],
    explanation: 'Star, Moon, Star, Moon, so Star naturally follows!',
  },
];

export default function PatternCompletionGame() {
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

  const currentPattern = PATTERN_SETS[currentIdx % PATTERN_SETS.length];
  const totalQuestions = PATTERN_SETS.length;

  const handleSelectOption = (opt: { symbol: string; label: string }) => {
    if (isAnswered || isGameOver) return;

    setSelectedOption(opt.symbol);
    setIsAnswered(true);

    const isCorrect = opt.symbol === currentPattern.correctOption.symbol;
    if (isCorrect) {
      audioService.playMatch();
      setScore((prev) => prev + 1);
    } else {
      audioService.playFlip();
      setMistakes((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentIdx + 1 >= totalQuestions) {
        finishGame(isCorrect ? score + 1 : score, isCorrect ? mistakes : mistakes + 1);
      } else {
        setCurrentIdx((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      }
    }, 2200);
  };

  const finishGame = async (finalScore: number, finalMistakes: number) => {
    setIsGameOver(true);
    audioService.playCheer();

    const elapsedSeconds = Number(((Date.now() - startTime) / 1000).toFixed(1));
    const accuracy = Math.round((finalScore / totalQuestions) * 100);
    const overallScore = Math.max(
      40,
      Math.min(100, Math.round(0.65 * accuracy + 0.35 * Math.max(10, 100 - elapsedSeconds * 4)))
    );

    if (patientId) {
      try {
        const res = await api.submitGameSession('pattern-completion', {
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
        {/* Navigation */}
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
            <span className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center">
              <Puzzle className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {t.games.patternCompletion}
            </h1>
          </div>
          <p className="text-stone-600 text-sm sm:text-base">
            Notice how the symbols repeat. What should fill the question mark [ ? ]?
          </p>

          <div className="mt-4 flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-500 pt-3 border-t border-stone-100">
            <span>
              Pattern {currentIdx + 1} of {totalQuestions}
            </span>
            <span>Correct: {score}</span>
          </div>
        </div>

        {/* Sequence Display and Options */}
        {!isGameOver ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200/80 space-y-8 text-center">
            {/* Visual Sequence Row */}
            <div>
              <span className="text-xs uppercase font-bold text-stone-400 tracking-wider mb-4 block">
                Sequence Order:
              </span>

              <div className="flex items-center justify-center flex-wrap gap-3 sm:gap-4 p-4 sm:p-6 bg-stone-50 rounded-3xl border border-stone-200/80 shadow-inner">
                {currentPattern.sequence.map((item, idx) => (
                  <div
                    key={idx}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 border-stone-200 flex items-center justify-center text-4xl sm:text-5xl shadow-xs animate-fadeIn"
                  >
                    <span role="img" aria-label={item.label}>
                      {item.symbol}
                    </span>
                  </div>
                ))}

                {/* Arrow */}
                <span className="text-2xl sm:text-3xl text-stone-400 font-bold">➔</span>

                {/* The Question Slot */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-rose-50 border-3 border-dashed border-rose-400 flex items-center justify-center text-3xl sm:text-4xl font-extrabold text-rose-600 shadow-xs animate-pulse">
                  ?
                </div>
              </div>
            </div>

            {/* Answer Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentPattern.options.map((opt, i) => {
                const isChosen = selectedOption === opt.symbol;
                const isCorrect = opt.symbol === currentPattern.correctOption.symbol;

                let btnClass =
                  'bg-stone-50 hover:bg-rose-50/70 border-stone-300 text-stone-900';
                if (isAnswered) {
                  if (isCorrect) {
                    btnClass =
                      'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-200';
                  } else if (isChosen && !isCorrect) {
                    btnClass = 'bg-rose-100 border-rose-500 text-rose-950';
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(opt)}
                    disabled={isAnswered}
                    className={`touch-target-lg p-5 rounded-2xl border-2 font-bold text-xl sm:text-2xl flex items-center justify-between transition-all ${btnClass} active:scale-98`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-4xl" role="img" aria-label={opt.label}>
                        {opt.symbol}
                      </span>
                      <span className="text-lg font-semibold">{opt.label}</span>
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                    )}
                    {isAnswered && isChosen && !isCorrect && (
                      <XCircle className="w-6 h-6 text-rose-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation reveal */}
            {isAnswered && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-left text-sm sm:text-base animate-fadeIn">
                ✨ <span className="font-bold">Pattern Logic:</span> {currentPattern.explanation}
              </div>
            )}
          </div>
        ) : (
          /* Game Finished Modal */
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
                  You completed {score} out of {totalQuestions} visual sequence patterns!
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
                className="flex-1 touch-target-lg px-6 py-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-lg rounded-2xl shadow-md transition-transform active:scale-98"
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
