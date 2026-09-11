'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { audioService } from '@/lib/audio';
import { api } from '@/lib/api';
import {
  ArrowLeft,
  RefreshCw,
  Trophy,
  HeartHandshake,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Heart,
} from 'lucide-react';

interface FamilyQuestion {
  id: string;
  name: string;
  relationship: string;
  photo: string;
  trivia?: string;
  question: string;
  options: string[];
}

export default function FamilyMemoryGame() {
  const { t } = useLanguage();
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [questions, setQuestions] = useState<FamilyQuestion[]>([]);
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
    async function loadFamilyData() {
      try {
        const pRes = await api.getPatients();
        if (pRes.patients && pRes.patients.length > 0) {
          const p = pRes.patients[0];
          setPatientId(p._id);
          const famRes = await api.getFamilyMembers(p._id);
          const fList = famRes.familyMembers || [];
          setFamilyMembers(fList);
          buildQuestions(fList);
        }
      } catch (err) {
        console.warn('Error loading family data:', err);
      }
    }
    loadFamilyData();
  }, []);

  const buildQuestions = (list: any[]) => {
    if (!list || list.length === 0) {
      // Fallback demo family members
      const fallbackList = [
        {
          name: 'Priyadarshini Das',
          relationship: 'Daughter',
          photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
          trivia: 'Lives in Delhi and calls you every day at 4:30 PM.',
        },
        {
          name: 'Rahul Das',
          relationship: 'Son',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
          trivia: 'Works in Bengaluru and loves fresh Assam tea.',
        },
        {
          name: 'Meera Das',
          relationship: 'Granddaughter',
          photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
          trivia: 'Loves drawing colorful greeting cards for grandmother.',
        },
      ];
      createQuestionsFromMembers(fallbackList);
    } else {
      createQuestionsFromMembers(list);
    }
  };

  const createQuestionsFromMembers = (list: any[]) => {
    const allNames = list.map((m) => m.name);
    const qList: FamilyQuestion[] = [];

    list.forEach((member, i) => {
      const distractors = allNames.filter((n) => n !== member.name);
      // Pad distractors if needed
      while (distractors.length < 3) {
        distractors.push(['Aarav Das', 'Sunita Barua', 'Anupam Sharma'][distractors.length]);
      }

      const options = [member.name, ...distractors.slice(0, 3)].sort(() => Math.random() - 0.5);

      qList.push({
        id: member._id || String(i),
        name: member.name,
        relationship: member.relationship,
        photo: member.photo || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
        trivia: member.trivia || `Your loving ${member.relationship}.`,
        question: `Who is this beloved family member (${member.relationship})?`,
        options,
      });
    });

    setQuestions(qList);
    setCurrentIdx(0);
    setScore(0);
    setMistakes(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setStartTime(Date.now());
  };

  const handleSelectOption = (opt: string) => {
    if (isAnswered || isGameOver || !questions[currentIdx]) return;

    setSelectedOption(opt);
    setIsAnswered(true);

    const isCorrect = opt === questions[currentIdx].name;
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
    }, 2400);
  };

  const finishGame = async (finalScore: number, finalMistakes: number) => {
    setIsGameOver(true);
    audioService.playCheer();

    const elapsedSeconds = Number(((Date.now() - startTime) / 1000).toFixed(1));
    const totalQ = Math.max(1, questions.length);
    const accuracy = Math.round((finalScore / totalQ) * 100);
    const overallScore = Math.max(
      40,
      Math.min(100, Math.round(0.7 * accuracy + 0.3 * Math.max(10, 100 - elapsedSeconds * 4)))
    );

    if (patientId) {
      try {
        const res = await api.submitGameSession('family-memory', {
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
        console.warn('Error recording family session:', err);
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
            onClick={() => createQuestionsFromMembers(familyMembers)}
            className="touch-target p-2.5 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors"
            title="Restart"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Title Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {t.games.familyMemory}
            </h1>
          </div>
          <p className="text-stone-600 text-sm sm:text-base">
            Connect with real family photographs and cherish your most precious relationships.
          </p>

          <div className="mt-4 flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-500 pt-3 border-t border-stone-100">
            <span>
              Member {currentIdx + 1} of {questions.length || 3}
            </span>
            <span>Recognized: {score}</span>
          </div>
        </div>

        {/* Question & Choices */}
        {!isGameOver && currentQ ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200/80 space-y-8 text-center">
            {/* Photograph */}
            <div className="flex flex-col items-center">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden border-4 border-purple-200 shadow-lg mb-3">
                <Image
                  src={currentQ.photo}
                  alt={currentQ.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs uppercase font-bold tracking-widest text-purple-700 bg-purple-50 px-3.5 py-1 rounded-full border border-purple-200 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-purple-600 text-purple-600" />
                {currentQ.relationship}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">
                {currentQ.question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQ.options.map((opt, i) => {
                const isChosen = selectedOption === opt;
                const isCorrect = opt === currentQ.name;

                let btnClass =
                  'bg-stone-50 hover:bg-purple-50 border-stone-300 text-stone-900';
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

            {/* Trivia / Story reveal */}
            {isAnswered && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-purple-950 text-left text-sm sm:text-base animate-fadeIn">
                💖 <span className="font-bold">Family Memory Note:</span> {currentQ.trivia}
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
                  You connected with your family and recognized {score} out of {questions.length} loved ones!
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
                onClick={() => createQuestionsFromMembers(familyMembers)}
                className="flex-1 touch-target-lg px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-lg rounded-2xl shadow-md transition-transform active:scale-98"
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
