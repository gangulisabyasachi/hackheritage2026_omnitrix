# AI Service & LLM Configuration Guide for Smriti NER

This guide explains how the AI Architecture works in Smriti, how to configure external LLM API keys (OpenAI, Gemini, or Hugging Face), and how our grounded memory assistant prevents hallucinations.

> [!CAUTION]
> **Security Reminder**:
> NEVER share, commit, or post your private API keys into Git, public repositories, or chats. Keep keys strictly inside your local `prototype/backend/.env` file.

---

## 1. Hybrid AI Architecture Overview

Smriti uses a **two-tier hybrid AI architecture**:

```text
               Patient Voice or Chat Question
                            │
                            ▼
                Express Backend Controller
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │       1. Context Grounding Engine     │
        │  Retrieves from MongoDB:              │
        │  • Patient profile & hometown         │
        │  • Daily routine items & times        │
        │  • Active medications & schedules     │
        │  • Doctor appointments & locations    │
        │  • Verified family members & trivia   │
        └───────────────────┬───────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │       2. AI Service Abstraction       │
        │             (AIService.ts)            │
        └───────┬───────────────────────┬───────┘
                │                       │
      (External Provider)        (Zero-API Fallback)
                ▼                       ▼
      OpenAI / Gemini / HF      RuleBasedFallbackProvider
```

### Key Safety Principles:
1. **Zero Hallucination Grounding**: The AI model is only given the patient's verified context. If an item is missing (e.g. asking for an unrecorded family member), it responds: *"I don't have that information yet. Your caregiver can add it to your memory profile."*
2. **Medical Safety Guardrail**: The assistant never diagnoses medical conditions, never predicts disease progression, and always directs medical inquiries to their doctor.
3. **Deterministic Fallback**: If no API key is provided, or if the network is offline, the platform automatically utilizes `RuleBasedFallbackProvider`, which answers routine, medication, appointment, and family questions deterministically!

---

## 2. Choosing and Configuring an AI Provider

Open `prototype/backend/.env`. The AI provider is controlled by the `AI_PROVIDER` variable:

```env
AI_PROVIDER=rule_fallback
# Options: rule_fallback | openai | gemini | huggingface
```

---

### Option A: Built-in Rule Fallback (Default - Zero API Key Needed)

```env
AI_PROVIDER=rule_fallback
```
- **Cost**: Free.
- **Requirements**: None.
- **Features**: Instantly answers questions about daily routines, medicines, doctor appointments, and family members directly from MongoDB records. Perfect for offline hackathon evaluations and demonstrations.

---

### Option B: OpenAI Provider (GPT-4o-mini)

1. **Why it was chosen**: Fast response times (under 800ms), excellent conversational empathy, and strict instruction adherence.
2. **How to get an API Key**:
   - Go to [https://platform.openai.com/](https://platform.openai.com/).
   - Sign in or create an account.
   - Navigate to **API Keys** in the dashboard.
   - Click **"Create new secret key"**, name it `smriti-ner`, and copy the key (starts with `sk-...`).
3. **Configuration**:
   Open `prototype/backend/.env` and update:
   ```env
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```
4. **Restart the backend**:
   ```bash
   cd prototype/backend
   npm run dev
   ```

---

### Option C: Google Gemini Provider (Gemini 1.5 Flash)

1. **Why it was chosen**: Generous free tier, rapid generation, high contextual accuracy.
2. **How to get an API Key**:
   - Visit [https://aistudio.google.com/](https://aistudio.google.com/).
   - Sign in with your Google account.
   - Click **"Get API key"** -> **"Create API key in new project"**.
   - Copy the generated key.
3. **Configuration**:
   Open `prototype/backend/.env` and update:
   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your-gemini-api-key-here
   ```
4. **Restart the backend**:
   ```bash
   cd prototype/backend
   npm run dev
   ```

---

### Option D: Hugging Face Inference API

1. **Why it was chosen**: Open-source models (e.g. Llama 3 / Mistral) with flexible deployment.
2. **How to get an API Key**:
   - Go to [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).
   - Create a User Access Token with `read` permission.
3. **Configuration**:
   Open `prototype/backend/.env`:
   ```env
   AI_PROVIDER=huggingface
   HUGGINGFACE_API_KEY=hf_your_token_here
   ```
4. **Restart backend**:
   ```bash
   cd prototype/backend
   npm run dev
   ```

---

## 3. Testing the AI Endpoints

You can test the AI memory assistant directly via curl or the browser voice modal:

### Test Request:
```bash
curl -X POST http://localhost:5001/api/ai/memory-assistant \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "REPLACE_WITH_PATIENT_ID",
    "query": "What medicine do I take today?"
  }'
```

### Expected Response:
```json
{
  "success": true,
  "query": "What medicine do I take today?",
  "response": "Here are your scheduled medications, Mrs. Ananya Das:\n• Donepezil (5mg tablet) at 09:15 AM\n• Multivitamin & B-Complex (1 capsule) at 09:15 AM\n• Calcium & Vitamin D3 (500mg chewable) at 01:30 PM\n• Amlodipine (5mg tablet) at 09:00 PM\nAlways take them with fresh water as recommended!",
  "provider": "rule_fallback"
}
```

---

## 4. What Happens if an External API Fails or Quota is Exceeded?

The Smriti AI Service has built-in graceful degradation:
- If the external API key is invalid, missing, or rate-limited, the system **automatically falls back to `RuleBasedFallbackProvider`** without throwing an unhandled exception or crashing the frontend!
- The patient receives their schedule or answers without interruption.
