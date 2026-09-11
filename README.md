# Smriti NER (স্মৃতি) 🌸
### AI-Based Cognitive Gaming and Memory Assistance Platform for Elderly Dementia Patients in the North Eastern Region (NER)

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Mongoose-brightgreen?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![HackHeritage](https://img.shields.io/badge/HackHeritage-2026-crimson)](https://github.com/gangulisabyasachi/hackheritage2026_omnitrix)

---

## 1. Project Overview & Problem Statement

In the **North Eastern Region (NER)** of India—encompassing Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal Pradesh, and Sikkim—elderly citizens experiencing age-related cognitive decline and mild dementia face unique geographic, linguistic, and healthcare accessibility hurdles. Conventional cognitive assessment software is often clinical, intimidating, English-only, and detached from the rich cultural heritage and daily lifestyle of North Eastern families.

**Smriti (স্মৃতি)** is an empathetic, AI-powered cognitive engagement and memory companion designed specifically for elderly individuals, their caregivers, and healthcare workers.

### Core Philosophy:
- **Zero Clinical Intimidation**: Warm, friendly interface with large accessible buttons (≥48px touch targets), high contrast, and gentle micro-animations.
- **North Eastern Cultural Familiarity**: Games feature familiar cultural treasures: Assam tea kettle (চাহৰ কেটলী), Gamusa (গামোচা), Japi (জাপী), Bihu Dhol (ঢোল), Kaziranga Rhinos (গঁড়), Kaji Nemu (নেমু), and traditional handlooms.
- **Continuous Adaptive Intelligence**: Activities dynamically adjust difficulty based on our proprietary cognitive performance scoring algorithm.
- **Grounded Memory Assistance**: Conversational voice assistant strictly grounded in the patient's verified family memories, daily routines, and doctor-prescribed medications with **zero hallucination**.
- **Multilingual Inclusivity**: Real-time translations in **Assamese (অসমীয়া)**, **Bengali (বাংলা)**, **Hindi (हिन्दी)**, and **English**.

---

## 2. Medical Safety & Compliance Notice

> [!IMPORTANT]
> **Non-Diagnostic Medical Policy**:
> This application is a cognitive assistance, memory exercise, and activity monitoring platform. It **DOES NOT** diagnose dementia, Alzheimer's disease, predict medical outcomes, or replace a doctor. All metrics are presented using non-clinical terminology (e.g., *"Cognitive engagement score"*, *"Activity performance trend"*, *"Personalized activity recommendation"*).

---

## 3. The Three Major Experiences

```text
                        Smriti NER Platform
             ┌───────────────────┼───────────────────┐
             ▼                   ▼                   ▼
    1. Patient Portal   2. Caregiver Portal   3. Clinician Portal
    (Elderly Ease)      (Care & Analytics)    (Observation & Reports)
```

### Experience 1 — Patient Portal
- **Daily Mood Check-in**: 😊 I'm feeling good | 😐 I'm okay | 😟 I'm not feeling well.
- **5 Cognitive Games**:
  1. **Memory Match**: Card pair matching with NER cultural symbols.
  2. **Object Recognition**: Identifying culturally familiar household and regional artifacts.
  3. **Pattern Completion**: Visual sequence and color reasoning puzzles.
  4. **Daily Routine Recall**: Recalling actual scheduled events directly from MongoDB.
  5. **Family / Personal Memory**: Recognizing beloved family members and photographs entered by caregivers.
- **Daily Routine & Medication Checklist**: Large, checkable cards for breakfast, medicines, and hydration.
- **Voice Memory Assistant**: Web Speech API integration (🎤 *"Press & Speak"*) with visual states (*Listening*, *Thinking*, *Speaking*) and text fallback.

### Experience 2 — Caregiver Portal
- **Patient Overview Card**: Real-time activity completion (e.g. 4/5 completed) and cognitive engagement score.
- **Cognitive Domain Scores**: Memory (74%), Attention (70%), Pattern (78%), Recognition (82%), Routine (76%).
- **Recharts Analytics**: Longitudinal trends, domain balance, and response-time vs. accuracy correlation.
- **Game History Log**: Detailed log with scores, mistakes, and adaptive difficulty engine recommendations.
- **Care Alerts**: Notifications of abrupt performance changes or milestone streaks.
- **Profile Management Modals**: Add/Edit family members, personal memories, daily routines, medications, and doctor appointments.
- **AI Summary Generator**: Plain-language synthesis of patient activity trends.

### Experience 3 — Healthcare Worker / Clinician Portal
- **Registered Patient Roster**: Filter and review patient engagement levels.
- **Longitudinal Trajectory Charts**: Multi-week cognitive activity consistency.
- **Exportable Progress Report**: One-click printable clinical consultation summary.

---

## 4. Architecture & System Flow

```text
Patient / Caregiver / Healthcare Worker
                  │
                  ▼
         Next.js 14+ UI (App Router)
                  │
                  ▼ (REST APIs)
         Express.js Backend Server
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
     MongoDB            AI Service
  (Atlas / Memory)          │
        │             ┌─────┴─────┐
        │             ▼           ▼
        │          External   Rule-Based
        │            LLM       Fallback
        ▼
 Games / Sessions / Routines /
 Medications / Analytics
```

### Adaptive Difficulty Engine (`adaptiveDifficultyService.ts`)
The platform calculates an explainable performance score for each completed session:

$$\text{Performance Score} = 0.40 \times \text{Accuracy} + 0.25 \times \text{Speed} + 0.20 \times \text{Completion} + 0.15 \times \text{Consistency}$$

- **90–100**: Increases challenge level with positive reinforcement.
- **75–89**: Advances slightly or maintains level based on hesitation.
- **60–74**: Consolidates current difficulty comfort zone.
- **40–59**: Decreases difficulty to ease cognitive load.
- **0–39**: Significantly eases difficulty to keep activities joyful and non-frustrating.

---

## 5. Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React icons, Recharts.
- **Backend**: Node.js, Express.js, TypeScript, REST API architecture.
- **Database**: MongoDB & Mongoose. Resilient architecture supports MongoDB Atlas via `MONGODB_URI`, with an automatic embedded in-memory database fallback for zero-configuration local evaluation.
- **Authentication**: JWT, bcryptjs password hashing, role-based access control (`patient`, `caregiver`, `healthcare_worker`).
- **AI Integration**: Modular `AIService` abstraction supporting OpenAI (`gpt-4o-mini`), Google Gemini (`gemini-1.5-flash`), Hugging Face inference, and an offline `RuleBasedFallbackProvider`.
- **Audio & Voice**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) + Web Audio API synthesizer for chimes and auditory feedback.

