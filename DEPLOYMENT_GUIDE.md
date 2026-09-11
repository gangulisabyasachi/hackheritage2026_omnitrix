# Smriti NER (স্মৃতি) — Deployment Guide 🚀
### Production Deployment with Render (Backend) & Vercel (Frontend)

This guide provides step-by-step instructions for deploying the **Smriti NER** platform to production using **Render** for the Node.js/Express API and **Vercel** for the Next.js 14 frontend.

---

## Architecture Overview

```text
       ┌───────────────────────────────┐
       │   Vercel (Frontend - Next.js) │
       │   https://smriti.vercel.app   │
       └──────────────┬────────────────┘
                      │ HTTPS API Calls (NEXT_PUBLIC_API_URL)
                      ▼
       ┌───────────────────────────────┐
       │   Render (Backend - Express)  │
       │   https://smriti.onrender.com │
       └───────┬───────────────┬───────┘
               │               │
               ▼               ▼
     ┌──────────────────┐    ┌──────────────────────────┐
     │  MongoDB Atlas   │    │ Google Gemini 2.5 Flash  │
     │  (Database)      │    │ (Conversational AI)      │
     └──────────────────┘    └──────────────────────────┘
```

---

## PART 1: Deploy Backend to Render

Render will host the Node.js/Express REST API, handle database operations with MongoDB Atlas, and execute AI queries using Google Gemini.

### Step 1: Create a New Web Service
1. Go to [dashboard.render.com](https://dashboard.render.com) and log in (recommended: log in with GitHub).
2. Click the **"New +"** button in the top right and select **"Web Service"**.
3. Choose **"Build and deploy from a Git repository"** and click **Next**.
4. Select your repository: `gangulisabyasachi/hackheritage2026_omnitrix` (or connect your GitHub account if not already connected).

### Step 2: Configure Service Settings
Fill in the following exact settings:

| Field | Value | Notes |
| :--- | :--- | :--- |
| **Name** | `smriti-backend` | Or any unique name you prefer |
| **Region** | `Singapore (Southeast Asia)` | Lowest latency for India & NER |
| **Branch** | `main` | Production branch |
| **Root Directory** | `backend` | ⚠️ **Crucial**: Backend files are in `backend/` |
| **Runtime** | `Node` | Detected automatically |
| **Build Command** | `npm install && npm run build` | Compiles TypeScript to `dist/` |
| **Start Command** | `npm start` | Runs `node dist/server.js` |
| **Instance Type** | `Free` | Free tier |

### Step 3: Add Environment Variables
Scroll down to the **"Environment Variables"** section and add the following 5 variables:

```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/smriti_db?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Copy your actual MongoDB connection URI and Gemini API key into Render's dashboard environment variables)*.

### Step 4: Deploy & Verify
1. Click **"Create Web Service"**.
2. Render will stream the build logs (`npm install`, `tsc`).
3. Once the build completes, the logs will show:
   ```text
   🌸 SMRITI NER - Cognitive Gaming & Memory Platform 🌸
   🚀 Backend API Server running on port: 5001
   Connected to MongoDB Atlas successfully.
   ```
4. Copy your backend service URL from the top of the Render dashboard, for example:
   `https://smriti-backend.onrender.com`
5. Test the health endpoint in your browser:
   👉 `https://smriti-backend.onrender.com/api/health`
   It should return `{"status":"online", "service":"Smriti Cognitive Platform API", ...}`.

> [!NOTE]
> **Render Free Tier Spin-Down**: On Render's free tier, instances spin down after 15 minutes of inactivity. The first request after a cold start may take 30–50 seconds while the instance wakes up.

---

## PART 2: Deploy Frontend to Vercel

Vercel will host the Next.js 14 frontend with global edge caching and automatic SSL.

### Step 1: Import Project in Vercel
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** in the top right > select **"Project"**.
3. Locate `hackheritage2026_omnitrix` in your GitHub repository list and click **"Import"**.

### Step 2: Configure Project Settings
1. **Framework Preset**: Should automatically show `Next.js`.
2. **Root Directory**: Click **"Edit"** next to Root Directory and select `frontend`.
   ⚠️ **Do not skip this step!** The Next.js application lives inside the `frontend/` directory.

### Step 3: Set Environment Variables
In the **Environment Variables** section, add:

| Key | Value | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://<YOUR-RENDER-BACKEND-URL>/api` | `https://smriti-backend.onrender.com/api` |

> [!IMPORTANT]
> Make sure to append `/api` at the end of the URL, e.g.:
> `https://smriti-backend.onrender.com/api`

### Step 4: Deploy
1. Click **"Deploy"**.
2. Vercel will run `next build`, generate static pages, and deploy to their global CDN (~1 minute).
3. Once complete, click **"Continue to Dashboard"** or click the preview thumbnail to visit your live site!
   (e.g., `https://neuromitra.vercel.app` or `https://smriti-ner.vercel.app`).

---

## PART 3: Post-Deployment Verification Checklist

Verify the entire system end-to-end:

- [ ] **Frontend Loads**: Visit the Vercel URL. Check the landing page hero, regional cultural motifs, and language selector (Assamese, Bengali, Hindi, English).
- [ ] **Login Flow**:
  - Log in with Demo Patient: `patient@smriti.org` / `REDACTED_DEMO_PASSWORD`
  - Log in with Demo Caregiver: `caregiver@smriti.org` / `REDACTED_DEMO_PASSWORD`
  - Log in with Healthcare Worker: `doctor@smriti.org` / `REDACTED_DEMO_PASSWORD`
- [ ] **AI Assistant**: In the patient portal, open the Voice/Text Assistant and ask:
  *"What is my schedule for today?"*
  Confirm Gemini responds with Mrs. Ananya Das's scheduled walk, breakfast, and medications.
- [ ] **Cognitive Games**: Play a game of *Memory Match* or *Object Recognition*. Check that the score and completion update properly.
- [ ] **Caregiver Analytics**: Open the caregiver dashboard and verify Recharts graphs render real-time cognitive performance trends from MongoDB Atlas.

---

## Troubleshooting Production Deployments

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **Vercel build fails with "Cannot find package.json"** | Root Directory not set | Go to Vercel Project Settings > General > Root Directory, change to `frontend`, and Redeploy. |
| **API calls fail with "Network Error" or CORS error** | `NEXT_PUBLIC_API_URL` missing or incorrect | Verify that `NEXT_PUBLIC_API_URL` is set in Vercel with `/api` at the end and redeploy. |
| **Render server crashes on start** | Missing environment variables | Ensure `MONGODB_URI`, `JWT_SECRET`, `AI_PROVIDER`, and `GEMINI_API_KEY` are all defined in Render Environment Variables. |
| **MongoDB Atlas connection timed out** | Atlas IP access list blocked | Go to MongoDB Atlas > Network Access > ensure `0.0.0.0/0` (Allow from anywhere) is active. |
| **Render cold start delay** | Free tier spin-down | Render free instances sleep after 15 min. First request takes ~40s. Once awake, subsequent requests are instantaneous. |
