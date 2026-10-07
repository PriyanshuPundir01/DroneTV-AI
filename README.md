# 🛸 DroneTV AI Support & Lead Assistant — Full Stack Web Application

> **IPAGE Group — Practical Technical Assignment for Full Stack Developer Intern**  
> Candidate Name: **Priyanshu Pundir**  
> Project Name: `FullStack_Chatbot_Task_Priyanshu_Pundir`  
> Business Context: Inspired by [DroneTV.in](https://dronetv.in/) — India's Premier Drone Tech, Media & Flight Academy Ecosystem.

---

## 📸 Application Screenshots Showcase

| View | Screenshot Preview |
|---|---|
| **01. DroneTV Home & Telemetry Radar** | ![Home Overview](02_Screenshots/01_Home_Page.png) |
| **02. Mission-Critical Drone Services** | ![Services](02_Screenshots/02_Services_and_Metrics.png) |
| **03. AI Support Chatbot — Predefined Queries** | ![Chatbot](02_Screenshots/03_Chatbot_Services_Query.png) |
| **04. Flight Academy & FPV Training** | ![Courses](02_Screenshots/04_Chatbot_Courses_Query.png) |
| **05. Admin CRM Dashboard** | ![Admin CRM](02_Screenshots/05_Admin_Dashboard.png) |
| **06. Live Real-Time Search & Filtering** | ![Search](02_Screenshots/06_Admin_Live_Search_Filter.png) |
| **07. Full Enquiry Details & Status Updater** | ![Modal Details](02_Screenshots/07_Enquiry_Detail_Modal.png) |

---

## 📌 Project Overview

This repository contains an end-to-end full stack web application featuring:
1. **Interactive AI Chatbot Assistant:** A rule-based conversational assistant that answers key business queries regarding DroneTV's DGCA-certified training courses, commercial drone services, contact routes, and student scholarships — with zero expensive external API dependencies. Includes in-chat lead collection and conversation reset.
2. **Dual-Layer Validated Lead Enquiry System:** Seamless student & enterprise enquiry collection with client-side and server-side validation against injection, XSS, and malformed inputs.
3. **Comprehensive Admin CRM Dashboard:** Real-time enquiries table with dynamic keyword search, categorization by user type (`Student` / `Customer`), status management (`New`, `Contacted`, `In Progress`, `Closed`), full detail modals, deletion controls, and CSV export.
4. **Resilient Database Layer:** Primary support for **MongoDB (Mongoose)**, complete relational **PostgreSQL/MySQL SQL schemas**, and an automatic zero-friction fallback persistent datastore enabling immediate review without local database setup friction.

---

## 🛠️ Tech Stack & Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Port 5173)                 │
│  React 18/19 + TypeScript + Vite + Vanilla CSS System       │
│  - Interactive AI Chatbot Widget (Rule-Based Engine)        │
│  - Responsive Landing, Services & Courses Sections          │
│  - Validated Enquiry Form + Admin CRM Portal                │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP REST Requests
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND API LAYER (Port 5000)             │
│  Node.js + Express.js + TypeScript                          │
│  - Security: Helmet, CORS, Rate Limiting, Sanitization      │
│  - Rule-Based Chatbot Engine (/api/chat)                    │
│  - RESTful CRUD Controllers & Middleware (/api/enquiries)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ Mongoose ODM / Persistent Fallback
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE / STORAGE                      │
│  - MongoDB (Mongoose Schema & Indexes)                      │
│  - PostgreSQL / MySQL Compatible (schema.sql)               │
│  - Zero-Config Local Persistent Datastore (Auto-Fallback)   │
└─────────────────────────────────────────────────────────────┘
```

### Frontend
- **Framework:** React.js (v18/19) with strict TypeScript
- **Bundler & Dev Server:** Vite 6
- **Styling:** Custom Vanilla CSS Design System with Cyber-Aerospace Dark Palette, Glassmorphism & Keyframe Animations
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js (v20+ / v25+)
- **Framework:** Express.js (v4.21+) with TypeScript
- **Security:** `helmet` (HTTP headers), `cors` (origin verification), `express-rate-limit` (DDoS mitigation), Custom XSS sanitization
- **Development Tooling:** `tsx` for high-speed hot-reload execution

### Database
- **Primary:** MongoDB with Mongoose ODM
- **Relational Alternative:** PostgreSQL / MySQL (`schema.sql` included)
- **Zero-Config Resilient Fallback:** Persistent JSON datastore ensuring 100% immediate evaluation uptime without running a database daemon

---

## 📂 Project Organization & Submission Structure

The project strictly follows the submission folder structure specified by IPAGE Group:

```
FullStack_Chatbot_Task_Priyanshu_Pundir/
├── 📁 01_Source_Code/
│   ├── 📁 backend/               # Node.js + Express + TypeScript REST API
│   │   ├── src/
│   │   │   ├── config/           # Database & environment configurations
│   │   │   ├── controllers/      # Enquiry CRUD & Chatbot controllers
│   │   │   ├── middleware/       # Input validation, sanitization & safe error handlers
│   │   │   ├── models/           # Mongoose schemas & persistent repository
│   │   │   ├── routes/           # REST endpoint routers
│   │   │   ├── services/         # Rule-based chatbot NLP pattern matcher
│   │   │   ├── scripts/seed.ts   # Database seed runner
│   │   │   └── server.ts         # Server entrypoint
│   │   ├── .env                  # Backend environment variables
│   │   ├── .env.example          # Environment variable template
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── 📁 frontend/              # React + TypeScript + Vite Web App
│   │   ├── src/
│   │   │   ├── components/       # Navbar, Hero, Services, Courses, Form, Admin, Chatbot
│   │   │   ├── services/api.ts   # Centralized typed HTTP API service
│   │   │   ├── types/            # TypeScript data contracts & interfaces
│   │   │   ├── index.css         # Aerospace design system tokens
│   │   │   └── App.tsx           # Master layout & view manager
│   │   ├── index.html            # Google Fonts & aerospace metadata
│   │   ├── package.json
│   │   └── vite.config.js        # Reverse proxy config
│   ├── package.json              # Monorepo runner (concurrent execution)
│   └── README.md
├── 📁 02_Screenshots/            # High-resolution screenshots of all views
├── 📁 03_API_Documentation/      # Complete API Markdown reference + Postman Collection JSON
├── 📁 04_Database/               # SQL schema, MongoDB schema, seed data & setup instructions
├── 📁 05_Video_Walkthrough/      # 5-10 minute presentation guide, script & link template
├── 📁 06_GitHub/                 # Git push instructions, repository link template
└── 📁 07_Resume/                 # Priyanshu Pundir updated resume PDF
```

---

## ⚡ Quick Start & Run Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Option 1: Run Entire Full Stack App Concurrently (Recommended)

From the `01_Source_Code` directory, run both Backend (port 5000) and Frontend (port 5173) simultaneously with one single command:

```bash
# Navigate to source code root
cd 01_Source_Code

# Install root orchestrator dependencies
npm install

# Start both Backend and Frontend concurrently
npm run dev
```

- **Frontend URL:** [http://localhost:5173](http://localhost:5173)
- **Backend API URL:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

### Option 2: Run Backend and Frontend in Separate Terminals

#### Terminal 1 — Backend API
```bash
cd 01_Source_Code/backend
npm install
npm run seed      # Populates initial realistic DroneTV sample records
npm run dev       # Starts server on port 5000 with hot-reload
```

#### Terminal 2 — Frontend App
```bash
cd 01_Source_Code/frontend
npm install
npm run dev       # Starts Vite dev server on http://localhost:5173
```

---

## 🔐 Environment Variables

The backend configuration is managed via `01_Source_Code/backend/.env`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database Connection (MongoDB Atlas or Local MongoDB)
MONGODB_URI=mongodb://127.0.0.1:27017/dronetv_db

# Zero-config persistent fallback enabled when MongoDB is offline
USE_FALLBACK_STORE=true
```

---

## 📡 REST API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health status, server uptime, and database connection state |
| `GET` | `/api/enquiries` | Retrieve enquiries with search (`search`), filters (`userType`, `status`), and pagination |
| `GET` | `/api/enquiries/stats/summary`| Aggregate analytical counts for Admin Dashboard KPI cards |
| `GET` | `/api/enquiries/:id` | Retrieve single enquiry details (returns `404` if missing) |
| `POST` | `/api/enquiries` | Create new lead enquiry (strict client & server validation) |
| `PATCH` | `/api/enquiries/:id` | Update enquiry status (`New`, `Contacted`, `In Progress`, `Closed`) or admin notes |
| `DELETE`| `/api/enquiries/:id` | Permanently remove an enquiry record |
| `GET` | `/api/chat/questions` | Retrieve canonical predefined questions for quick buttons |
| `POST` | `/api/chat/message` | Process free-text questions using pattern and keyword matching |

*Detailed request/response documentation and Postman collection are located in [`03_API_Documentation`](03_API_Documentation).*

---

## 🤖 Rule-Based Chatbot Specifications

The AI Chatbot supports all predefined questions mandated in Part 2 of the assignment:
1. **"What services does DroneTV provide?"** — Detailed breakdown of 4K/8K aerial cinematography, LiDAR surveying, agriculture spraying, and industrial inspection.
2. **"What courses / training are available?"** — Information on DGCA Remote Pilot Certification (RPC), FPV racing masterclass, and cinematography flight school.
3. **"How can I contact DroneTV?"** — Phone numbers (+91 88043 49999, +91 63032 30227), email addresses, and office hours.
4. **"How can I register?"** — 4-step registration process and links.
5. **"I am interested in a service."** — Custom commercial quote prompt with direct form routing.
6. **"I am a student."** — Details on college scholarships and concession benefits.
7. **"I want to speak with someone."** — Callback request options and direct consultant contacts.

### Additional Chatbot Capabilities:
- **Conversation History:** Retains session message history.
- **Graceful Fallbacks:** Catches unmatched queries with suggested topics and a one-click lead submission link.
- **Clear Conversation:** Allows clearing session messages with confirmation.
- **In-Chat Lead Submission:** Users can submit their full enquiry directly inside the chat window.

---

## 🛡️ Security & Defensive Coding Practices

1. **Dual-Layer Validation:** Never trusts client input alone; backend validates name, RFC-compliant email, phone regex, user category, interest, and message length.
2. **Input Sanitization:** Strips HTML/script tags from user inputs to protect against stored Cross-Site Scripting (XSS).
3. **Secure HTTP Headers:** Utilizes `helmet` to guard against clickjacking, MIME-sniffing, and cross-site injection.
4. **Rate Limiting:** Protects backend endpoints against brute-force and request flooding via `express-rate-limit`.
5. **Safe Error Handling:** Production and client error responses never leak sensitive database connection strings, paths, or internal stack traces.
6. **Zero Secrets in Repository:** Configuration is handled strictly via `.env`.

---

## 🎓 Evaluation & Verification Summary

- [x] **React + TypeScript frontend** with clean component structure
- [x] **Functional chatbot** with predefined rule-based responses and session history
- [x] **Enquiry collection** with full validation
- [x] **Backend API** with Node.js + Express and REST conventions
- [x] **Database integration** with MongoDB, Mongoose, SQL schemas, and zero-config fallback
- [x] **Full CRUD operations** (Create, Read, Update, Delete)
- [x] **Admin dashboard** with search, Student/Customer filtering, and status updates
- [x] **Screenshots** captured and organized
- [x] **Organized in required Google Drive folder structure**

---

**Developed with dedication by Priyanshu Pundir**  
Contact: `pindipolu@ipageums.com` | WhatsApp: `+91 88043 49999`
