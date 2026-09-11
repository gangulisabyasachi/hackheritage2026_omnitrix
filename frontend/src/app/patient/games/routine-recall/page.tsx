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
  CalendarClock,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';

interface RoutineQuestion {
  question: string;
  correctAnswer: string;
  options: string[];
  hint: string;
}

export default function RoutineRecallGame() {
  const { t } = useLanguage();
  const [routines, setRoutines] = useState<any[]>([]);
  const [questions, setQuestions] = useState<RoutineQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [isGameOver, setIsGameOver] = useState(false);
  const [adaptiveResult, setAdaptiveResult] = useState<any>(null);
  const [patientId, setPatientId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const pRes = await api.getPatients();
        if (pRes.patients && pRes.patients.length > 0) {
          const p = pRes.patients[0];
          setPatientId(p._id);
          const detail = await api.getPatientById(p._id);
          const rList = detail.patient?.routines || [];
          setRoutines(rList);
          generateQuestions(rList);
        }
      } catch (err) {
        console.warn('Error fetching routines:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const generateQuestions = (routineList: any[]) => {
    if (!routineList || routineList.length < 3) {
      // Fallback routine if db empty
      const fallbackList = [
        { time: '08:30 AM', activity: 'Morning Breakfast' },
        { time: '09:15 AM', activity: 'Morning Medicine' },
        { time: '10:30 AM', activity: 'Brain Exercise Time' },
        { time: '01:00 PM', activity: 'Wholesome Lunch' },
      ];
      buildQuestionsFromList(fallbackList);
    } else {
      buildQuestionsFromList(routineList);
    }
  };

  const buildQuestionsFromList = (list: any[]) => {
    const qList: RoutineQuestion[] = [];

    // Question 1: What happens after item 0?
    if (list.length >= 2) {
      const target = list[1];
      const prev = list[0];
      const distractor1 = list.length > 2 ? list[2].activity : 'Evening Walk';
      const distractor2 = list.length > 3 ? list[3].activity : 'Night Sleep';
      const distractor3 = 'Gardening';

      qList.push({
        question: `According to your morning schedule, what comes right after "${prev.activity}"?`,
        correctAnswer: target.activity,
        options: shuffleArray([target.activity, distractor1, distractor2, distractor3]),
        hint: `Scheduled at around ${target.time}.`,
      });
    }

    // Question 2: What is scheduled at a specific time?
    if (list.length >= 3) {
      const target = list[2];
      const distractor1 = list[0].activity;
      const distractor2 = list.length > 3 ? list[3].activity : 'Breakfast';
      const distractor3 = 'Afternoon Tea';

      qList.push({
        question: `What joyful activity do you have scheduled at ${target.time}?`,
        correctAnswer: target.activity,
        options: shuffleArray([target.activity, distractor1, distractor2, distractor3]),
        hint: 'It helps keep your mind sharp and refreshed.',
      });
    }

    // Question 3: What do you do before lunch or in evening?
    if (list.length >= 4) {
      const target = list[list.length - 1];
      const distractor1 = list[0].activity;
      const distractor2 = list[1].activity;
      const distractor3 = 'Morning Walk';

      qList.push({
        question: `What is your evening routine item scheduled for ${target.time}?`,
        correctAnswer: target.activity,
        options: shuffleArray([target.activity, distractor1, distractor2, distractor3]),
        hint: `It wraps up your day with comfort.`,
      });
    }

    setQuestions(qList);
    setCurrentIdx(0);
    setScore(0);
    setMistakes(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setStartTime(Date.now());
  };

  const shuffleArray = (arr: string[]) => {
    const unique = Array.from(new Set(arr));
    return unique.sort(() => Math.random() - 0.5);
  };

  const handleSelectOption = (opt: string) => {
    if (isAnswered || isGameOver || !questions[currentIdx]) return;

    setSelectedOption(opt);
    setIsAnswered(true);

    const isCorrect = opt === questions[currentIdx].correctAnswer;
    if (isCorrect) {
      audioService.playMatch();
      setScore((prev) => prev + 1);
    } else {
      audioService.playFlip();
      setMistakes((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentIdx + 1 >= questions.length) {
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
    const totalQ = Math.max(1, questions.length);
    const accuracy = Math.round((finalScore / totalQ) * 100);
    const overallScore = Math.max(
      40,
      Math.min(100, Math.round(0.7 * accuracy + 0.3 * Math.max(10, 100 - elapsedSeconds * 5)))
    );

    if (patientId) {
      try {
        const res = await api.submitGameSession('routine-recall', {
          patientId,
          difficulty: 1,
          score: overallScore,
          accuracy,
          responseTime: elapsedSeconds,
          attempts: 1,
          mistakes: finalMistakes,
          completed: true,
          metadata: { questionsCount: totalQ },
        });

        if (res.success) {
          setAdaptiveResult(res.adaptiveRecommendation);
        }
      } catch (err) {
        console.warn('Error recording routine session:', err);
      }
    }
  };

  const currentQ = questions[currentIdx];

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
            onClick={() => generateQuestions(routines)}
            className="touch-target p-2.5 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors"
            title="Restart"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Title Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center">
              <CalendarClock className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {t.games.routineRecall}
            </h1>
          </div>
          <p className="text-stone-600 text-sm sm:text-base">
            This activity uses your personal daily schedule entered by your caregiver to help you recall your healthy daily routine!
          </p>

          <div className="mt-4 flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-500 pt-3 border-t border-stone-100">
            <span>
              Question {currentIdx + 1} of {questions.length || 3}
            </span>
            <span>Correct: {score}</span>
          </div>
        </div>

        {/* Routine Schedule Reference Ribbon */}
        {routines.length > 0 && (
          <div className="bg-sky-50 border border-sky-200 rounded-3xl p-5 overflow-x-auto">
            <span className="text-xs uppercase font-bold text-sky-800 tracking-wider flex items-center gap-1.5 mb-2">
              <Clock className="w-4 h-4" />
              Your Daily Flow Reference:
            </span>
            <div className="flex items-center gap-3 min-w-max">
              {routines.slice(0, 5).map((r, i) => (
                <div
                  key={i}
                  className="bg-white px-3.5 py-2 rounded-xl border border-sky-200 text-xs text-sky-950 font-medium shadow-xs"
                >
                  <span className="text-sky-700 font-bold block">{r.time}</span>
                  <span>{r.activity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Question & Choices */}
        {!isGameOver && currentQ ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200/80 space-y-8 text-center">
            <div>
              <span className="text-xs uppercase tracking-widest text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 font-bold">
                Daily Schedule Memory
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-3 leading-snug">
                {currentQ.question}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQ.options.map((opt, i) => {
                const isChosen = selectedOption === opt;
                const isCorrect = opt === currentQ.correctAnswer;

                let btnClass =
                  'bg-stone-50 hover:bg-sky-50 border-stone-300 text-stone-900';
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
                    className={`touch-target-lg p-5 rounded-2xl border-2 font-bold text-lg sm:text-xl flex items-center justify-between transition-all ${btnClass} active:scale-98`}
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

            {isAnswered && (
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-sky-950 text-left text-sm sm:text-base animate-fadeIn">
                💡 <span className="font-bold">Helpful Clue:</span> {currentQ.hint}
              </div>
            )}
          </div>
        ) : isGameOver ? (
          /* Finished Card */
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
                  You successfully recalled your daily routine with {score} out of {questions.length} correct answers!
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
                onClick={() => generateQuestions(routines)}
                className="flex-1 touch-target-lg px-6 py-4 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-lg rounded-2xl shadow-md transition-transform active:scale-98"
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
        ) : null}
      </div>
    </div>
  );
}
