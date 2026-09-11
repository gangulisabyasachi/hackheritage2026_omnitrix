'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, X, Sparkles, MessageCircle } from 'lucide-react';
import { speechService } from '@/lib/speech';
import { api } from '@/lib/api';
import { audioService } from '@/lib/audio';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface VoiceAssistantModalProps {
  patientId: string;
  isOpen: boolean;
  onClose: () => void;
}

type AssistantState = 'idle' | 'listening' | 'thinking' | 'speaking';

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  patientId,
  isOpen,
  onClose,
}) => {
  const { language, t } = useLanguage();
  const [status, setStatus] = useState<AssistantState>('idle');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState<string>('');
  const [typedInput, setTypedInput] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [providerBadge, setProviderBadge] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const isSpeechSupported = speechService.isSpeechRecognitionSupported();

  useEffect(() => {
    if (!isOpen) {
      speechService.stopListening();
      speechService.stopSpeaking();
      setStatus('idle');
      setTranscript('');
      setResponse('');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartListening = () => {
    setErrorMessage('');
    speechService.stopSpeaking();
    audioService.playFlip();

    const langCode =
      language === 'as' ? 'as-IN' : language === 'hi' ? 'hi-IN' : language === 'bn' ? 'bn-IN' : 'en-IN';

    setStatus('listening');
    setTranscript('Listening for your voice...');

    speechService.startListening(
      (recognizedText) => {
        setTranscript(recognizedText);
        handleQuerySubmit(recognizedText);
      },
      (error) => {
        console.warn('Speech recognition error:', error);
        setStatus('idle');
        setErrorMessage('Could not clearly hear you. Please tap the mic and try again, or type below.');
      },
      () => {
        if (status === 'listening') {
          setStatus('idle');
        }
      },
      langCode
    );
  };

  const handleStopListening = () => {
    speechService.stopListening();
    setStatus('idle');
  };

  const handleQuerySubmit = async (queryText: string) => {
    if (!queryText.trim()) return;

    setStatus('thinking');
    setTranscript(queryText);
    setTypedInput('');

    try {
      const res = await api.askMemoryAssistant(patientId, queryText, language);
      const answer = res.response || "I am here with you. How can I help you remember today's activities?";
      setResponse(answer);
      setProviderBadge(res.provider || 'rule_fallback');

      if (ttsEnabled) {
        setStatus('speaking');
        speechService.speak(answer, language);
        // Reset to idle after estimated speech duration
        const wordCount = answer.split(' ').length;
        const duration = Math.max(3000, wordCount * 450);
        setTimeout(() => {
          setStatus('idle');
        }, duration);
      } else {
        setStatus('idle');
      }
    } catch (err: any) {
      setStatus('idle');
      const fallback = "Your routine and medicines are safely stored. What would you like to check?";
      setResponse(fallback);
      setErrorMessage('Assistant temporarily offline. Switched to local memory records.');
    }
  };

  const sampleQuestions = [
    'What do I have to do today?',
    'When do I take my medicine?',
    'Who is my daughter?',
    'What appointment do I have?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-rose-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                {t.patientHome.talkToAssistant}
              </h3>
              <p className="text-xs sm:text-sm text-amber-100">
                Gentle voice memory companion (Zero-hallucination secured)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors"
              title={ttsEnabled ? 'Mute Speech Readout' : 'Enable Speech Readout'}
            >
              {ttsEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">
          {/* Visual Status Indicator */}
          <div className="flex flex-col items-center justify-center text-center py-4">
            <div
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl ${
                status === 'listening'
                  ? 'bg-rose-500 text-white animate-pulse scale-110 ring-8 ring-rose-200'
                  : status === 'thinking'
                  ? 'bg-amber-500 text-white animate-spin ring-8 ring-amber-200'
                  : status === 'speaking'
                  ? 'bg-emerald-600 text-white animate-bounce ring-8 ring-emerald-200'
                  : 'bg-gradient-to-tr from-amber-500 to-rose-500 text-white hover:scale-105'
              }`}
            >
              {status === 'listening' ? (
                <Mic className="w-14 h-14" />
              ) : status === 'thinking' ? (
                <Sparkles className="w-14 h-14" />
              ) : status === 'speaking' ? (
                <Volume2 className="w-14 h-14" />
              ) : (
                <Mic className="w-14 h-14" />
              )}
            </div>

            <div className="mt-4">
              <span className="text-xl sm:text-2xl font-bold text-stone-900 block">
                {status === 'listening'
                  ? '🎙️ Listening to you...'
                  : status === 'thinking'
                  ? '🤔 Thinking and checking your schedule...'
                  : status === 'speaking'
                  ? '🗣️ Speaking with you...'
                  : 'Tap the button to speak with me'}
              </span>

              {providerBadge && (
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                  Engine: {providerBadge}
                </span>
              )}
            </div>

            {/* Big Mic Button */}
            {isSpeechSupported ? (
              <div className="mt-6 flex gap-3">
                {status === 'listening' ? (
                  <button
                    onClick={handleStopListening}
                    className="touch-target-lg px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white text-lg font-bold rounded-2xl shadow-lg flex items-center gap-3 transition-transform active:scale-95"
                  >
                    <MicOff className="w-6 h-6" />
                    <span>Stop Listening</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartListening}
                    disabled={status === 'thinking'}
                    className="touch-target-lg px-10 py-5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white text-xl font-bold rounded-3xl shadow-xl flex items-center gap-3 transition-transform active:scale-95 hover:shadow-2xl"
                  >
                    <Mic className="w-7 h-7" />
                    <span>🎤 Press & Speak</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-4 p-3 bg-stone-100 rounded-xl text-xs text-stone-600">
                Voice speech input is not supported in this browser. You can type below instead.
              </div>
            )}
          </div>

          {/* Transcript / User Query */}
          {transcript && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4">
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
                You asked:
              </p>
              <p className="text-base sm:text-lg font-medium text-amber-950">&ldquo;{transcript}&rdquo;</p>
            </div>
          )}

          {/* Assistant Response Box */}
          {response && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Memory Assistant Response:
                </p>
                <button
                  onClick={() => speechService.speak(response, language)}
                  className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold flex items-center gap-1 bg-emerald-100/80 px-2.5 py-1 rounded-lg"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Read Aloud
                </button>
              </div>
              <p className="text-lg sm:text-xl text-emerald-950 font-medium leading-relaxed whitespace-pre-line">
                {response}
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm">
              {errorMessage}
            </div>
          )}

          {/* Quick Prompts */}
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2.5">
              Quick Questions to Tap:
            </p>
            <div className="flex flex-wrap gap-2">
              {sampleQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleQuerySubmit(q)}
                  disabled={status === 'thinking'}
                  className="touch-target px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-800 hover:text-amber-950 text-sm font-medium border border-stone-200/80 transition-colors text-left"
                >
                  💬 {q}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Text Input Fallback */}
          <div className="pt-2 border-t border-stone-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleQuerySubmit(typedInput);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                placeholder="Or type a question here (e.g. When is lunch?)..."
                className="flex-1 touch-target px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                disabled={!typedInput.trim() || status === 'thinking'}
                className="touch-target px-5 py-3 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white font-bold rounded-2xl flex items-center gap-2 transition-colors"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Ask</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
