# గోదావరి పుష్కరాలు 2027 | GODAVARI PUSHKARALU 2027
### *An Integrated Digital Pilgrim Experience and Heritage Access Platform*
**మీ పుష్కర యాత్రకు డిజిటల్ మార్గదర్శి**

---

## 📌 Project Overview
**Godavari Pushkaralu 2027** is an integrated public-service digital platform designed to serve millions of pilgrims physically visiting the sacred banks of River Godavari (Dakshina Ganga) and those experiencing the auspicious festival virtually worldwide.

The platform is designed across **8 strictly separated, professional development phases**.

---

## 🏛️ Eight-Phase Development Roadmap

| Phase | Title | Status | Scope |
| :---: | :--- | :---: | :--- |
| **Phase 1** | **Project Foundation & UI Design** | ✅ **Completed** | Vite + React + TS setup, FastAPI backend skeleton, bilingual design system (Telugu & English), responsive Navbar, Hero Slideshow, Quick-Access Services, Preview modules, and health-check APIs. |
| **Phase 2** | **Pilgrim Information & Navigation** | ✅ **Completed** | Event calendar with date/category filters, Bathing Ghat Explorer with crowd status, Temple directory, Parking finder, Leaflet/OSM interactive map, Browser Geolocation & distance calculation, Google Maps directions, and Smart Ghat Recommendation engine. |
| **Phase 3** | **Medical Assistance & Public Safety** | ✅ **Completed** | 24x7 verified emergency calling (108, 100, 112, 104, 181), Medical Camps & Hospital directory, Police Help Desks & River Police patrols, Lost & Found reporting, Missing Person Emergency alerts, Digital Incident Reporting with photo attachments, and Public-Safe Report Resolution Tracking with unique IDs. |
| **Phase 4** | **Live Pushkaralu** | ✅ **Completed** | Dedicated Live Hub (`/live`), dynamic player (`/live/:streamId`) with real YouTube embeds, countdown timer for upcoming streams, Recordings archive (`/live/recordings`), category filtering, browser reminder notifications, FastAPI live stream endpoints, and 100% demo data labeling. |
| **Phase 5** | **Heritage Explorer & Yatra Planner** | ✅ **Completed** | Comprehensive Heritage Explorer (`/heritage`), detailed destination pages (`/heritage/:slug`), educational Godavari legends and sthalapurana reader (`/heritage/stories/:slug`), multi-category photographic lightbox gallery, Personal Yatra Planner hub (`/yatra-planner`), custom itinerary builder (`/yatra-planner/create`) referencing existing ghats/temples/heritage, sequence reordering, Google Maps turn-by-turn routing, curated suggested day plans (`/yatra-planner/:id`), and FastAPI REST endpoints. |
| **Phase 6** | **Backend, Database & Admin Dashboard** | *Planned* | Full MongoDB integration, JWT/RBAC security, audit logging, and administrative management portals. |
| **Phase 7** | **AI Assistant & Accessibility** | *Planned* | Grounded AI Pilgrim Assistant (Telugu/English/Hindi, strictly non-hallucinatory), offline PWA caching, high contrast, and screen reader support. |
| **Phase 8** | **Testing, Optimization & Deployment** | *Planned* | End-to-end integration tests, mobile audits, performance tuning, and production cloud deployment. |

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Custom Sacred Godavari Theme
- **Typography**: `Noto Sans Telugu` (Telugu) & `Inter` (English)
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6)

### Backend
- **Framework**: Python 3.12 + FastAPI
- **Validation**: Pydantic v2 + Pydantic-Settings
- **Server**: Uvicorn (ASGI)
- **Database Driver**: Motor (Asynchronous MongoDB driver)
- **Architecture**: Modular layered structure (API, Core, Database, Schemas)

---

## 🚀 Getting Started & Execution Instructions

### Prerequisites
- **Node.js** (v18+ or v20+) and **npm**
- **Python** (v3.10+ or v3.12+)

---

### 1. Frontend Setup & Startup

Open a terminal in the root directory:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm.cmd install

# Start Vite development server
npm.cmd run dev
```

- **Frontend URL**: [http://localhost:5173](http://localhost:5173)
- **Production Build Test**:
  ```bash
  npm.cmd run build
  ```

---

### 2. Backend Setup & Startup

Open a second terminal in the root directory:

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server with live reload
uvicorn app.main:app --reload --port 8000
```

- **Backend API Root**: [http://localhost:8000/](http://localhost:8000/)
- **Health Check Endpoint**: [http://localhost:8000/api/health](http://localhost:8000/api/health)
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative Redoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🛡️ Data Safety & Integrity Policy
- **Demonstration Mode**: All dates, ceremony schedules, and stream previews in Phase 1 are clearly watermarked as sample demonstration data.
- **No Fabricated Emergency Data**: Only genuine national emergency numbers (112 and 108) are linked. Pushkaralu-specific camp numbers will be published exclusively upon official government releases.
- **Strict Disclaimers**: Displayed prominently across the header, footer, and individual preview modules.

---

## 📁 Directory Structure
```text
Godavari_Hackthon/
├── frontend/
│   ├── public/
│   │   ├── icons/logo.svg
│   │   └── images/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/ (Badge, SectionHeading)
│   │   │   ├── home/ (HeroSlideshow, QuickAccessServices, UpcomingEventsPreview, etc.)
│   │   │   └── layout/ (Navbar, Footer)
│   │   ├── data/ (mockData.ts)
│   │   ├── hooks/ (useLanguage.tsx)
│   │   ├── pages/ (HomePage, EventsPage, ExploreGhatsPage, etc.)
│   │   ├── routes/ (AppRoutes.tsx)
│   │   ├── services/ (api.ts)
│   │   ├── types/ (index.ts)
│   │   ├── utils/ (scrollToTop.tsx)
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/
│   ├── app/
│   │   ├── api/ (endpoints/health.py, router.py)
│   │   ├── core/ (config.py)
│   │   ├── database/ (session.py)
│   │   ├── schemas/ (health.py)
│   │   └── main.py
│   ├── .env.example
│   ├── requirements.txt
│   └── README.md
├── docs/
├── .gitignore
└── README.md
```
