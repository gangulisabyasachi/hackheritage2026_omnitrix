'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  UserCheck,
  Stethoscope,
  Brain,
  Cpu,
  Database,
  Volume2,
  ArrowDown,
  CheckCircle2,
  Copy,
  Check,
  Activity,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Info,
  Sliders,
  Workflow,
  Bot
} from 'lucide-react';

type ViewMode = 'overview' | 'adaptive' | 'ai-companion' | 'analytics';

interface NodeDetail {
  id: string;
  title: string;
  role: 'Patient' | 'Caregiver' | 'Clinician' | 'Backend API' | 'AI Engine' | 'Database';
  file: string;
  endpoint?: string;
  description: string;
  payloadOrLogic?: string;
  culturalNote?: string;
  color: string;
}

const NODE_DETAILS: Record<string, NodeDetail> = {
  'patient-entry': {
    id: 'patient-entry',
    title: 'Patient Portal Entry & Daily Mood Check-in',
    role: 'Patient',
    file: 'frontend/src/app/patient/page.tsx & components/patient/MoodSelector.tsx',
    endpoint: 'POST /api/patients/:id/mood',
    description:
      'Elderly patient opens the warm, high-contrast dashboard (≥48px buttons). Taps their daily mood (😊 Feeling Good, 😐 Okay, 😟 Not Well). Generates immediate Web Audio chime feedback and logs emotional state.',
    payloadOrLogic: JSON.stringify({ mood: 'good', note: 'Morning check-in', timestamp: '2026-09-12T08:30:00Z' }, null, 2),
    culturalNote: 'Warm pastel tones, zero intimidating clinical jargon, high contrast for cataract/presbyopia.',
    color: 'amber'
  },
  'routine-checklist': {
    id: 'routine-checklist',
    title: 'Daily Routine & Medication Checklist',
    role: 'Patient',
    file: 'frontend/src/app/patient/page.tsx',
    endpoint: 'GET /api/patients/:id/routines & PUT /api/reminders/:id/status',
    description:
      'Presents large, accessible cards for scheduled morning walks, blood pressure medicine (Amlodipine 5mg), and breakfast. Checking off an item immediately updates the caregiver dashboard.',
    payloadOrLogic: JSON.stringify({ reminderId: 'rem_123', status: 'completed' }, null, 2),
    color: 'emerald'
  },
  'games-hub': {
    id: 'games-hub',
    title: '5 Culturally Tailored Cognitive Games',
    role: 'Patient',
    file: 'frontend/src/app/patient/games/*',
    endpoint: 'GET /api/games & POST /api/games/:id/session',
    description:
      '1. Memory Match (Japi, Gamusa, Tea, Rhino, Dhol)\n2. Object Recognition (NER household items)\n3. Pattern Completion (Handloom motifs)\n4. Daily Routine Recall (MongoDB schedules)\n5. Family Memory Game (Caregiver uploaded photos)',
    culturalNote: 'Rooted in Assam and North Eastern cultural symbols to stimulate autobiographical memory without alienating western imagery.',
    color: 'rose'
  },
  'voice-assistant': {
    id: 'voice-assistant',
    title: 'Grounded Voice Memory Assistant',
    role: 'Patient',
    file: 'frontend/src/components/patient/VoiceAssistantModal.tsx',
    endpoint: 'POST /api/ai/memory-assistant',
    description:
      'Elderly patient taps "Press & Speak". Web Speech API captures speech, routes to backend where verified MongoDB records (prescriptions, routines, family relations) are injected into Gemini 2.5 Flash. Spoken back via Web Speech TTS in Assamese, Bengali, Hindi, or English.',
    payloadOrLogic: JSON.stringify({ patientId: 'pat_ananya_74', message: 'What medicine do I take today?' }, null, 2),
    culturalNote: 'Multi-lingual real-time speech synthesis in Assamese (অসমীয়া), Bengali (বাংলা), Hindi (हिन्दी), and English.',
    color: 'purple'
  },
  'backend-api': {
    id: 'backend-api',
    title: 'Express.js & TypeScript REST API',
    role: 'Backend API',
    file: 'backend/src/routes/index.ts & controllers/*',
    endpoint: 'http://localhost:5001/api (or Render Live Web Service)',
    description:
      'Centralized REST routing table with JWT auth middleware, clinical disclaimer injection headers, and CORS security. Connects all three portals to persistence and AI services.',
    payloadOrLogic: 'Routes: /auth, /patients, /games, /routines, /memories, /analytics, /ai',
    color: 'blue'
  },
  'adaptive-service': {
    id: 'adaptive-service',
    title: 'Adaptive Difficulty Engine',
    role: 'AI Engine',
    file: 'backend/src/services/adaptive/adaptiveDifficultyService.ts',
    endpoint: 'Internal service called by POST /api/games/:id/session',
    description:
      'Calculates composite cognitive performance score from Accuracy (40%), Speed Score (25%), Completion (20%), and Consistency (15%). Dynamically adjusts difficulty between Level 1 and Level 5 to prevent frustration or boredom.',
    payloadOrLogic: 'CompositeScore = 0.40*Accuracy + 0.25*Speed + 0.20*Completion + 0.15*Consistency\nIf Score >= 85 -> Level + 1\nIf 55 <= Score < 85 -> Maintain\nIf Score < 55 -> Level - 1',
    color: 'indigo'
  },
  'mongodb': {
    id: 'mongodb',
    title: 'MongoDB Atlas & In-Memory Fallback',
    role: 'Database',
    file: 'backend/src/models/index.ts & config/database.ts',
    endpoint: 'AWS Mumbai ap-south-1 Cluster / Memory DB',
    description:
      'Stores Patients, Users, Games, GameSessions, Memories, FamilyMembers, Routines, Medications, Appointments, Reminders, and MoodLogs with Mongoose schemas.',
    color: 'slate'
  },
  'caregiver-portal': {
    id: 'caregiver-portal',
    title: 'Caregiver Analytics & Profile Manager',
    role: 'Caregiver',
    file: 'frontend/src/app/caregiver/page.tsx',
    endpoint: 'GET /api/patients/:id/analytics & POST /api/ai/caregiver-summary',
    description:
      'Displays 5 cognitive domain percentiles (Memory, Attention, Pattern, Recognition, Routine), Recharts longitudinal trends, game history with mistake logs, profile modals (add family photos/routines), and 1-click plain-language AI weekly summaries.',
    color: 'blue'
  },
  'clinician-portal': {
    id: 'clinician-portal',
    title: 'Clinician / Healthcare Worker Portal',
    role: 'Clinician',
    file: 'frontend/src/app/healthcare/page.tsx',
    endpoint: 'GET /api/patients & GET /api/patients/:id/analytics',
    description:
      'Enables district health workers (ASHA/ANM) and doctors to monitor patient rosters, detect cognitive decline risk flags, track multi-week response trajectories, and export printable consultation progress summaries.',
    color: 'emerald'
  },
  'round-finish': {
    id: 'round-finish',
    title: 'Round Completion & Telemetry Collection',
    role: 'Patient',
    file: 'frontend/src/app/patient/games/memory-match/page.tsx',
    description: 'When the game round finishes, frontend collects total duration, mistakes count, total attempts, and completion status.',
    payloadOrLogic: JSON.stringify({ score: 92, timeSpentSeconds: 38, accuracy: 88, moves: 12, mistakesCount: 2, completed: true }, null, 2),
    color: 'rose'
  },
  'formula-calc': {
    id: 'formula-calc',
    title: 'Adaptive Scoring Formula Computation',
    role: 'AI Engine',
    file: 'backend/src/services/adaptive/adaptiveDifficultyService.ts',
    description:
      'Calculates Speed Score against baseline: max(0, min(100, 100 - ((Time - ExpectedTime) / ExpectedTime) * 50)). Consistency = 100 - (Mistakes * 15). Blends with accuracy and completion weights.',
    payloadOrLogic: 'CompositeScore = (0.40 * 88) + (0.25 * 85) + (0.20 * 100) + (0.15 * 70) = 86.95',
    color: 'indigo'
  },
  'level-step': {
    id: 'level-step',
    title: 'Difficulty Stepping Decision Diamond',
    role: 'AI Engine',
    file: 'backend/src/services/adaptive/adaptiveDifficultyService.ts',
    description: 'Score 86.95 >= 85 -> Triggers Level Up (Level 2 -> Level 3). Next session will feature 4 pairs (8 cards) instead of 3 pairs.',
    color: 'indigo'
  },
  'ai-query': {
    id: 'ai-query',
    title: 'Elderly Natural Language Query',
    role: 'Patient',
    file: 'frontend/src/components/patient/VoiceAssistantModal.tsx',
    description: 'Patient speaks: "What medicine should I take before lunch?" Converted to text via Web Speech API Recognition.',
    color: 'amber'
  },
  'ai-context': {
    id: 'ai-context',
    title: 'Verified Ground Truth Retrieval',
    role: 'Backend API',
    file: 'backend/src/controllers/aiController.ts',
    description: 'Backend fetches verified patient data directly from MongoDB: Prescribed medications, dosage times, scheduled meals, and attending doctor details.',
    payloadOrLogic: 'Context: Mrs. Ananya Das, Donepezil 5mg (morning), Amlodipine 5mg (8:00 AM with breakfast), Lunch at 1:00 PM.',
    color: 'slate'
  },
  'ai-gemini': {
    id: 'ai-gemini',
    title: 'Google Gemini 2.5 Flash Execution',
    role: 'AI Engine',
    file: 'backend/src/services/ai/providers/GeminiProvider.ts',
    description: 'Calls Gemini 2.5 Flash API with strict temperature=0.2 and anti-hallucination system instructions. If query asks for medical prescription changes, refuses politely and directs to doctor.',
    color: 'purple'
  },
  'ai-fallback': {
    id: 'ai-fallback',
    title: 'Deterministic Rule-Based Fallback',
    role: 'AI Engine',
    file: 'backend/src/services/ai/providers/RuleBasedFallbackProvider.ts',
    description: 'If network is offline or Gemini API quota is exceeded, seamlessly switches to deterministic regex pattern matcher. 0ms downtime, 100% zero hallucination.',
    color: 'rose'
  }
};

