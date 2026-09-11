# NeuroMitra (Smriti NER) — Platform Master Documentation
### AI-Based Cognitive Gaming & Memory Assistance Platform for Elderly Dementia Patients in the North Eastern Region (NER)
**HackHeritage 2026 | Team NeuroMitra**

---

## 1. Executive Summary & Vision

**Smriti (স্মৃতি)** is an empathetic, culturally tailored, full-stack healthcare platform engineered for elderly individuals suffering from age-related memory impairment and mild dementia across the **North Eastern Region (NER) of India** (Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal Pradesh, and Sikkim).

Most cognitive assessment tools are clinical, intimidating, English-only, and built around Western cultural norms. **Smriti NER** replaces clinical anxiety with warmth:
- **Culturally Rooted Cognitive Games**: Featuring Assam tea kettles, Gamusas, Japis, Bihu Dhols, and Kaziranga Rhinos.
- **Proprietary Adaptive Difficulty Engine**: Continuously tunes exercise difficulty to prevent frustration and sustain neuroplastic engagement.
- **Grounded AI Memory Companion**: Powered by Google Gemini 2.5 Flash with strict context grounding in patient routines, family memories, and doctor-prescribed medications (zero hallucination).
- **Multilingual Support**: Real-time interface in **Assamese (অসমীয়া)**, **Bengali (বাংলা)**, **Hindi (हिन्दी)**, and **English**.
- **Three Unified Portals**: Specialized interfaces for **Patients**, **Caregivers**, and **Healthcare Workers / Clinicians**.

---

## 2. Live Cloud Deployment & Links

