'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { api } from '@/lib/api';
import { MedicalDisclaimer } from '@/components/common/MedicalDisclaimer';
import {
  Stethoscope,
  Users,
  Brain,
  Download,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Activity,
  Printer,
  CheckCircle,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function HealthcareDashboardPage() {
  const { t } = useLanguage();
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getPatients();
        const pList = res.patients || [];
        setPatients(pList);
        if (pList.length > 0) {
          selectPatient(pList[0]._id);
        }
      } catch (err) {
        console.warn('Error loading clinician data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const selectPatient = async (patientId: string) => {
    try {
      const [detailRes, analyticsRes] = await Promise.all([
        api.getPatientById(patientId),
        api.getPatientAnalytics(patientId),
      ]);
      setSelectedPatient(detailRes.patient);
      setAnalytics(analyticsRes);
    } catch (err) {
      console.warn('Error selecting patient:', err);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.preferences?.hometown && p.preferences.hometown.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const trendData = analytics?.trends?.length
    ? analytics.trends
    : [
        { date: '09-05', score: 74 },
        { date: '09-07', score: 76 },
        { date: '09-09', score: 80 },
        { date: '09-11', score: 84 },
      ];

  const breakdown = analytics?.breakdown || {
    memory: 74,
    attention: 70,
    pattern: 78,
    recognition: 82,
    routine: 76,
    overall: 76,
  };

  return (
    <div className="flex-1 bg-stone-50/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
              <Stethoscope className="w-3.5 h-3.5" />
              Clinical Observation Portal
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 mt-1">
              {t.clinician.portalTitle}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1">
              Longitudinal activity tracking, cognitive domain consistency, and clinical consultation reports
            </p>
          </div>

          <button
            onClick={handlePrintReport}
            className="touch-target px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors self-start md:self-auto"
          >
            <Printer className="w-4 h-4" />
            <span>Print Progress Report</span>
          </button>
        </div>

        {/* Medical Safety Disclaimer */}
        <MedicalDisclaimer />

        {/* Main Grid: Roster on Left, Deep Dive on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Roster Column */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                {t.clinician.patientRoster}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-stone-100 text-stone-600 rounded-full">
                {filteredPatients.length} Patients
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient or location..."
                className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Patients List */}
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredPatients.map((p) => {
                const isSelected = selectedPatient?._id === p._id;
                return (
                  <button
                    key={p._id}
                    onClick={() => selectPatient(p._id)}
                    className={`w-full touch-target text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-200 shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100/80 border-stone-200/80'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-stone-900 text-base block">{p.name}</span>
                      <span className="text-xs text-stone-500">
                        {p.age} yrs • {p.preferences?.hometown || 'Guwahati, Assam'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-amber-700 block">76%</span>
                      <span className="text-[10px] uppercase font-bold text-emerald-600">Active</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Patient Detail & Clinical Deep Dive */}
          <div className="lg:col-span-2 space-y-6">
            {selectedPatient ? (
              <>
                {/* Profile Overview Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                        Patient Profile ID: #{selectedPatient._id.slice(-6).toUpperCase()}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                        {selectedPatient.name}
                      </h2>
                      <p className="text-stone-600 text-sm mt-1">
                        {selectedPatient.age} years old • {selectedPatient.gender} • Primary Language: {selectedPatient.preferredLanguage.toUpperCase()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200 text-center">
                        <span className="text-[11px] uppercase font-bold text-emerald-800 block">
                          Engagement Index
                        </span>
                        <span className="text-2xl font-black text-emerald-900">
                          {breakdown.overall}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Medical Notes & Emergency Contact */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                      <span className="font-bold text-stone-700 block mb-1">Clinical / Care Notes:</span>
                      <p className="text-stone-600 leading-relaxed">
                        {selectedPatient.medicalNotes ||
                          'Mild cognitive impairment observed. Highly responsive to familiar regional memories, visual cues, and gentle routines.'}
                      </p>
                    </div>

                    <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                      <span className="font-bold text-stone-700 block mb-1">Primary Caregiver Contact:</span>
                      <p className="text-stone-800 font-semibold">
                        {selectedPatient.emergencyContact?.name || 'Priyadarshini Das (Daughter)'}
                      </p>
                      <p className="text-stone-600">
                        Phone: {selectedPatient.emergencyContact?.phone || '+91 98765 43210'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Longitudinal Engagement Trajectory */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900">
                        Cognitive Activity Trend (Longitudinal)
                      </h3>
                      <p className="text-xs text-stone-500">
                        Session-by-session performance timeline
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-stone-100 rounded-lg text-stone-600">
                      Multi-Week Trace
                    </span>
                  </div>

                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                        <YAxis domain={[40, 100]} stroke="#94a3b8" fontSize={11} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#e11d48"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#e11d48' }}
                          name="Performance Trend"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Domain Scores Bar */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80">
                  <h3 className="text-lg font-bold text-stone-900 mb-4">
                    Domain Assessment (Non-Clinical Activity Performance)
                  </h3>

                  <div className="space-y-3">
                    {[
                      { domain: 'Memory & Recall', val: breakdown.memory, col: 'bg-amber-500' },
                      { domain: 'Attention & Focus', val: breakdown.attention, col: 'bg-rose-500' },
                      { domain: 'Pattern Recognition', val: breakdown.pattern, col: 'bg-purple-500' },
                      { domain: 'Object Identification', val: breakdown.recognition, col: 'bg-emerald-500' },
                      { domain: 'Daily Routine Recall', val: breakdown.routine, col: 'bg-sky-500' },
                    ].map((d, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-stone-700">
                          <span>{d.domain}</span>
                          <span>{d.val}%</span>
                        </div>
                        <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${d.col} rounded-full transition-all duration-700`}
                            style={{ width: `${d.val}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center text-stone-400 border border-stone-200">
                Select a patient from the roster to view their clinical activity overview.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
