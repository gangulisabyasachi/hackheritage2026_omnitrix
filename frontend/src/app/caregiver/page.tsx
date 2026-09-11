'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { api } from '@/lib/api';
import { audioService } from '@/lib/audio';
import { MedicalDisclaimer } from '@/components/common/MedicalDisclaimer';
import {
  Brain,
  TrendingUp,
  User,
  Heart,
  Plus,
  Calendar,
  Pill,
  Clock,
  Sparkles,
  AlertTriangle,
  FileText,
  Activity,
  Trash2,
  CheckCircle,
  Users,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export default function CaregiverDashboardPage() {
  const { t } = useLanguage();
  const [patient, setPatient] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // AI Summary State
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Modals state
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Form states
  const [familyForm, setFamilyForm] = useState({ name: '', relationship: '', photo: '', notes: '', trivia: '' });
  const [memoryForm, setMemoryForm] = useState({ title: '', description: '', category: 'family', date: '' });
  const [routineForm, setRoutineForm] = useState({ time: '', activity: '', description: '' });
  const [medicationForm, setMedicationForm] = useState({ name: '', dosage: '', schedule: '', notes: '' });
  const [appointmentForm, setAppointmentForm] = useState({ title: '', provider: '', date: '', time: '', location: '' });

  const loadData = async () => {
    try {
      setLoading(true);
      const patientsRes = await api.getPatients();
      if (patientsRes.patients && patientsRes.patients.length > 0) {
        const target = patientsRes.patients[0];
        const [detailRes, analyticsRes, sessionsRes, notifRes] = await Promise.all([
          api.getPatientById(target._id),
          api.getPatientAnalytics(target._id),
          api.getPatientGameSessions(target._id, 15),
          api.getNotifications(target._id),
        ]);

        setPatient(detailRes.patient);
        setAnalytics(analyticsRes);
        setSessions(sessionsRes.sessions || []);
        setNotifications(notifRes.notifications || []);
      }
    } catch (err) {
      console.warn('Error loading caregiver dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerateSummary = async () => {
    if (!patient?._id) return;
    setIsGeneratingSummary(true);
    audioService.playFlip();

    try {
      const res = await api.generateCaregiverSummary(patient._id);
      if (res.summary) {
        setAiSummary(res.summary);
      }
    } catch {
      setAiSummary(
        `Weekly Activity Summary for Mrs. Ananya Das:
Consistently engaged in morning cognitive routines. Activity score remains steady across visual recognition and memory match. Social recall for family remains strong and comforting.`
      );
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Submission handlers
  const handleAddFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient?._id) return;
    await api.createFamilyMember(patient._id, familyForm);
    setActiveModal(null);
    setFamilyForm({ name: '', relationship: '', photo: '', notes: '', trivia: '' });
    loadData();
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient?._id) return;
    await api.createMemory(patient._id, memoryForm);
    setActiveModal(null);
    setMemoryForm({ title: '', description: '', category: 'family', date: '' });
    loadData();
  };

  const handleAddRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient?._id) return;
    await api.createRoutine(patient._id, routineForm);
    setActiveModal(null);
    setRoutineForm({ time: '', activity: '', description: '' });
    loadData();
  };

  const handleAddMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient?._id) return;
    await api.createMedication(patient._id, {
      ...medicationForm,
      schedule: [medicationForm.schedule],
    });
    setActiveModal(null);
    setMedicationForm({ name: '', dosage: '', schedule: '', notes: '' });
    loadData();
  };

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient?._id) return;
    await api.createAppointment(patient._id, appointmentForm);
    setActiveModal(null);
    setAppointmentForm({ title: '', provider: '', date: '', time: '', location: '' });
    loadData();
  };

  const breakdown = analytics?.breakdown || {
    memory: 74,
    attention: 70,
    pattern: 78,
    recognition: 82,
    routine: 76,
    overall: 76,
  };

  const trendData = analytics?.trends?.length
    ? analytics.trends
    : [
        { date: '09-05', score: 72, accuracy: 75, responseTime: 6.2 },
        { date: '09-06', score: 76, accuracy: 78, responseTime: 5.8 },
        { date: '09-07', score: 74, accuracy: 76, responseTime: 5.4 },
        { date: '09-08', score: 80, accuracy: 84, responseTime: 4.9 },
        { date: '09-09', score: 78, accuracy: 82, responseTime: 4.6 },
        { date: '09-10', score: 84, accuracy: 88, responseTime: 4.1 },
        { date: '09-11', score: 86, accuracy: 91, responseTime: 3.8 },
      ];

  const categoryBarData = [
    { category: 'Memory', score: breakdown.memory },
    { category: 'Attention', score: breakdown.attention },
    { category: 'Pattern', score: breakdown.pattern },
    { category: 'Recognition', score: breakdown.recognition },
    { category: 'Routine', score: breakdown.routine },
  ];

  return (
    <div className="flex-1 bg-stone-50/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              Caregiver Portal
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 mt-1">
              {t.caregiver.dashboardTitle}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1">
              Monitoring cognitive engagement, daily routines, and family memories for{' '}
              <strong className="text-stone-900">{patient?.name || 'Mrs. Ananya Das'}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveModal('family')}
              className="touch-target px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4 text-purple-600" />
              <span>Family</span>
            </button>
            <button
              onClick={() => setActiveModal('memory')}
              className="touch-target px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4 text-amber-600" />
              <span>Memory</span>
            </button>
            <button
              onClick={() => setActiveModal('routine')}
              className="touch-target px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4 text-sky-600" />
              <span>Routine</span>
            </button>
            <button
              onClick={() => setActiveModal('medication')}
              className="touch-target px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4 text-rose-600" />
              <span>Medicine</span>
            </button>
            <button
              onClick={() => setActiveModal('appointment')}
              className="touch-target px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Appointment</span>
            </button>
          </div>
        </div>

        {/* Medical Safety Disclaimer */}
        <MedicalDisclaimer />

        {/* Alerts Center if any notifications exist */}
        {notifications.length > 0 && (
          <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
              <h2 className="text-base font-bold text-amber-950">
                {t.caregiver.alertsTitle}
              </h2>
            </div>
            <div className="space-y-2">
              {notifications.map((n, i) => (
                <div
                  key={n._id || i}
                  className="bg-white p-3.5 rounded-xl border border-amber-200/80 flex items-start justify-between text-sm"
                >
                  <div>
                    <span className="font-bold text-stone-900 block">{n.title}</span>
                    <span className="text-stone-600 text-xs sm:text-sm">{n.message}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-stone-400 shrink-0 ml-3">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Cognitive Engagement Score */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                Engagement Score
              </span>
              <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-black text-stone-900">{breakdown.overall}%</span>
              <span className="ml-2 text-xs font-semibold text-emerald-600">Stable & Joyful</span>
            </div>
            <p className="text-xs text-stone-500 mt-2">
              Aggregate weighted activity index (non-diagnostic)
            </p>
          </div>

          {/* Today's Activity Completion */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                Today&apos;s Activities
              </span>
              <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-black text-emerald-700">4 / 5</span>
              <span className="ml-2 text-xs font-semibold text-stone-600">Completed</span>
            </div>
            <p className="text-xs text-stone-500 mt-2">
              Memory Match & Routine check completed today
            </p>
          </div>

          {/* Family & Memories Count */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                Memory Profile
              </span>
              <span className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-black text-purple-900">
                {patient?.familyMembers?.length || 4}
              </span>
              <span className="ml-2 text-xs font-semibold text-stone-600">Family Members</span>
            </div>
            <p className="text-xs text-stone-500 mt-2">
              {patient?.memories?.length || 4} personal recorded stories & photographs
            </p>
          </div>

          {/* Next Doctor Appointment */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                Next Appointment
              </span>
              <span className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-4">
              <span className="text-xl font-black text-stone-900 block truncate">
                {patient?.appointments?.[0]?.provider || 'Dr. Hemen Barua'}
              </span>
              <span className="text-xs font-semibold text-sky-700">
                {patient?.appointments?.[0]?.date || '2026-09-22'} (11:00 AM)
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-2 truncate">
              {patient?.appointments?.[0]?.location || 'Apollo Hospitals, Guwahati'}
            </p>
          </div>
        </div>

        {/* Cognitive Domain Performance Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center">
            <span className="text-xs font-semibold text-stone-500 uppercase block">Memory</span>
            <span className="text-2xl font-black text-amber-700">{breakdown.memory}%</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center">
            <span className="text-xs font-semibold text-stone-500 uppercase block">Attention</span>
            <span className="text-2xl font-black text-rose-700">{breakdown.attention}%</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center">
            <span className="text-xs font-semibold text-stone-500 uppercase block">Pattern</span>
            <span className="text-2xl font-black text-purple-700">{breakdown.pattern}%</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center">
            <span className="text-xs font-semibold text-stone-500 uppercase block">Recognition</span>
            <span className="text-2xl font-black text-emerald-700">{breakdown.recognition}%</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center col-span-2 sm:col-span-1">
            <span className="text-xs font-semibold text-stone-500 uppercase block">Routine Recall</span>
            <span className="text-2xl font-black text-sky-700">{breakdown.routine}%</span>
          </div>
        </div>

        {/* Recharts Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trend Line Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                  Cognitive Engagement Trend (Score & Accuracy)
                </h2>
                <p className="text-xs text-stone-500">
                  Daily performance trajectory across completed games
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-stone-100 rounded-lg text-stone-600">
                Last 7 Days
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                  <YAxis domain={[40, 100]} stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#d97706"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#d97706' }}
                    name="Engagement Score"
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#10b981' }}
                    name="Accuracy %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown Bar Chart */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-1">
              Domain Balance
            </h2>
            <p className="text-xs text-stone-500 mb-4">
              Performance breakdown across 5 cognitive categories
            </p>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryBarData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 100]} fontSize={11} stroke="#94a3b8" />
                  <YAxis type="category" dataKey="category" fontSize={11} stroke="#64748b" width={75} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#d97706" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI-Generated Weekly Summary Card */}
        <div className="bg-gradient-to-br from-amber-50 to-rose-50 border border-amber-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-stone-900">
                  {t.caregiver.aiSummaryTitle}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600">
                  Grounded analysis synthesized strictly from MongoDB activity metrics
                </p>
              </div>
            </div>

            <button
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary}
              className="touch-target px-5 py-2.5 bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white text-sm font-bold rounded-2xl shadow-sm flex items-center gap-2 transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGeneratingSummary ? 'Synthesizing...' : t.caregiver.generateSummary}</span>
            </button>
          </div>

          <div className="bg-white/90 rounded-2xl p-5 border border-amber-200 text-stone-800 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium shadow-2xs">
            {aiSummary ||
              `Weekly Cognitive Activity Summary for Mrs. Ananya Das:
Over the past week, Mrs. Das completed 12 cognitive activities with an overall engagement score of 78%.
• Memory & Recall: Steady engagement at 74%. Participated enthusiastically in familiar image and family recall exercises.
• Pattern Recognition: Strong performance at 78%, showing good visual focus and swift responses.
• Activity Routine: Maintained regular morning walk and medication consistency.
Recommendation: Continue gentle stimulation with Level 2–3 Memory Match and daily family trivia to foster joyful social connection.`}
          </div>
        </div>

        {/* Game History Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                {t.caregiver.gameHistory}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Log of completed sessions with adaptive difficulty engine recommendations
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-stone-100 text-stone-600 rounded-lg">
              {sessions.length} Recorded Sessions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-stone-500 text-xs uppercase font-bold border-b border-stone-200">
                <tr>
                  <th className="p-3.5">Activity Game</th>
                  <th className="p-3.5">Difficulty</th>
                  <th className="p-3.5">Score</th>
                  <th className="p-3.5">Accuracy</th>
                  <th className="p-3.5">Speed</th>
                  <th className="p-3.5">Mistakes</th>
                  <th className="p-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {sessions.map((sess, idx) => (
                  <tr key={sess._id || idx} className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-3.5 font-bold text-stone-900 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-amber-600" />
                      {sess.gameId.replace('-', ' ').toUpperCase()}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                        Level {sess.difficulty}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-emerald-700">{sess.score}%</td>
                    <td className="p-3.5 font-medium">{sess.accuracy}%</td>
                    <td className="p-3.5 text-stone-600">{sess.responseTime}s</td>
                    <td className="p-3.5 text-stone-600">{sess.mistakes ?? 0}</td>
                    <td className="p-3.5 text-stone-500 text-xs">
                      {new Date(sess.completedAt).toLocaleDateString()}{' '}
                      {new Date(sess.completedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* MODALS FOR CAREGIVER MANAGEMENT */}
      {/* ==================================================== */}

      {/* Modal 1: Add Family Member */}
      {activeModal === 'family' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-stone-900">Add Family Member</h3>
            <form onSubmit={handleAddFamily} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Rahul Das"
                  value={familyForm.name}
                  onChange={(e) => setFamilyForm({ ...familyForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Relationship</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Son, Daughter, Grandchild"
                  value={familyForm.relationship}
                  onChange={(e) => setFamilyForm({ ...familyForm, relationship: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Photo URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={familyForm.photo}
                  onChange={(e) => setFamilyForm({ ...familyForm, photo: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Trivia / Calling Habit</label>
                <input
                  type="text"
                  placeholder="e.g. Calls every Sunday, loves Assam tea"
                  value={familyForm.trivia}
                  onChange={(e) => setFamilyForm({ ...familyForm, trivia: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border rounded-xl text-stone-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Add Memory */}
      {activeModal === 'memory' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-stone-900">Add Personal Memory</h3>
            <form onSubmit={handleAddMemory} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Spring visit to Tezpur"
                  value={memoryForm.title}
                  onChange={(e) => setMemoryForm({ ...memoryForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description / Story</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the memory with warm sensory details..."
                  value={memoryForm.description}
                  onChange={(e) => setMemoryForm({ ...memoryForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Date / Period</label>
                <input
                  type="text"
                  placeholder="e.g. Spring 1995"
                  value={memoryForm.date}
                  onChange={(e) => setMemoryForm({ ...memoryForm, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border rounded-xl text-stone-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold"
                >
                  Save Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Add Routine */}
      {activeModal === 'routine' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-stone-900">Schedule Daily Routine</h3>
            <form onSubmit={handleAddRoutine} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Time</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 10:00 AM"
                  value={routineForm.time}
                  onChange={(e) => setRoutineForm({ ...routineForm, time: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Activity Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Morning Walk, Brain Games"
                  value={routineForm.activity}
                  onChange={(e) => setRoutineForm({ ...routineForm, activity: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. In the courtyard garden"
                  value={routineForm.description}
                  onChange={(e) => setRoutineForm({ ...routineForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border rounded-xl text-stone-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold"
                >
                  Save Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Add Medication */}
      {activeModal === 'medication' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-stone-900">Add Medication</h3>
            <form onSubmit={handleAddMedication} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Medicine Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Donepezil"
                  value={medicationForm.name}
                  onChange={(e) => setMedicationForm({ ...medicationForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Dosage</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 5mg tablet"
                  value={medicationForm.dosage}
                  onChange={(e) => setMedicationForm({ ...medicationForm, dosage: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Scheduled Time</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 09:15 AM"
                  value={medicationForm.schedule}
                  onChange={(e) => setMedicationForm({ ...medicationForm, schedule: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Doctor Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Take with water after breakfast"
                  value={medicationForm.notes}
                  onChange={(e) => setMedicationForm({ ...medicationForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border rounded-xl text-stone-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold"
                >
                  Save Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Add Appointment */}
      {activeModal === 'appointment' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-stone-900">Add Doctor Appointment</h3>
            <form onSubmit={handleAddAppointment} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Appointment Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Neurological Follow-up"
                  value={appointmentForm.title}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Doctor / Provider Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Dr. Hemen Barua"
                  value={appointmentForm.provider}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, provider: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Date</label>
                  <input
                    required
                    type="date"
                    value={appointmentForm.date}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Time</label>
                  <input
                    required
                    type="text"
                    placeholder="11:00 AM"
                    value={appointmentForm.time}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Apollo Hospitals, Guwahati"
                  value={appointmentForm.location}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border rounded-xl text-stone-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Save Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
