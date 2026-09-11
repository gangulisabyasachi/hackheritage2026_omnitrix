# Comprehensive Troubleshooting Guide for Smriti NER

This guide covers common issues encountered during setup, development, and hackathon demonstrations, with step-by-step resolution steps.

---

## 1. MongoDB Connection Issues

### Problem A: `MongoServerSelectionError: connect ECONNREFUSED` or Timeout
- **Symptoms**: Terminal shows `Could not connect to external MongoDB Atlas`.
- **Cause 1: Network Access IP restriction**: Your current IP is not whitelisted on MongoDB Atlas.
  - **Fix**: Go to **MongoDB Atlas > Security > Network Access**, click **"Add IP Address"**, and add `0.0.0.0/0` ("Allow Access from Anywhere"). Wait 1 minute for changes to deploy.
- **Cause 2: Special characters in database password**:
  - If your password contains `@`, `:`, `/`, or `%`, MongoDB driver may misparse the URI.
  - **Fix**: URL-encode special characters (e.g. `@` becomes `%40`, `#` becomes `%23`), or change the password in Atlas to an alphanumeric password without symbols.
- **Cause 3: Embedded MongoDB fallback**:
  - The backend will automatically start an in-memory embedded MongoDB instance if Atlas connection fails, ensuring zero disruption to your testing!

---

## 2. Port Already in Use (`EADDRINUSE`)

### Problem: `Error: listen EADDRINUSE: address already in use :::5001` (or `:::3000`)
- **Cause**: A previous instance of the server is still running in the background.
- **Fix (macOS / Linux)**:
  Find and kill the process holding the port:
  ```bash
  # For port 5001
  lsof -ti:5001 | xargs kill -9

  # For port 3000
  lsof -ti:3000 | xargs kill -9
  ```
- **Alternative**: Change the port in `prototype/backend/.env`:
  ```env
  PORT=5002
  ```
  And update `prototype/frontend/.env.local`:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:5002/api
  ```

---

## 3. CORS (Cross-Origin Resource Sharing) Errors

### Problem: Browser console displays `Access to fetch at ... blocked by CORS policy`
- **Fix**: The Smriti Express backend already has CORS configured with:
  ```ts
  app.use(cors({ origin: true, credentials: true }));
  ```
  If you encounter this error:
  1. Verify the backend is running on `http://localhost:5001`.
  2. Verify `frontend/.env.local` points to `http://localhost:5001/api`.
  3. Clear browser cache or use an Incognito tab.

---

## 4. Microphone & Voice Assistant Permissions

### Problem A: Browser says *"Voice input is not supported in this browser"*
- **Cause**: Browser does not support the Web Speech API (`SpeechRecognition`).
- **Fix**:
  - Use **Google Chrome**, **Microsoft Edge**, or **Brave** for native Web Speech API support.
  - In browsers like Firefox or Safari where `webkitSpeechRecognition` is disabled by default, use the **manual question text box** provided right inside the Voice Assistant modal.

### Problem B: Browser prompts *"Permission denied for microphone"*
- **Fix**:
  1. In Chrome, click the tune/padlock icon on the left of the URL bar (`http://localhost:3000`).
  2. Change **Microphone** permission to **"Allow"**.
  3. Refresh the page and tap the microphone button again.

---

## 5. AI API Key Issues & Fallback Mode

### Problem: LLM quota exceeded or key expired
- **Symptoms**: Slow response or 429 status from external provider.
- **Fix**:
  - Smriti automatically falls back to `RuleBasedFallbackProvider` if the external API fails.
  - To force offline rule-based operation without relying on external servers, set:
    ```env
    AI_PROVIDER=rule_fallback
    ```
  - The patient can still ask about routines, medications, family, and appointments with zero latency!

---

## 6. Frontend Cannot Reach Backend

### Symptoms: Games or patient routines show loading indefinitely or empty states
1. Check that the backend server is running in a terminal:
   ```bash
   cd prototype/backend
   npm run dev
   ```
2. Test backend health endpoint directly in browser or terminal:
   ```bash
   curl http://localhost:5001/api/health
   ```
   Should return:
   ```json
   { "status": "online", "service": "Smriti Cognitive Platform API" }
   ```
3. Verify `prototype/frontend/.env.local` contains:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```
   If you modified `.env.local`, restart the Next.js dev server (`npm run dev`) to pick up the updated environment variable.