---

## 6. Pre-Seeded Demo Credentials

The database is pre-seeded with realistic, culturally resonant demo data:

| Portal | Email | Password | Access Level |
|---|---|---|---|
| **Caregiver** | `caregiver@smriti.org` | `REDACTED_DEMO_PASSWORD` | Family member & routine management, analytics |
| **Doctor / Clinician** | `doctor@smriti.org` | `REDACTED_DEMO_PASSWORD` | Patient roster, longitudinal reports |
| **Elderly Patient** | `patient@smriti.org` | `REDACTED_DEMO_PASSWORD` | Large-button dashboard, 5 games, voice assistant |

**Demo Patient**: Mrs. Ananya Das (74 years old, Guwahati, Assam).

---

## 7. Installation & Local Setup

### Requirements
- **Node.js**: v18 or higher (v20+ recommended)
- **npm**: v9 or higher
- **Git**

### Step 1: Clone the Repository
```bash
git clone https://github.com/gangulisabyasachi/hackheritage2026_omnitrix.git
cd hackheritage2026_omnitrix
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 4: Configure Environment Variables
- Backend (`backend/.env`):
  ```env
  PORT=5001
  MONGODB_URI=
  JWT_SECRET=REDACTED_JWT_SECRET
  AI_PROVIDER=rule_fallback
  ```
  *(Leave `MONGODB_URI` blank to use the instant in-memory embedded MongoDB, or see [MONGODB_SETUP_GUIDE.md](./MONGODB_SETUP_GUIDE.md) to connect MongoDB Atlas).*
- Frontend (`frontend/.env.local`):
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:5001/api
  ```

### Step 5: Start Backend Server
```bash
cd backend
npm run dev
```
Backend will start on `http://localhost:5001`.

### Step 6: Start Frontend Server (in a new terminal)
```bash
cd frontend
npm run dev
```
Frontend will start on `http://localhost:3000`.

### Step 7: Open in Browser
Open `http://localhost:3000` in Google Chrome or Microsoft Edge.

---

## 8. Step-by-Step Hackathon Demonstration Flow

1. **Visit Landing Page**: Go to `http://localhost:3000`. Observe the North East regional positioning and the 3 distinct portal cards.
2. **Caregiver Login**: Click *"Demo Login as Caregiver"*. View Mrs. Ananya Das's profile, Recharts analytics, 5 cognitive domain cards, and pre-seeded family members.
3. **Switch to Patient Portal**: Click *"Patient Portal"* in the navigation bar.
4. **Daily Mood Check-in**: Tap 😊 *"I'm feeling good"*. Notice the audio chime and confirmation toast.
5. **Play Game 1 (Memory Match)**: Click *Memory Match*. Flip cards to pair cultural items (Japi, Tea kettle, Gamusa, Rhino). Notice the completion fanfare and the **Adaptive Engine Recommendation**.
6. **Play Game 4 (Routine Recall)**: Click *Daily Routine Recall*. Answer questions based on Mrs. Das's real morning schedule stored in MongoDB.
7. **Interact with Voice Assistant**: Tap 🎤 *"Talk to Assistant"*.
   - Speak or tap: *"What medicine do I take today?"*
   - The assistant queries MongoDB and reads aloud the exact dosage without hallucinating.
8. **Return to Caregiver Dashboard**: Click *"Caregiver Portal"* in the navbar. Verify that the new game sessions, updated accuracy, and Recharts trends immediately reflect your activity.
9. **Toggle Language**: Switch language to **অসমীয়া (Assamese)** or **हिन्दी (Hindi)** using the navbar selector. Notice all UI labels, game instructions, and buttons adapt instantaneously.

---

## 9. Backend Tests

To run the automated test suite (verifying authentication, adaptive difficulty formulas, and AI safety guardrails):

```bash
cd backend
npm test
```

---

## 10. Additional Documentation

- [TEAM_DOCUMENTATION.md](./TEAM_DOCUMENTATION.md): Master team documentation (Vision, System Architecture, 5 Games, Adaptive Formula, Pitch Script).
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md): Complete guide for deploying to Render (Backend) and Vercel (Frontend).
- [MONGODB_SETUP_GUIDE.md](./MONGODB_SETUP_GUIDE.md): Detailed 11-step walkthrough for setting up MongoDB Atlas.
- [AI_SETUP_GUIDE.md](./AI_SETUP_GUIDE.md): OpenAI, Gemini, Hugging Face, and fallback configuration.
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md): Solutions for database connections, ports, CORS, and audio permissions.
