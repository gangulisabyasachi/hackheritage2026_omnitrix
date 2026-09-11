# Step-by-Step MongoDB Atlas Setup Guide for Smriti NER

This beginner-friendly guide walks you through connecting **MongoDB Atlas** (cloud database) to the Smriti platform from start to finish.

> [!NOTE]
> **Zero-Configuration Local Fallback**:
> If you run the backend without providing a `MONGODB_URI` in `.env`, the Smriti backend will automatically launch an embedded in-memory MongoDB instance with all demo data pre-seeded. This allows you to evaluate the platform immediately. When you are ready to persist data to the cloud, follow the 11 steps below!

---

## Step 1: Go to MongoDB Atlas

1. Open your web browser and navigate to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. **What is MongoDB Atlas?**
   MongoDB Atlas is a fully-managed cloud database service hosted by MongoDB. Instead of installing and managing a database server on your local machine, Atlas runs securely in the cloud (AWS, Google Cloud, or Azure), provides automated backups, high availability, and offers a generous permanent **Free Tier (M0)** suitable for hackathons and prototypes.

---

## Step 2: Create an Account

1. Click the green **"Try Free"** or **"Sign In"** button in the top-right corner.
2. Sign up using your Google account, GitHub account, or your email address.
3. Accept the Terms of Service and complete registration.

---

## Step 3: Create a Free Cluster (M0)

1. Once logged into the Atlas dashboard, click **"Build a Database"** (or **"Create"**).
2. Choose the **M0 Free** tier (Shared Cluster):
   - **Cloud Provider**: AWS (recommended) or Google Cloud
   - **Region**: Pick the region geographically closest to you (e.g., `ap-south-1` Mumbai for India)
   - **Cluster Name**: Leave as `Cluster0` or name it `smriti-cluster`
3. Click the green **"Create Deployment"** button at the bottom.

---

## Step 4: Create a Database User

A security modal titled **"Security Quickstart"** will appear prompting you to authenticate your connection:

1. Select **Username and Password** authentication.
2. **Username**: Enter a simple username, e.g., `smriti_admin`.
3. **Password**: Click **"Autogenerate Secure Password"** or enter a strong password of your choice.
   > [!IMPORTANT]
   > Copy this password immediately and save it somewhere temporary. You will need it in Step 6.
4. **Database Permissions**: Leave the default ("Read and write to any database").
5. Click **"Create Database User"**.

---

## Step 5: Configure Network Access (IP Access List)

In the same Quickstart dialog or under **Security > Network Access** in the left sidebar:

1. Under **"Where would you like to connect from?"**, choose:
   - **"Allow Access from Anywhere"** (`0.0.0.0/0`) for development / hackathon testing.
2. Click **"Add Entry"** (or **"Add IP Address"**).
3. **Security Implications**:
   - `0.0.0.0/0` permits connections from any IP address as long as they have your valid username and password. This is ideal for hackathons, remote team members, and demo laptops on varied Wi-Fi networks.
   - For high-security production environments, you should restrict access to your specific backend server static IP.
4. Click **"Finish and Close"**.

---

## Step 6: Get Your MongoDB Connection String

1. On the **Clusters** page, click the **"Connect"** button next to your cluster.
2. In the modal, select **"Drivers"** (under Connect to your application).
3. Verify Driver is set to **Node.js** and Version is **6.7 or later**.
4. You will see a connection string formatted like:
   ```text
   mongodb+srv://smriti_admin:<db_password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
5. Click the copy icon to copy this string.
6. Replace `<db_password>` with your actual password created in Step 4.
7. Append the database name `smriti_db` before the `?` query parameters:
   ```text
   mongodb+srv://smriti_admin:<YOUR_PASSWORD>@cluster0.abcde.mongodb.net/smriti_db?retryWrites=true&w=majority
   ```

---

## Step 7: Open Backend `.env` and Configure `MONGODB_URI`

1. Open `prototype/backend/.env` in your editor.
2. Locate the line `MONGODB_URI=`.
3. Paste your full connection string:
   ```env
   PORT=5001
   MONGODB_URI=mongodb+srv://smriti_admin:<YOUR_PASSWORD>@cluster0.abcde.mongodb.net/smriti_db?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_here
   AI_PROVIDER=rule_fallback
   ```
4. Save the file.

---

## Step 8: Restart Backend

Stop the running backend (if active) and restart it:

```bash
cd prototype/backend
npm run dev
```

---

## Step 9: Verify the Connection

In your terminal console, you should see:

```text
🔄 Attempting connection to external MongoDB Atlas...
✅ Connected to MongoDB Atlas successfully.
🌱 Seeding Smriti NER database with demo accounts and data...
✅ Seed completed successfully!
====================================================
🌸 SMRITI NER - Cognitive Gaming & Memory Platform 🌸
🚀 Backend API Server running on port: 5001
🔗 Health Check: http://localhost:5001/api/health
====================================================
```

---

## Step 10: Run the Seed Script (Optional Manual Re-seed)

If you ever wish to reset the demo data or reseed fresh records:

```bash
cd prototype/backend
npm run seed
```

This populates:
- Demo Patient: **Mrs. Ananya Das**
- Caregiver account: `caregiver@smriti.org` / `REDACTED_DEMO_PASSWORD`
- Doctor account: `doctor@smriti.org` / `REDACTED_DEMO_PASSWORD`
- Patient account: `patient@smriti.org` / `REDACTED_DEMO_PASSWORD`
- 4 Family members with photos
- 4 Cultural & personal memories
- 8 Daily routine items
- 4 Prescribed medications
- 2 Upcoming doctor consultations
- 15+ Historical game sessions spanning past 14 days

---

## Step 11: View Collections in MongoDB Atlas

1. In MongoDB Atlas, click **"Browse Collections"** on your cluster overview page.
2. In the left panel, click on database **`smriti_db`**.
3. You will see all initialized collections:
   - `users`: Registered caregiver, clinician, and patient logins
   - `patients`: Detailed patient demographic, preferences, emergency contacts
   - `games`: The 5 cognitive game definitions
   - `gamesessions`: Recorded gameplay sessions with accuracy, response time, and scores
   - `cognitiveperformances`: Aggregated cognitive domain scores
   - `familymembers`: Family photos, names, relationships, calling trivia
   - `memories`: Childhood and regional cultural memories
   - `routines`: Scheduled daily activities
   - `medications`: Active prescriptions and schedules
   - `appointments`: Scheduled medical visits
   - `reminders`: Today's medicine and hydration alerts
   - `moodentries`: Patient daily emotional check-ins
   - `notifications`: Care alerts and milestone notices
