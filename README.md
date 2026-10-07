# 🌱 AgriPilot AI — Autonomous Agronomic Crop Advisory & Disease Diagnostics Platform

> **Hackathon Theme:** AI for Smart Agriculture  
> **Live Production URL:** [https://agripilot-ai-1-rwhy.onrender.com](https://agripilot-ai-1-rwhy.onrender.com)  
> **Core Value Proposition:** *"Protect your crops. Optimize every input. Harvest higher yields."*

---

## 📖 1. Problem Statement

Across global agricultural regions, small-to-large scale farmers lose **20% to 40% of crop yields** each season to preventable plant diseases, insect outbreaks, and soil nutrient depletion:
- **Delayed Disease Diagnosis:** Critical fungal and bacterial infections (e.g. Early Blight, Stripe Rust, Downy Mildew) are often noticed only after lesions have colonized 30%+ of the crop canopy.
- **Costly Chemical Misuse:** Over-application of expensive synthetic pesticides leads to toxic chemical runoff, pesticide resistance, and damaged beneficial soil microbiomes.
- **Suboptimal Irrigation & Fertigation:** Overhead watering during humid micro-climates accelerates fungal spore dispersal, while midday irrigation results in >20% evaporative loss.
- **Disconnected Signals:** Soil NPK tests, pest counts, weather patterns, and advisory histories are trapped in disparate paper notebooks rather than actionable, yield-optimizing workflows.

---

## 💡 2. Solution: AgriPilot AI

**AgriPilot AI** is a production-grade, full-stack intelligent AgTech SaaS platform designed for farmers, agricultural extension agents, and farm managers. 

By combining **Multimodal Computer Vision**, **Google Gemini 2.5 Flash**, **Soil NPK Profiling**, and **Integrated Pest Management (IPM)**, AgriPilot AI transforms raw leaf imagery and field telemetry into verified, instant, field-executable agronomic interventions.

### 🔄 The End-to-End Agronomic Loop:
$$\text{Leaf Photo / Symptoms} \longrightarrow \text{Multimodal Vision AI} \longrightarrow \text{Zod-Validated Diagnosis} \longrightarrow \text{Dual Organic + Chemical Protocol} \longrightarrow \text{Executive Yield Insights}$$

---

## ✨ 3. Core Features

### 🔍 1. Multimodal Leaf Disease Computer Vision
- Drag-and-drop or snapshot leaf lesions from mobile/desktop.
- Instant identification of:
  - **Early Blight & Late Blight** (*Alternaria solani*, *Phytophthora*)
  - **Powdery & Downy Mildew** (*Erysiphe*, *Peronosporaceae*)
  - **Yellow Stripe Rust** (*Puccinia striiformis*)
  - **Aphid & Sap-Feeding Vector Colonies**
  - **Nitrogen (N), Phosphorus (P), Potassium (K) Deficits**
  - **Drought & Cellular Turgor Water Stress**
- Includes 5 preset 1-click test leaf samples in the UI for instant hackathon demonstrations.

### 🌿 2. Dual Treatment Architecture (Organic vs. Chemical)
- **Certified Organic Remedy:** Bio-fungicides (*Bacillus subtilis*, *Trichoderma*), botanical neem formulations, compost extracts.
- **Regulated Chemical / IPM Remedy:** Precise product formulations (*Copper Oxychloride 50% WP*, *Mancozeb*, *Azoxystrobin*) with safe, verified dosage guidelines (e.g. 2.5g/L).
- **Spray Window Recommendations:** Automatic guidance for early morning (05:30 - 08:30 AM) or dusk to prevent phototoxicity.

### 🚨 3. Dynamic Agronomic Urgency & Priority Detection
- Automatically categorizes threats into:
  - **Low:** Routine seasonal monitoring.
  - **Medium:** Action needed within 3–5 days.
  - **High:** Intervention required within 24–48 hours to protect flag leaves.
  - **Critical:** Immediate field isolation to halt airborne spore epidemics.

### 📊 4. Executive Farm Analytics Dashboard
- **KPI Metrics:** Monitored Fields, Active Diagnostics, % Healthy Crops, Priority Threat Alerts, Soil Health Index, Pending Actions.
- **Interactive Recharts Visualizations:**
  - Pathology & Disease Distribution
  - Diagnostic Intent Categories (Pathology, Nutrient, Pest, Water Stress)
  - Threat Severity Levels
  - Soil NPK Balance Estimates

### 🗺️ 5. Field & Crop Parcel Management
- Full lifecycle management for multiple acreage blocks.
- Real-time Health Scores (0–100%) and dynamic risk level indicators.
- Historical consultation archive linked per plot.

### 🧠 6. Autonomous Farm Business Intelligence
- AI-synthesized micro-climate alerts (e.g. 85% relative humidity fungal vulnerability).
- Irrigation timing adjustments (+18% water retention via dawn drip shifting).
- NPK split-dose fertigation reminders during flowering and fruit-set.

---

## 🛠️ 4. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Tailwind CSS, Recharts, Lucide React, Axios |
| **Backend** | Node.js, Express.js (ES Modules), JWT, bcryptjs, Zod 3, CORS, dotenv |
| **Database** | Supabase PostgreSQL / Standard PostgreSQL (with resilient local relational store fallback) |
| **AI Integration** | Google Gemini API (`gemini-2.5-flash` via `@google/genai`) + Agronomic Inference Engine |

---

## 📐 5. System Architecture

```mermaid
graph TD
    A[Farm User / Mobile Browser] -->|React 18 + Vite| B[AgriPilot Client]
    B -->|REST APIs + JWT| C[Express Backend Server]
    C -->|Zod Validation| D{Request Router}
    D -->|Auth / Field Data| E[(Supabase PostgreSQL)]
    D -->|Multimodal Image + Symptoms| F[Google Gemini 2.5 Flash SDK]
    F -->|Structured JSON Output| G[Zod Response Validator]
    G -->|Store Analysis & Updates| E
    G -->|Return Diagnostic Protocol| B
```

---

## 🚀 6. Getting Started & Local Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Clone or Open the Repository
```bash
cd "Build to ship 2"
```

### 2. Configure Environment Variables
Copy `.env.example` to `server/.env`:
```bash
# In server/.env
PORT=5000
DATABASE_URL=postgresql://postgres:yourpassword@db.supabase.co:5432/postgres
JWT_SECRET=agripilot_ai_production_super_secret_jwt_key_2026
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
```
> *Note:* If `DATABASE_URL` is omitted, AgriPilot automatically initializes its persistent local storage engine (`server/db/agripilot_store.json`), allowing instant zero-config testing!

### 3. Install Dependencies
```bash
# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### 4. Run the Application Locally
In one terminal, start the Backend Server:
```bash
cd server
npm run dev
# Running on http://localhost:5000
```

In a second terminal, start the Frontend Client:
```bash
cd client
npm run dev
# Running on http://localhost:5173
```

Open your browser and navigate to: **`http://localhost:5173`**

---

## 🧪 7. Demo & Hackathon Walkthrough (3-5 Minute Script)

For judges or video presentation recordings, follow this sequence:

### **Minute 1: The Landing Page & 1-Click Login**
1. Visit `http://localhost:5173`.
2. Review the AgTech hero banner, problem statement, and multimodal workflow.
3. Click **"Sign In"** → Click the green button **"Autofill Demo Credentials (Dr. Michael Vance)"** → Click **"Sign In to Dashboard"**.

### **Minute 2: Executive Agronomic Dashboard**
1. View the live KPI cards: **5 Monitored Fields**, **Soil Health Index (82/100)**, **Active Diagnostics**.
2. Examine the Recharts graphs: **Crop Disease & Stress Distribution** and **Diagnostic Intent Categories**.
3. Point out the AI Farm Intelligence insights (e.g., *Tomato Fungal Risk elevated by 35%*).

### **Minute 3: Multimodal Leaf Disease Diagnosis (Primary Scenario)**
1. Navigate to **"AI Disease Advisor"** in the sidebar.
2. Select **"Block B - Roma Tomatoes"** from the field dropdown.
3. In the sample gallery, click the preset: **"Tomato Early Blight"** (or drag & drop your own photo).
4. The symptoms automatically populate:
   > *"My tomato plants have dark brown concentric ring spots on lower leaves with yellowing edges. Humidity has been 85% for three days and soil nitrogen is low."*
5. Click **"Execute AI Diagnostic Analysis"**.
6. The animated processing status displays: *"AgriPilot AI is analyzing leaf diagnostic patterns and soil context..."*
7. Inspect the generated **Diagnostic Finding Card**:
   - **Diagnosis:** Early Blight (*Alternaria solani*) (94% Confidence)
   - **Severity / Priority:** High (24–48h)
   - **Organic Remedy:** Bacillus subtilis / Cold-pressed Neem oil (5ml/L)
   - **Chemical Remedy:** Copper Oxychloride 50% WP @ 2.5g/L
   - **Immediate Operator Action:** Prune lower foliage and switch to drip irrigation.

### **Minute 4: Farm Plot Management & Insights**
1. Navigate to **"Fields & Crops"**: View plot cards with health scores and risk badges.
2. Click **"View Profile"** on Block B to see linked historical advisories.
3. Navigate to **"Farm Intelligence"**: Click **"Generate Fresh Insights"** to demonstrate autonomous advisory updates.

---

## 📡 8. API Endpoints Reference

### Authentication
- `POST /api/auth/register` — Register new farm manager
- `POST /api/auth/login` — Authenticate and receive JWT
- `GET /api/auth/me` — Retrieve active authenticated session
- `PUT /api/auth/settings` — Update farm sector, approach & alert sensitivity

### Fields & Crops
- `GET /api/fields` — List all user fields
- `POST /api/fields` — Create a new field plot
- `GET /api/fields/:id` — Get field profile & linked advisories
- `PUT /api/fields/:id` — Update field data
- `DELETE /api/fields/:id` — Remove field

### AI Advisor & Diagnostics
- `POST /api/ai/analyze` — Multimodal crop symptom & image diagnosis
- `POST /api/ai/diagnose-image` — Direct leaf photo vision analysis
- `POST /api/ai/generate-insights` — Synthesize proactive farm intelligence

### Dashboard & Analytics
- `GET /api/dashboard/stats` — Aggregated KPI metrics & insights
- `GET /api/dashboard/diseases` — Disease distribution
- `GET /api/dashboard/categories` — Diagnostic intent distribution
- `GET /api/dashboard/priorities` — Priority level counts

### Demo Utilities
- `POST /api/demo/seed` — 1-click re-seed realistic agronomic data

---

## ☁️ 9. Deployment Guide

### Deploy Database to Supabase
1. Create a new project in [Supabase](https://supabase.com).
2. Go to SQL Editor and run `database/schema.sql`.
3. Copy your project connection string and set `DATABASE_URL` in backend env.

### Deploy Backend to Render or Railway
1. Set Root Directory to `server`.
2. Build Command: `npm install`
3. Start Command: `node server.js`
4. Set Environment Variables: `PORT`, `DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`, `FRONTEND_URL`.

### Deploy Frontend to Vercel
1. Set Root Directory to `client`.
2. Framework Preset: `Vite`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Configure API proxy or set baseURL to your deployed backend URL.

---

## 📜 License
AgriPilot AI is open-sourced under the MIT License for the Hackathon.