const MERMAID_DIAGRAMS: Record<ViewMode, string> = {
  overview: `flowchart TD
    subgraph Users ["1. User Portals & Authentication"]
        U([User Entry]) --> Login{"Auth & Role Select"}
        Login -->|Patient| P_Dash["Patient Portal (/patient)\\n- Mood Check-in\\n- Routine Checklist\\n- 5 Cognitive Games\\n- Voice Assistant"]
        Login -->|Caregiver| C_Dash["Caregiver Portal (/caregiver)\\n- Recharts Analytics\\n- Domain Trends\\n- Profile Modals\\n- AI Weekly Summary"]
        Login -->|Clinician| H_Dash["Clinician Portal (/healthcare)\\n- Patient Roster\\n- Cognitive Decline Flags\\n- Printable Clinical Report"]
    end

    subgraph PatientLoop ["2. Patient Interactive Care"]
        P_Dash --> Mood["Mood Check-in (😊 😐 😟)\\nWeb Audio Chime"]
        Mood --> PostMood["POST /api/patients/:id/mood"]
        P_Dash --> CheckList["Routine & Med Checklist\\nLarge Touch Cards"]
        CheckList --> PutReminder["PUT /api/reminders/:id/status"]
        P_Dash --> Games["5 Cultural Cognitive Games\\n(Japi, Tea, Rhino, Handloom)"]
        P_Dash --> Voice["🎤 Voice Assistant Modal\\nAssamese / Bengali / Hindi / EN"]
    end

    subgraph BackendEngine ["3. Express.js & Cognitive AI Services"]
        Games --> PostSession["POST /api/games/:id/session"]
        PostSession --> AdaptEngine["Adaptive Difficulty Engine\\n(0.40Acc + 0.25Speed + 0.20Comp + 0.15Cons)"]
        AdaptEngine --> StepDiff{"Score >= 85?\\nScore < 55?"}
        StepDiff -->|>= 85| LvlUp["Step Up Difficulty (+1)"]
        StepDiff -->|55..84| LvlSame["Maintain Difficulty"]
        StepDiff -->|< 55| LvlDown["Step Down Difficulty (-1)"]
        
        Voice --> AskAI["POST /api/ai/memory-assistant"]
        AskAI --> ContextFetch["Fetch Verified Truth\\n(Meds, Routines, Family)"]
        ContextFetch --> Gemini["Google Gemini 2.5 Flash\\n(Zero-Hallucination Prompt)"]
        Gemini -.->|Network Fallback| RuleEngine["Rule-Based Fallback Engine"]
    end

    subgraph Persistence ["4. MongoDB Persistence Layer"]
        PostMood --> DB[(MongoDB Atlas / In-Memory)]
        PutReminder --> DB
        LvlUp & LvlSame & LvlDown --> DB
        ContextFetch -.->|Read| DB
        ProfileMgr["Caregiver Profile Editors\\n(Family, Meds, Appointments)"] --> DB
    end

    subgraph CaregiverAnalytics ["5. Longitudinal Monitoring"]
        DB -.->|Query Sessions| C_Dash
        DB -.->|Query Roster| H_Dash
        C_Dash --> AISummary["POST /api/ai/caregiver-summary"]
        AISummary --> DB
        H_Dash --> PrintDoc["Print Clinical Consultation Summary"]
    end`,

  adaptive: `flowchart TD
    Start([Patient Starts Game Round]) --> LoadLevel["Load Round at Difficulty Level (1 to 5)"]
    LoadLevel --> Play["Patient Interacts with Cultural Cards / Questions"]
    Play --> Telemetry["Record Action Stream:\\n- Accuracy Rate\\n- Completion Time vs Benchmark\\n- Mistakes & Hesitations\\n- Completion Flag"]
    Telemetry --> Finish["Round Completed!"]
    
    Finish --> Formula["Compute Composite Score:\\n0.40 * Accuracy +\\n0.25 * SpeedScore +\\n0.20 * Completion +\\n0.15 * Consistency"]
    
    Formula --> Eval{Evaluate Score}
    Eval -->|Score >= 85| Boost["Outstanding Performance!\\nStep Level +1 (Max 5)\\nEncouraging Reinforcement Fanfare"]
    Eval -->|55 <= Score < 85| Keep["Optimal Challenge Zone\\nMaintain Current Level\\nSolidify Neural Pathway"]
    Eval -->|Score < 55| Ease["Cognitive Strain Detected\\nStep Level -1 (Min 1)\\nReduce Cards / Generous Hints"]
    
    Boost & Keep & Ease --> Save["POST /api/games/:id/session\\nSave Session & Recommendation to MongoDB"]
    Save --> NextRound([Ready for Next Game Session])`,

  'ai-companion': `flowchart TD
    Elderly([Elderly Patient]) -->|Taps 🎤 'Press & Speak'| Mic["Web Speech API (SpeechRecognition)"]
    Mic -->|Transcript Text| ClientReq["POST /api/ai/memory-assistant\\n{ patientId, query }"]
    
    ClientReq --> Controller["aiController.ts (Express)"]
    Controller --> DBFetch["Query MongoDB for Patient Truth:\\n- Daily Schedule & Walk Times\\n- Prescribed Medications & Dosages\\n- Family Members & Memories\\n- Doctor Appointments"]
    
    DBFetch --> PromptBuilder["Construct Strict Grounding System Prompt:\\n1. Only use facts in context\\n2. Politely refuse medical diagnosis\\n3. Speak warmly in requested language"]
    
    PromptBuilder --> ProviderCheck{"Active AI Provider"}
    ProviderCheck -->|Primary| Gemini["Google Gemini 2.5 Flash API\\nStrict Grounding Execution"]
    ProviderCheck -->|Offline / Limit Exceeded| Fallback["Deterministic Rule-Based Regex Engine\\n100% Offline, Zero Hallucination"]
    
    Gemini --> Sanitizer["Response Sanitization & Disclaimer Header"]
    Fallback --> Sanitizer
    
    Sanitizer --> ClientRes["JSON Response: { answer, grounded: true }"]
    ClientRes --> TTS["Web Speech API (SpeechSynthesis)\\nReads aloud in Assamese, Bengali, Hindi, or English"]
    TTS --> ElderlyListen([Elderly Listens to Empathetic Answer])`,

  analytics: `flowchart TD
    GameSess[(Completed Game Sessions in DB)] --> Aggregator["Analytics Controller & Service"]
    MoodLogs[(Patient Daily Mood Logs)] --> Aggregator
    RoutineLogs[(Routine & Medication Checks)] --> Aggregator
    
    Aggregator --> DomainMath["Calculate 5 Cognitive Domains:\\n- Memory Domain (%)\\n- Attention Focus (%)\\n- Pattern Recognition (%)\\n- Semantic Object Familiarity (%)\\n- Daily Routine Orientation (%)"]
    
    DomainMath --> TrendCurve["Aggregate 7-Day & 30-Day Longitudinal Curves\\nCorrelate Accuracy vs Reaction Speed"]
    
    TrendCurve --> CG_UI["Caregiver Dashboard UI (/caregiver)\\n- Interactive Recharts Graphs\\n- Domain Balance Radar Chart\\n- Session Activity Log Table"]
    
    CG_UI --> CG_AI["1-Click AI Weekly Summary\\nGemini synthesizes natural-language report"]
    
    TrendCurve --> CL_UI["Clinician Portal UI (/healthcare)\\n- District Patient Roster\\n- Cognitive Decline Risk Badges\\n- Exportable Clinical PDF Summary"]`
};

