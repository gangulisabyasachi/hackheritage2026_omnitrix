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
  Sparkles,
  TrendingUp,
  Brain,
  Timer,
  Target,
  AlertCircle,
} from 'lucide-react';

// Culturally rich items from the North East & Indian heritage
const CULTURAL_CARDS = [
  { id: 'japi', name: 'Assam Japi (জাপী)', icon: '👒', color: 'bg-amber-100 text-amber-900' },
  { id: 'tea', name: 'Assam CTC Tea (চাহ)', icon: '☕', color: 'bg-emerald-100 text-emerald-900' },
  { id: 'gamusa', name: 'Gamusa (গামোচা)', icon: '🧣', color: 'bg-rose-100 text-rose-900' },
  { id: 'dhol', name: 'Bihu Dhol (ঢোল)', icon: '🥁', color: 'bg-amber-100 text-amber-900' },
  { id: 'rhino', name: 'Kaziranga Rhino (গঁড়)', icon: '🦏', color: 'bg-stone-100 text-stone-900' },
  { id: 'flower', name: 'Marigold (গেন্দা ফুল)', icon: '🌼', color: 'bg-yellow-100 text-yellow-900' },
  { id: 'fruit', name: 'Kaji Nemu / Lemon (নেমু)', icon: '🍋', color: 'bg-lime-100 text-lime-900' },
  { id: 'lantern', name: 'Brass Diya / Lamp (চাকি)', icon: '🪔', color: 'bg-orange-100 text-orange-900' },
];