| Component | Provider | Live Production URL / Details |
| :--- | :--- | :--- |
| **Frontend Portal** | Vercel | Connects to Render backend via `NEXT_PUBLIC_API_URL` |
| **Backend API** | Render | [`https://smriti-backend-b6mp.onrender.com`](https://smriti-backend-b6mp.onrender.com) |
| **API Health Check** | Render | [`https://smriti-backend-b6mp.onrender.com/api/health`](https://smriti-backend-b6mp.onrender.com/api/health) |
| **Database** | MongoDB Atlas | Cluster: `REDACTED_MONGODB_HOST/smriti_db` (AWS Mumbai `ap-south-1`) |
| **AI Model** | Google Cloud | `gemini-2.5-flash` with strict grounding & safety fallbacks |
| **GitHub Repository** | GitHub | [`gangulisabyasachi/hackheritage2026_omnitrix`](https://github.com/gangulisabyasachi/hackheritage2026_omnitrix) |

---

## 3. Medical Safety & Compliance Policy

> [!IMPORTANT]
> **Strict Non-Diagnostic Clinical Policy**:
> Smriti NER is a cognitive engagement, memory support, and longitudinal activity monitoring tool. It **DOES NOT** diagnose dementia, Alzheimer's disease, predict clinical outcomes, or prescribe medicine.
> - All UI metrics use non-clinical terminology (*"Cognitive engagement score"*, *"Activity performance trend"*, *"Personalized routine recommendation"*).
> - Every API response includes a medical disclaimer header.
> - The AI Memory Companion strictly rejects medical advice queries and directs the user to consult their licensed medical provider.

---

## 4. System Architecture

```text
                                 USER BROWSERS
              ┌────────────────────────┼────────────────────────┐
              ▼                        ▼                        ▼
       Patient Portal          Caregiver Portal         Clinician Portal
     (Elderly Friendly)       (Recharts Analytics)     (Longitudinal Roster)
              │                        │                        │
              └────────────────────────┼────────────────────────┘
                                       │ HTTPS / Web Speech API
                                       ▼
                       FRONTEND: Next.js 14 App Router
                       (Tailwind CSS, React 18, Lucide Icons)
                                       │
                                       ▼ REST API (JWT Authenticated)
                       BACKEND: Express + TypeScript API
                         (Port 5001 / Render Web Service)
                        ┌──────────────┴──────────────┐
                        ▼                             ▼
              MongoDB Atlas Database         AIService Abstraction
              - Users & Patients             ├─ Google Gemini 2.5 Flash (Active)
              - Games & Game Sessions        ├─ OpenAI gpt-4o-mini (Fallback)
              - Family Memories & Photos     ├─ Hugging Face (Optional)
              - Routines & Medications       └─ Deterministic Rule Engine
              - Cognitive Scores & Moods        (100% Zero Hallucination)
```

---

## 5. The Three Core Portals

### 5.1 Patient Portal (`/patient`)
Designed specifically for elderly users with low cognitive friction:
- **Visual Accessibility**: Touch targets $\ge 48$–$64\text{ px}$, high-contrast text, legible sans-serif typography, zero visual clutter.
- **Daily Mood Check-in**: One-tap mood buttons (😊 *Feeling Good*, 😐 *Okay*, 😟 *Not Well*) with native Web Audio chime confirmation.
- **Daily Checklist**: Large, checkable cards for morning walks, medications, and meals.
- **Voice Memory Assistant**: Web Speech API conversational interface. Elderly patients tap 🎤 *"Talk to Assistant"*, ask questions naturally, and receive spoken Assamese/Hindi/Bengali/English answers.
- **5 Cognitive Games Hub**: Instant access to cultural brain exercises.

### 5.2 Caregiver Dashboard (`/caregiver`)
Gives family members actionable clarity without medical jargon:
- **Patient Summary Card**: Daily completion rate (e.g. 4/5 tasks), streak counter, and current cognitive score.
- **5 Domain Performance Cards**: Memory, Attention, Pattern Recognition, Object Familiarity, and Routine Orientation.
- **Interactive Recharts Analytics**:
  - Longitudinal performance curve (7-day and 30-day activity trends).
  - Accuracy vs. response-time correlation.
  - Cognitive domain balance radar / bar breakdown.
- **Activity & Game History Log**: Granular table detailing mistakes, completion speed, and adaptive difficulty adjustments.
- **Profile Managers**: Modal editors to add/edit family members, photos, routines, medications, and doctor appointments.
- **One-Click AI Summary**: Plain-language synthesis of how the patient performed over the past week.

### 5.3 Clinician / Healthcare Worker Portal (`/healthcare`)
Enables district health workers (e.g., ASHA/ANM workers and geriatric doctors) to oversee multiple patients:
- **Patient Roster**: Multi-patient table with risk flags, last active dates, and engagement percentiles.
- **Longitudinal Trajectory**: Multi-week view to spot sudden drops in routine adherence or reaction speed.
- **Printable Clinical Summary**: Clean, formatted consultation report ready for clinical appointments.

---

## 6. The 5 Culturally Tailored Cognitive Games

| # | Game Name | Target Cognitive Domain | Cultural / Real-World Integration |
| :- | :--- | :--- | :--- |
| **1** | **Memory Match** | Working Memory & Visual Recall | Pairing regional cultural artifacts: Japi (জাপী), Gamusa (গামোচা), Assam Tea Kettle (চাহৰ কেটলী), Kaziranga One-Horned Rhino (গঁড়), Bihu Dhol (ঢোল), and Kaji Nemu (নেমু). |
| **2** | **Object Recognition** | Semantic Memory & Visual Agnosia | Identifying culturally familiar household and regional items with generous retry guidance and Assamese/Hindi translations. |
| **3** | **Pattern Completion** | Logical Reasoning & Executive Function | Completing visual sequences inspired by traditional North Eastern handloom and textile motifs. |
| **4** | **Daily Routine Recall** | Orientation & Temporal Memory | Generates questions directly from the patient's **actual scheduled routines in MongoDB** (e.g., *"What do you usually have at 8:30 AM?"*). |
| **5** | **Family Memory Game** | Autobiographical Memory & Facial Recognition | Matches real names, relations, and treasured memories of family members uploaded by the caregiver into MongoDB. |

---

## 7. Proprietary Adaptive Difficulty Algorithm

To keep patients engaged without inducing frustration or anxiety, the platform implements a multi-metric scoring algorithm that dynamically scales difficulty between **Level 1 (Gentle)** and **Level 5 (Advanced)**:

### 7.1 Composite Performance Formula

$$\text{Composite Score} = (0.40 \times \text{Accuracy}) + (0.25 \times \text{Speed Score}) + (0.20 \times \text{Completion}) + (0.15 \times \text{Consistency})$$

Where:
- **Accuracy ($0.40$)**: $\frac{\text{Correct Actions}}{\text{Total Actions}} \times 100$
- **Speed Score ($0.25$)**: Calculated against game-specific benchmark baselines:
  $$\text{Speed Score} = \max\left(0, \min\left(100, 100 - \frac{\text{Actual Time} - \text{Expected Time}}{\text{Expected Time}} \times 50\right)\right)$$
- **Completion ($0.20$)**: $100\%$ if the round finished without abandonment.
- **Consistency ($0.15$)**: Inverse of mistake variance ($100 - \text{Mistakes} \times 15$).

### 7.2 Difficulty Adjustment Rules

```text
                 ┌─────────────────────────────┐
                 │  Calculate Composite Score  │
                 └──────────────┬──────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
 Composite Score ≥ 85     55 ≤ Score < 85         Composite Score < 55
 (Outstanding Flow)      (Optimal Challenge)      (Patient Struggling)
        │                       │                       │
        ▼                       ▼                       ▼
  Step Difficulty +1      Maintain Level          Step Difficulty -1
  (Clamp Max: 5)                                  (Clamp Min: 1)
```

*Every session logs the recommendation and reason in MongoDB for caregiver transparency.*

---

## 8. AI Memory Companion Architecture

### 8.1 Grounded Context Injection Pipeline
The AI Companion guarantees **zero hallucination** through structured context grounding:

```text
Patient Voice / Text Query: "What medicine should I take?"
                 │
                 ▼
Fetch Verified Context from MongoDB Atlas:
- Patient Name & Age (Mrs. Ananya Das, 74)
- Daily Routines (Breakfast 8:30 AM, Walk 7:30 AM)
- Prescribed Medications (Donepezil 5mg, Amlodipine 5mg, Calcium)
- Family Members (Son Joy, Granddaughter Priya)
- Doctor Appointments (Dr. Sarma, Guwahati Neurological)
                 │
                 ▼
Construct Strict Grounding System Prompt:
"You are Smriti, an empathetic memory companion for Mrs. Ananya Das in Guwahati.
RULE 1: Only state facts present in the verified context.
RULE 2: If asked for clinical diagnosis or prescription changes, REFUSE politely.
RULE 3: Answer warmly and concisely in the patient's chosen language."
                 │
                 ▼
Execute via Active Provider:
Google Gemini 2.5 Flash API
                 │
                 ▼ (If network timeout or quota limit)
Automatic Fallback to Deterministic Regex & Knowledge Engine
(Guaranteed 0ms downtime, 0 hallucination)
```

---

## 9. Pre-Seeded Demo Accounts & Testing Credentials

The platform includes a realistic, production-ready dataset for **Mrs. Ananya Das (Age 74, Guwahati, Assam)**:

| Role | Email | Password | What You Can Demo |
| :--- | :--- | :--- | :--- |
| **Caregiver** | `caregiver@smriti.org` | `REDACTED_DEMO_PASSWORD` | View Recharts trends, domain breakdowns, family member editor, medication schedule, AI weekly summary. |
| **Patient** | `patient@smriti.org` | `REDACTED_DEMO_PASSWORD` | Play all 5 games, mood check-in, talk to Gemini voice assistant, check off daily routine items. |
| **Healthcare Worker** | `doctor@smriti.org` | `REDACTED_DEMO_PASSWORD` | Review regional patient roster, longitudinal trajectories, print consultation progress reports. |

---

## 10. Local Development Setup for Teammates

If a teammate wants to run the project locally on their machine:

### Prerequisites
- Node.js 18+ or 20+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/gangulisabyasachi/hackheritage2026_omnitrix.git
cd hackheritage2026_omnitrix
```

### 2. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in `backend/`:
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/smriti_db?retryWrites=true&w=majority
JWT_SECRET=REDACTED_JWT_SECRET
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
```
Start backend:
```bash
npm run dev
```

### 3. Run Backend Automated Tests
```bash
npm test
```
*(Runs 16 unit and integration tests verifying authentication, adaptive difficulty formulas, and AI safety guardrails).*

### 4. Setup Frontend (in a new terminal)
```bash
cd ../frontend
npm install
npm run dev
```
Open `http://localhost:3000` in Google Chrome or Edge.

---

## 11. Step-by-Step Hackathon Judging Presentation Script

To present Smriti NER in **3 to 5 minutes** during hackathon evaluations:

1. **The Hook (30 sec)**:
   *"In the North Eastern Region of India, over 400,000 elderly citizens face age-related cognitive decline with virtually zero access to culturally familiar geriatric tools. Standard clinical software is Western, English-only, and creates clinical anxiety. We built Smriti (স্মৃতি) — an empathetic, culturally rooted AI companion and adaptive cognitive platform."*
2. **Patient Experience (90 sec)**:
   - Show `http://localhost:3000` (or Vercel link). Switch language to **অসমীয়া (Assamese)**.
   - Tap 😊 *Daily Mood Check-in* (hear audio chime).
   - Open **Memory Match**: Flip cultural cards (Japi, Tea kettle, Gamusa). Show the completion fanfare and adaptive difficulty recommendation.
   - Tap 🎤 *Ask Memory Assistant*: Say *"What are my medicines today?"*. Show **Google Gemini 2.5 Flash** reading out Mrs. Das's exact prescriptions grounded in MongoDB with zero hallucination.
3. **Caregiver & Clinician Value (60 sec)**:
   - Switch to Caregiver Portal: Show Recharts longitudinal trendlines and domain radar breakdown.
   - Open Healthcare Worker Portal: Demonstrate the patient roster and 1-click printable clinical summary.
4. **The Tech Stack & Cloud Live Demo (30 sec)**:
   - Mention live deployment on Render (Express + Gemini) and Vercel (Next.js 14) backed by MongoDB Atlas.
   - Highlight the mathematical adaptive difficulty formula (40% accuracy, 25% speed, 20% completion, 15% consistency).

---

## 12. Key Files Reference

- **Backend**:
  - Models: `backend/src/models/index.ts`
  - Adaptive Difficulty Service: `backend/src/services/adaptiveDifficultyService.ts`
  - AI Service & Providers: `backend/src/services/ai/AIService.ts`, `backend/src/services/ai/providers/GeminiProvider.ts`
  - Seed Data: `backend/src/seed/seedData.ts`
  - Server & Routes: `backend/src/server.ts`, `backend/src/routes/index.ts`
  - Test Suite: `backend/src/tests/`
- **Frontend**:
  - Patient Portal: `frontend/src/app/patient/page.tsx`
  - 5 Games: `frontend/src/app/patient/games/`
  - Caregiver Dashboard: `frontend/src/app/caregiver/page.tsx`
  - Clinician Portal: `frontend/src/app/healthcare/page.tsx`
  - Voice Assistant: `frontend/src/components/patient/VoiceAssistantModal.tsx`
  - Multilingual Translations: `frontend/src/lib/i18n/translations.ts`
  - Web Audio Synthesizer: `frontend/src/lib/audio.ts`
  - API Client: `frontend/src/lib/api.ts`

---
*Created for HackHeritage 2026 | Dedicated to improving elderly care in the North Eastern Region.*