export default function FlowchartPage() {
  const [activeTab, setActiveTab] = useState<ViewMode>('overview');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('patient-entry');
  const [copied, setCopied] = useState(false);

  const selectedNode = NODE_DETAILS[selectedNodeId] || NODE_DETAILS['patient-entry'];

  const handleCopyMermaid = () => {
    navigator.clipboard.writeText(MERMAID_DIAGRAMS[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
                  HackHeritage 2026
                </span>
                <span className="bg-rose-100 text-rose-800 text-xs font-semibold px-3 py-1 rounded-full border border-rose-200">
                  Interactive System Architecture
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                NeuroMitra (Smriti NER) System Flowchart
              </h1>
              <p className="text-stone-600 text-sm sm:text-base mt-1 max-w-3xl">
                Explore the complete architectural flow: multi-role portal routing, culturally grounded cognitive games, the proprietary adaptive difficulty algorithm, and our zero-hallucination AI companion.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleCopyMermaid}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Mermaid Copied!' : 'Copy Mermaid Code'}
              </button>

              <a
                href="https://mermaid.live"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold border border-stone-300 transition-all"
              >
                <ExternalLink className="w-4 h-4 text-stone-500" />
                Mermaid Live Editor
              </a>
            </div>
          </div>

          {/* View Tabs */}
          <div className="mt-8 flex flex-wrap gap-2 border-b border-stone-200 pb-3">
            {[
              { id: 'overview', label: '1. Full System Architecture', icon: Workflow },
              { id: 'adaptive', label: '2. Game Loop & Adaptive Difficulty', icon: Sliders },
              { id: 'ai-companion', label: '3. Grounded AI Memory Assistant', icon: Bot },
              { id: 'analytics', label: '4. Caregiver & Clinician Pipeline', icon: Activity }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as ViewMode);
                    if (tab.id === 'overview') setSelectedNodeId('patient-entry');
                    if (tab.id === 'adaptive') setSelectedNodeId('round-finish');
                    if (tab.id === 'ai-companion') setSelectedNodeId('ai-query');
                    if (tab.id === 'analytics') setSelectedNodeId('caregiver-portal');
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Visual Flowchart Canvas */}
          <div className="lg:col-span-8 space-y-6">
            {activeTab === 'overview' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Workflow className="w-5 h-5 text-amber-600" />
                    Complete End-to-End Platform Flow
                  </h2>
                  <span className="text-xs font-semibold text-stone-400">Click any card to inspect details</span>
                </div>

                {/* Level 1: Role Authentication */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Layer 1: User Portals & Access Control
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setSelectedNodeId('patient-entry')}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedNodeId === 'patient-entry'
                          ? 'border-amber-500 bg-amber-50 shadow-md'
                          : 'border-stone-200 bg-stone-50 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                        <Sparkles className="w-4 h-4" /> Patient Portal
                      </div>
                      <p className="text-xs text-stone-600 mt-1 font-medium">/patient</p>
                      <p className="text-xs text-stone-500 mt-0.5">≥48px buttons, mood chime, 5 games</p>
                    </button>

                    <button
                      onClick={() => setSelectedNodeId('caregiver-portal')}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedNodeId === 'caregiver-portal'
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-stone-200 bg-stone-50 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                        <UserCheck className="w-4 h-4" /> Caregiver Portal
                      </div>
                      <p className="text-xs text-stone-600 mt-1 font-medium">/caregiver</p>
                      <p className="text-xs text-stone-500 mt-0.5">Recharts, domains, profile modals</p>
                    </button>

                    <button
                      onClick={() => setSelectedNodeId('clinician-portal')}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedNodeId === 'clinician-portal'
                          ? 'border-emerald-500 bg-emerald-50 shadow-md'
                          : 'border-stone-200 bg-stone-50 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                        <Stethoscope className="w-4 h-4" /> Clinician Portal
                      </div>
                      <p className="text-xs text-stone-600 mt-1 font-medium">/healthcare</p>
                      <p className="text-xs text-stone-500 mt-0.5">Patient roster, reports, risk flags</p>
                    </button>
                  </div>
                </div>

                <div className="flex justify-center text-stone-300">
                  <ArrowDown className="w-6 h-6 animate-bounce" />
                </div>

                {/* Level 2: Patient Activity Hub */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span> Layer 2: Patient Interactive Experiences
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setSelectedNodeId('routine-checklist')}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedNodeId === 'routine-checklist'
                          ? 'border-emerald-500 bg-emerald-50 shadow-md'
                          : 'border-stone-200 bg-stone-50 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4" /> Routine Checklist
                      </div>
                      <p className="text-xs text-stone-500 mt-1">Morning walks, blood pressure medicine</p>
                    </button>

                    <button
                      onClick={() => setSelectedNodeId('games-hub')}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedNodeId === 'games-hub'
                          ? 'border-rose-500 bg-rose-50 shadow-md'
                          : 'border-stone-200 bg-stone-50 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                        <Brain className="w-4 h-4" /> 5 Cultural Games
                      </div>
                      <p className="text-xs text-stone-500 mt-1">Japi, Gamusa, Rhino, Handloom, Routine</p>
                    </button>

                    <button
                      onClick={() => setSelectedNodeId('voice-assistant')}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedNodeId === 'voice-assistant'
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : 'border-stone-200 bg-stone-50 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-purple-800 font-bold text-sm">
                        <Bot className="w-4 h-4" /> Voice Companion
                      </div>
                      <p className="text-xs text-stone-500 mt-1">Web Speech API + Grounded Gemini</p>
                    </button>
                  </div>
                </div>

                <div className="flex justify-center text-stone-300">
                  <ArrowDown className="w-6 h-6 animate-bounce" />
                </div>

                {/* Level 3: Backend API & AI Services */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Layer 3: Backend REST API & Core Engines
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedNodeId('backend-api')}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedNodeId === 'backend-api'
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-stone-200 bg-stone-50 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                        <Cpu className="w-4 h-4" /> Express.js REST API
                      </div>
                      <p className="text-xs text-stone-500 mt-1">Port 5001 / Render. JWT Auth, CORS, Health check</p>
                    </button>

                    <button
                      onClick={() => setSelectedNodeId('adaptive-service')}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedNodeId === 'adaptive-service'
                          ? 'border-indigo-500 bg-indigo-50 shadow-md'
                          : 'border-stone-200 bg-stone-50 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm">
                        <Sliders className="w-4 h-4" /> Adaptive Difficulty
                      </div>
                      <p className="text-xs text-stone-500 mt-1">Formula: 0.40A + 0.25S + 0.20C + 0.15K</p>
                    </button>
                  </div>
                </div>

                <div className="flex justify-center text-stone-300">
                  <ArrowDown className="w-6 h-6 animate-bounce" />
                </div>

                {/* Level 4: Database */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-500"></span> Layer 4: Persistence & Database
                  </div>
                  <button
                    onClick={() => setSelectedNodeId('mongodb')}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      selectedNodeId === 'mongodb'
                        ? 'border-slate-500 bg-slate-50 shadow-md'
                        : 'border-stone-200 bg-stone-50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                        <Database className="w-4 h-4 text-emerald-600" /> MongoDB Atlas & Embedded Fallback
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        AWS Mumbai (ap-south-1)
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Stores: Users, Patients, GameSessions, Routines, Medications, Appointments, Memories, and MoodLogs.
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* View 2: Adaptive Difficulty Loop */}
            {activeTab === 'adaptive' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-indigo-600" />
                    Proprietary Adaptive Difficulty Feedback Loop
                  </h2>
                  <span className="text-xs font-semibold text-stone-400">Click a phase to inspect</span>
                </div>

                {/* Formula Highlight */}
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-indigo-950 text-xs sm:text-sm font-mono">
                  <strong>Composite Score</strong> = (0.40 × Accuracy) + (0.25 × SpeedScore) + (0.20 × Completion) + (0.15 × Consistency)
                </div>

                <div className="space-y-4">
                  {/* Step 1 */}
                  <button
                    onClick={() => setSelectedNodeId('round-finish')}
                    className={`w-full p-5 rounded-2xl border text-left transition-all ${
                      selectedNodeId === 'round-finish'
                        ? 'border-indigo-500 bg-indigo-50 shadow-md'
                        : 'border-stone-200 bg-stone-50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-800 text-sm flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-mono">
                          1
                        </span>
                        Game Round Complete & Metric Capture
                      </span>
                      <span className="text-xs font-mono text-stone-400">Frontend Client</span>
                    </div>
                    <p className="text-xs text-stone-600 mt-2">
                      Collects total elapsed time, number of mistakes, correct moves, and completion status.
                    </p>
                  </button>

                  <div className="flex justify-center text-stone-300">
                    <ArrowDown className="w-5 h-5" />
                  </div>

                  {/* Step 2 */}
                  <button
                    onClick={() => setSelectedNodeId('formula-calc')}
                    className={`w-full p-5 rounded-2xl border text-left transition-all ${
                      selectedNodeId === 'formula-calc'
                        ? 'border-indigo-500 bg-indigo-50 shadow-md'
                        : 'border-stone-200 bg-stone-50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-800 text-sm flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-mono">
                          2
                        </span>
                        Multi-Metric Algorithmic Weighting
                      </span>
                      <span className="text-xs font-mono text-stone-400">adaptiveDifficultyService.ts</span>
                    </div>
                    <p className="text-xs text-stone-600 mt-2">
                      Benchmarks reaction speed against baseline expectations. Calculates consistency variance to avoid penalizing momentary slips.
                    </p>
                  </button>

                  <div className="flex justify-center text-stone-300">
                    <ArrowDown className="w-5 h-5" />
                  </div>

                  {/* Step 3: Decision Diamond */}
                  <button
                    onClick={() => setSelectedNodeId('level-step')}
                    className={`w-full p-5 rounded-2xl border text-left transition-all ${
                      selectedNodeId === 'level-step'
                        ? 'border-indigo-500 bg-indigo-50 shadow-md'
                        : 'border-stone-200 bg-stone-50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-800 text-sm flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-mono">
                          3
                        </span>
                        Decision Diamond: Level Adjustment
                      </span>
                      <span className="text-xs font-mono text-stone-400">Decision Rules</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                        <span className="font-bold text-emerald-800">Score ≥ 85:</span>
                        <p className="text-emerald-700 mt-0.5">Step Level +1 (Max 5). Positive fanfare.</p>
                      </div>
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs">
                        <span className="font-bold text-amber-800">55 ≤ Score &lt; 85:</span>
                        <p className="text-amber-700 mt-0.5">Maintain Level. Consolidate neural comfort zone.</p>
                      </div>
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs">
                        <span className="font-bold text-rose-800">Score &lt; 55:</span>
                        <p className="text-rose-700 mt-0.5">Step Level -1 (Min 1). Ease cognitive load.</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* View 3: Grounded AI Companion */}
            {activeTab === 'ai-companion' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-600" />
                    Zero-Hallucination Grounded AI Pipeline
                  </h2>
                  <span className="text-xs font-semibold text-stone-400">Click a stage to inspect</span>
                </div>

                <div className="space-y-4">
                  {/* Phase 1 */}
                  <button
                    onClick={() => setSelectedNodeId('ai-query')}
                    className={`w-full p-5 rounded-2xl border text-left transition-all ${
                      selectedNodeId === 'ai-query'
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-stone-200 bg-stone-50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-800 text-sm flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-amber-600" />
                        1. Elderly Voice Input (Web Speech API)
                      </span>
                      <span className="text-xs font-mono text-stone-400">Client Audio</span>
                    </div>
                    <p className="text-xs text-stone-600 mt-2">
                      Patient speaks: &quot;What medicine should I take before breakfast?&quot; Captured without clinical intimidation.
                    </p>
                  </button>

                  <div className="flex justify-center text-stone-300">
                    <ArrowDown className="w-5 h-5" />
                  </div>

                  {/* Phase 2 */}
                  <button
                    onClick={() => setSelectedNodeId('ai-context')}
                    className={`w-full p-5 rounded-2xl border text-left transition-all ${
                      selectedNodeId === 'ai-context'
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-stone-200 bg-stone-50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-800 text-sm flex items-center gap-2">
                        <Database className="w-4 h-4 text-blue-600" />
                        2. Verified Context Retrieval from MongoDB
                      </span>
                      <span className="text-xs font-mono text-stone-400">aiController.ts</span>
                    </div>
                    <p className="text-xs text-stone-600 mt-2">
                      Fetches verified patient truth: Prescriptions (Amlodipine 5mg, Donepezil 5mg), doctor appointments, and family relations.
                    </p>
                  </button>

                  <div className="flex justify-center text-stone-300">
                    <ArrowDown className="w-5 h-5" />
                  </div>

                  {/* Phase 3 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedNodeId('ai-gemini')}
                      className={`p-5 rounded-2xl border text-left transition-all ${
                        selectedNodeId === 'ai-gemini'
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : 'border-stone-200 bg-stone-50 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        Primary: Google Gemini 2.5 Flash
                      </div>
                      <p className="text-xs text-stone-600 mt-2">
                        Strict grounding system prompt. Rejects medical diagnosis requests and adheres strictly to facts.
                      </p>
                    </button>

                    <button
                      onClick={() => setSelectedNodeId('ai-fallback')}
                      className={`p-5 rounded-2xl border text-left transition-all ${
                        selectedNodeId === 'ai-fallback'
                          ? 'border-rose-500 bg-rose-50 shadow-md'
                          : 'border-stone-200 bg-stone-50 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                        <ShieldCheck className="w-4 h-4 text-rose-600" />
                        Fallback: Offline Regex Engine
                      </div>
                      <p className="text-xs text-stone-600 mt-2">
                        Deterministic 0ms downtime fallback. 100% offline accuracy if internet or quota drops.
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* View 4: Analytics Pipeline */}
            {activeTab === 'analytics' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-600" />
                    Caregiver & Clinician Longitudinal Analytics Pipeline
                  </h2>
                  <span className="text-xs font-semibold text-stone-400">Click a stage to inspect</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedNodeId('caregiver-portal')}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      selectedNodeId === 'caregiver-portal'
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-stone-200 bg-stone-50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                      <UserCheck className="w-4 h-4" /> Caregiver Experience
                    </div>
                    <ul className="text-xs text-stone-600 mt-2 space-y-1">
                      <li>• 5 Domain Score Breakdown (Memory, Attention, Pattern, Recognition, Routine)</li>
                      <li>• Recharts 7-Day & 30-Day Activity Curves</li>
                      <li>• Reaction Time vs. Accuracy Correlation</li>
                      <li>• 1-Click AI Weekly Plain-Language Synthesis</li>
                    </ul>
                  </button>

                  <button
                    onClick={() => setSelectedNodeId('clinician-portal')}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      selectedNodeId === 'clinician-portal'
                        ? 'border-emerald-500 bg-emerald-50 shadow-md'
                        : 'border-stone-200 bg-stone-50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                      <Stethoscope className="w-4 h-4" /> Clinician / ASHA Experience
                    </div>
                    <ul className="text-xs text-stone-600 mt-2 space-y-1">
                      <li>• Multi-Patient Regional Roster</li>
                      <li>• Early-Warning Cognitive Risk Flags</li>
                      <li>• Longitudinal Trajectory Analytics</li>
                      <li>• Printable Clinical Consultation Summary</li>
                    </ul>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Node Inspector Drawer */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm sticky top-28 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-stone-900 text-sm">Node Inspector</h3>
                </div>
                <span className="bg-stone-100 text-stone-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {selectedNode.role}
                </span>
              </div>

              <div>
                <h4 className="text-base font-extrabold text-stone-900">{selectedNode.title}</h4>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed whitespace-pre-line">
                  {selectedNode.description}
                </p>
              </div>

              {/* Source Code Reference */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Source File</span>
                <p className="text-xs font-mono text-stone-800 break-all">{selectedNode.file}</p>

                {selectedNode.endpoint && (
                  <>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block pt-1.5">
                      Endpoint
                    </span>
                    <p className="text-xs font-mono text-amber-800 break-all font-semibold">
                      {selectedNode.endpoint}
                    </p>
                  </>
                )}
              </div>

              {/* Payload or Logic */}
              {selectedNode.payloadOrLogic && (
                <div className="p-3 bg-stone-900 rounded-xl text-stone-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Logic / Payload</span>
                  <pre className="text-[11px] font-mono overflow-x-auto whitespace-pre-wrap text-emerald-400 leading-tight">
                    {selectedNode.payloadOrLogic}
                  </pre>
                </div>
              )}

              {/* Cultural / Accessibility Note */}
              {selectedNode.culturalNote && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <strong className="block font-semibold mb-0.5">Cultural & Accessibility Focus:</strong>
                  {selectedNode.culturalNote}
                </div>
              )}

              {/* Navigation Button */}
              <div className="pt-2">
                <Link
                  href={
                    selectedNode.role === 'Patient'
                      ? '/patient'
                      : selectedNode.role === 'Caregiver'
                      ? '/caregiver'
                      : selectedNode.role === 'Clinician'
                      ? '/healthcare'
                      : '/patient'
                  }
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Visit Live Screen
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