interface CardItem {
  instanceId: number;
  id: string;
  name: string;
  icon: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryMatchGame() {
  const { t } = useLanguage();
  const [difficulty, setDifficulty] = useState<number>(1);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<CardItem[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isGameOver, setIsGameOver] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [adaptiveResult, setAdaptiveResult] = useState<any>(null);
  const [patientId, setPatientId] = useState<string>('');

  useEffect(() => {
    // Get demo patient
    api.getPatients().then((res) => {
      if (res.patients && res.patients.length > 0) {
        setPatientId(res.patients[0]._id);
      }
    });
  }, []);

  const initGame = (diffLevel: number = difficulty) => {
    setIsGameOver(false);
    setSessionSaved(false);
    setAdaptiveResult(null);
    setAttempts(0);
    setMistakes(0);
    setMatchedCount(0);
    setFlippedCards([]);
    setStartTime(Date.now());

    // Pair count based on difficulty
    // Level 1 = 2 pairs (4 cards)
    // Level 2 = 3 pairs (6 cards)
    // Level 3 = 4 pairs (8 cards)
    // Level 4 = 6 pairs (12 cards)
    // Level 5 = 8 pairs (16 cards)
    const pairCounts = [2, 3, 4, 6, 8];
    const pairCount = pairCounts[Math.min(diffLevel - 1, pairCounts.length - 1)] || 2;

    const selectedPool = CULTURAL_CARDS.slice(0, pairCount);
    const deck: CardItem[] = [];

    selectedPool.forEach((item) => {
      deck.push({ ...item, instanceId: Math.random(), isFlipped: false, isMatched: false });
      deck.push({ ...item, instanceId: Math.random(), isFlipped: false, isMatched: false });
    });

    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
  };

  useEffect(() => {
    initGame(difficulty);
  }, [difficulty]);

  const handleCardClick = (card: CardItem) => {
    if (card.isFlipped || card.isMatched || flippedCards.length >= 2 || isGameOver) {
      return;
    }

    audioService.playFlip();

    const newCards = cards.map((c) =>
      c.instanceId === card.instanceId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlipped = [...flippedCards, card];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setAttempts((prev) => prev + 1);

      if (newFlipped[0].id === newFlipped[1].id) {
        // Match found!
        audioService.playMatch();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === newFlipped[0].id ? { ...c, isMatched: true } : c
            )
          );
          setFlippedCards([]);
          const nextMatched = matchedCount + 1;
          setMatchedCount(nextMatched);

          const totalPairs = cards.length / 2;
          if (nextMatched >= totalPairs) {
            handleGameCompletion();
          }
        }, 400);
      } else {
        // Not a match
        setMistakes((prev) => prev + 1);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.instanceId === newFlipped[0].instanceId ||
              c.instanceId === newFlipped[1].instanceId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleGameCompletion = async () => {
    setIsGameOver(true);
    audioService.playCheer();

    const elapsedSeconds = Number(((Date.now() - startTime) / 1000).toFixed(1));
    const totalPairs = cards.length / 2;
    const accuracy = Math.round(
      Math.max(10, Math.min(100, (totalPairs / Math.max(attempts + 1, totalPairs)) * 100))
    );
    const score = Math.max(
      40,
      Math.min(100, Math.round(0.6 * accuracy + 0.4 * Math.max(10, 100 - elapsedSeconds * 5)))
    );

    if (patientId) {
      try {
        const res = await api.submitGameSession('memory-match', {
          patientId,
          difficulty,
          score,
          accuracy,
          responseTime: elapsedSeconds,
          attempts: attempts + 1,
          mistakes,
          completed: true,
          metadata: { pairsCount: totalPairs },
        });

        if (res.success) {
          setSessionSaved(true);
          setAdaptiveResult(res.adaptiveRecommendation);
        }
      } catch (err) {
        console.warn('Could not save session to MongoDB:', err);
      }
    }
  };

  return (
    <div className="flex-1 bg-[#fdfbf7] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/patient"
            onClick={() => audioService.playFlip()}
            className="touch-target inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:bg-amber-50 hover:text-amber-900 font-bold text-base shadow-xs transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t.common.home}</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-stone-600 bg-amber-100/80 px-3.5 py-1.5 rounded-full border border-amber-200">
              Level {difficulty} Challenge
            </span>
            <button
              onClick={() => initGame(difficulty)}
              className="touch-target p-2.5 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors"
              title="Restart Game"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Game Title Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                {t.games.memoryMatch}
              </h1>
            </div>
            <p className="text-stone-600 text-sm sm:text-base">
              Tap cards to flip them and find the matching pairs of North Eastern cultural treasures!
            </p>
          </div>

          <div className="flex items-center gap-4 bg-stone-50 p-3 rounded-2xl border border-stone-200/60 self-start sm:self-center">
            <div className="text-center px-2">
              <span className="text-xs font-semibold text-stone-500 uppercase block">Matched</span>
              <span className="text-xl font-extrabold text-amber-700">
                {matchedCount} / {cards.length / 2}
              </span>
            </div>
            <div className="w-px h-8 bg-stone-300" />
            <div className="text-center px-2">
              <span className="text-xs font-semibold text-stone-500 uppercase block">Mistakes</span>
              <span className="text-xl font-extrabold text-stone-700">{mistakes}</span>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div
          className={`grid gap-4 sm:gap-6 ${
            cards.length <= 4
              ? 'grid-cols-2 max-w-md mx-auto'
              : cards.length <= 8
              ? 'grid-cols-2 sm:grid-cols-4'
              : 'grid-cols-3 sm:grid-cols-4'
          }`}
        >
          {cards.map((card) => {
            const isRevealed = card.isFlipped || card.isMatched;
            return (
              <button
                key={card.instanceId}
                onClick={() => handleCardClick(card)}
                disabled={isRevealed || isGameOver}
                className={`touch-target-lg aspect-square rounded-3xl p-4 flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 shadow-md border-2 ${
                  card.isMatched
                    ? 'bg-emerald-100 border-emerald-400 opacity-90'
                    : isRevealed
                    ? `${card.color} border-amber-400 ring-4 ring-amber-200`
                    : 'bg-gradient-to-br from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 border-amber-300 text-white cursor-pointer'
                }`}
              >
                {isRevealed ? (
                  <div className="flex flex-col items-center justify-center text-center animate-fadeIn">
                    <span className="text-5xl sm:text-6xl select-none" role="img" aria-label={card.name}>
                      {card.icon}
                    </span>
                    <span className="mt-2 text-xs sm:text-sm font-bold block max-w-[120px] truncate">
                      {card.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-white/90">
                    <span className="text-4xl sm:text-5xl select-none">🌸</span>
                    <span className="text-xs font-bold mt-1 tracking-wider uppercase opacity-80">
                      Tap
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Completion Modal / Adaptive Result Card */}
        {isGameOver && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-emerald-300 animate-fadeIn space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-inner">
                <Trophy className="w-10 h-10" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Activity Complete
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                  {t.games.completedMessage}
                </h2>
                <p className="text-stone-600 text-sm sm:text-base mt-1">
                  You successfully paired all cultural treasures with joy and focus!
                </p>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-stone-50 p-4 sm:p-6 rounded-2xl border border-stone-200">
              <div>
                <span className="text-xs text-stone-500 font-semibold uppercase flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-amber-600" />
                  Score
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                  {adaptiveResult?.performanceScore ?? 88}%
                </span>
              </div>
              <div>
                <span className="text-xs text-stone-500 font-semibold uppercase flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Accuracy
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                  {adaptiveResult?.metrics?.accuracyScore ?? 90}%
                </span>
              </div>
              <div>
                <span className="text-xs text-stone-500 font-semibold uppercase flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5 text-sky-600" />
                  Time Taken
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-sky-700">
                  {((Date.now() - startTime) / 1000).toFixed(1)}s
                </span>
              </div>
              <div>
                <span className="text-xs text-stone-500 font-semibold uppercase flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  Mistakes
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-stone-800">{mistakes}</span>
              </div>
            </div>

            {/* Adaptive Difficulty Engine Explanation */}
            {adaptiveResult && (
              <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-700" />
                  <h3 className="font-bold text-amber-950 text-base sm:text-lg">
                    {t.games.nextRecommended}: Level {adaptiveResult.recommendedDifficulty}
                  </h3>
                </div>
                <p className="text-amber-900 text-sm sm:text-base leading-relaxed">
                  {adaptiveResult.reason}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => {
                  const nextDiff = adaptiveResult?.recommendedDifficulty || difficulty;
                  setDifficulty(nextDiff);
                  initGame(nextDiff);
                }}
                className="flex-1 touch-target-lg px-6 py-4 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-lg rounded-2xl shadow-md transition-transform active:scale-98 text-center"
              >
                🎮 {t.games.playAgain} (Level {adaptiveResult?.recommendedDifficulty || difficulty})
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
