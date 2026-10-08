# 🎥 DroneTV AI Assistant — 5-10 Minute Video Walkthrough Script & Presentation Guide

This document provides a comprehensive, professional presentation script and recording guide for your **5 to 10-minute video walkthrough** for the IPAGE Group technical evaluation.

---

## ⏱️ Video Timeline & Screen Breakdown

| Time Window | Section | Screen / Visual Focus | Key Demonstration Highlights |
|---|---|---|---|
| **00:00 – 01:15** | **Introduction & Cinematic Boot Sequence** | Start Screen (`http://localhost:5173`) | Introduce yourself (Priyanshu Pundir). Showcase the **DroneTV Start Intro Animation** with synthesized Web Audio motor spool, telemetry boot sequence, and transition into the main platform. |
| **01:15 – 02:45** | **Drone Shape Cursor & Flight Contrail** | Landing Page Navigation | Demonstrate the **Quadcopter Drone Cursor**: 4 spinning rotors, aviation navigation lights (Red/Green/Cyan), heading banking physics, and multi-stop gradient flight contrail ribbon (`#00f2fe` $\rightarrow$ `#38bdf8` $\rightarrow$ `#818cf8`). |
| **02:45 – 04:15** | **3D Weight-Tilt Physics & Aerospace UI** | Services & Courses Sections | Demonstrate **3D Weight-Tilt Physics**: hovering any edge sinks that edge backward into the screen while the opposite edge rises forward in 3D perspective (`perspective: 1100px`), with specular cyan glare and directional shadows. Show radar drone click ping in Hero. |
| **04:15 – 06:00** | **Rule-Based Chatbot Demonstration** | Chatbot Panel (Floating Widget) | Click predefined questions (Services, Courses, Registration, Student concession). Show quick prompt chips, natural query matching, fallback handling, and the **working conversation history refresh/reset button**. |
| **06:00 – 07:30** | **Lead Enquiry Submission & Validation** | Enquiry Form & DevTools Network Tab | Trigger client-side validation on invalid inputs. Submit a valid enquiry (Student / Customer). Show `POST /api/enquiries` payload with `201 Created` status in Chrome DevTools Network tab. |
| **07:30 – 09:00** | **Admin CRM Dashboard & CRUD Operations** | Admin Portal Tab (`http://localhost:5173` Admin) | Showcase real-time KPI metrics, search filtering, category filtering (Student vs Customer), in-place status update (`PATCH /api/enquiries/:id`), detail modal, delete action (`DELETE`), and CSV export. |
| **09:00 – 10:00** | **Architecture, Security & Conclusion** | VS Code Codebase & Submission Overview | End-to-end architecture (`React + TS` $\rightarrow$ `Express REST API` $\rightarrow$ `Persistent Store`), security practices (`helmet`, CORS, XSS sanitization, rate limiting), and clean 7-folder repository structure. |

---

## 🎙️ Step-by-Step Spoken Script

### 1. Introduction & Cinematic Intro Animation (0:00 – 1:15)
> **[VISUAL: App opens at `http://localhost:5173`, showing the DroneTV start intro animation]**
>
> *"Hello hiring team at IPAGE Group. My name is **Priyanshu Pundir**, and this is my submission for the Full Stack Developer Intern practical assignment: the **DroneTV AI Support & Lead Assistant** web application.*
>
> *As requested, I built a production-grade, typed web application inspired by DroneTV’s aerospace ecosystem, covering commercial flight operations and government-certified pilot training.*
>
> *When the application loads, users are greeted with a custom **DroneTV cinematic intro animation** with synthesized Web Audio motor spool-up, harmonic telemetry chimes, and an autonomous radar boot sequence. Users can let it play or immediately click **'Enter DroneTV Platform'** or **'Skip to Dashboard'**.*
>
> *Let's enter the platform now."*

---

### 2. Interactive Drone Cursor & Flight Contrail (1:15 – 2:45)
> **[VISUAL: Move the mouse across the hero section; observe the drone model and contrail]**
>
> *"Before diving into the business features, notice the custom **interactive flight cursor** replacing standard browser pointers:*
> - *It is a high-precision **vector quadcopter drone** complete with 4 rapidly spinning propellers, aviation-standard port red and starboard green navigation lights, a pulsing fusion reactor core, and a forward searchlight beam.*
> - *Notice the **real-time flight physics**: as I maneuver across the screen, the aircraft calculates heading velocity and dynamically banks and rotates in the direction of flight using angular lerp math.*
> - *Trailing behind the aircraft is a **multi-stop gradient flight contrail ribbon** transitioning from neon cyan to sky blue to electric purple with tapering plasma exhaust nodes.*
> - *When hovering over interactive buttons, the drone enters **target acquisition mode** with expanded rotor speed, and clicking triggers a tactile engine throttle dip with expanding radar shockwave rings.*
> - *For users who prefer native system controls, a discreet floating toggle pill in the bottom-left corner allows switching the custom drone reticle on or off with local storage persistence."*

---

### 3. 3D Weight-Tilt Physics & Landing Experience (2:45 – 4:15)
> **[VISUAL: Scroll down to Services and Courses; hover edges and corners of cards and banners]**
>
> *"Now let's examine the interactive card mechanics. On all course cards, service cards, and featured banners, I implemented a **realistic 3D weight-tilt physics system**:*
> - *Watch what happens when I move the cursor to the **top edge**: the top edge physically sinks backward into the screen away from us, while the opposite bottom edge lifts forward in true 3D perspective.*
> - *When I move to the **bottom edge**, the bottom sinks backward, and the top tilts forward.*
> - *Moving to the **left edge** presses the left side into the screen while the right side rises forward, and vice-versa for the **right edge**.*
> - *Notice the **dynamic specular cyan glare**: a real-time reflection tracks the exact contact point of the cursor, and directional drop shadows cast dynamically away from the tilted edge.*
> - *All headings, icons, and CTA buttons float with holographic 3D parallax depth using `translateZ`.*
> - *In the hero section, clicking the central radar telemetry drone triggers an authentic acoustic radar ping using the built-in synthesized Web Audio manager."*

---

### 4. Rule-Based Chatbot Demonstration (4:15 – 6:00)
> **[VISUAL: Click floating Chatbot Widget in the bottom-right corner]**
>
> *"Now let's open the AI Support Assistant from Part 2 of the assignment.*
>
> *To adhere strictly to assignment requirements, the chatbot runs entirely on a lightweight, deterministic **rule-based matching engine** without costly third-party LLM dependencies, ensuring instant latency and zero downtime:*
> - *Let's test the predefined questions: Clicking **'What services does DroneTV provide?'** returns our 5 enterprise capabilities with action links.*
> - *Clicking **'What courses / training are available?'** returns our DGCA Remote Pilot Certification details and syllabus.*
> - *Clicking **'How can I register?'** or typing **'I am a student'** provides direct guidance and academic concession instructions.*
> - *Let's test natural query variations: Typing **'Tell me about agricultural spraying'** instantly matches our AgriTech drone payload services.*
> - *If an unrecognized question is asked, such as **'Can drones fly underwater?'**, the assistant gracefully triggers fallback recommendations.*
> - *Notice the **conversation refresh button** in the header: clicking it instantly clears conversation history and presents a clean slate for the user."*

---

### 5. Lead Enquiry Submission & Validation (6:00 – 7:30)
> **[VISUAL: Scroll to Enquiry Form; open Chrome DevTools Network tab on the side]**
>
> *"Next is the Lead Capture and Enquiry Module from Part 3 of the task.*
>
> *Let's test our **dual-layer validation**:*
> - *If I attempt to submit an empty form, client validation prevents submission and provides immediate inline error feedback on name, email, and phone number.*
> - *If I enter an invalid phone number or malformed email, the form prevents submission with helpful error messages.*
>
> *Now let's fill out a valid enquiry:*
> - *Name: **Priyanshu Pundir***
> - *Email: **priyanshu@example.com***
> - *Phone: **+91 98765 43210***
> - *User Type: **Student***
> - *Interest: **DGCA Certified Remote Pilot Training***
> - *Message: **Interested in enrolling in the upcoming DGCA RPC weekend batch.***
>
> *Now watch the DevTools Network tab as I hit **Submit Enquiry**:*
> - *A `POST` request to `/api/enquiries` is dispatched.*
> - *The backend validates and sanitizes the payload, stores it in the persistent datastore, and returns a `201 Created` response with the unique enquiry ID.*
> - *A high-tech confirmation toast appears, and the form resets cleanly."*

---

### 6. Admin CRM Dashboard & CRUD Operations (7:30 – 9:00)
> **[VISUAL: Click 'Admin CRM' in navbar or navigate to the Admin Dashboard]**
>
> *"Now let's switch to the **Admin Dashboard** from Part 6 of the assignment, which provides administrative staff with full CRUD management:*
> - *At the top, we have real-time KPI counter cards tracking total leads, New leads, Contacted, In Progress, and Closed leads.*
> - *Notice our newly submitted lead from **Priyanshu Pundir** is immediately present at the top of the table.*
> - *Let's test **real-time search**: typing **'Priyanshu'** in the search bar instantly filters the dataset with zero server lag.*
> - *We can filter by category: toggling between **'Student'** and **'Customer'** isolates leads by audience.*
> - *Let's perform an in-place **status update**: changing the status dropdown from **'New'** to **'Contacted'** dispatches a `PATCH /api/enquiries/:id` request that updates the record in real time.*
> - *Clicking the **eye icon** opens the full enquiry detail modal, displaying complete telemetry details, contact info, and internal admin notes.*
> - *Clicking the **trash icon** triggers a confirmation prompt and dispatches a `DELETE /api/enquiries/:id` request.*
> - *Finally, clicking **'Export CSV'** generates a downloadable `.csv` file containing the filtered lead dataset for CRM import."*

---

### 7. Architecture, Security & Code Quality (9:00 – 10:00)
> **[VISUAL: Switch to VS Code; show folder tree and `backend/src/server.ts`]**
>
> *"To conclude, let's briefly look at the code architecture:*
> - *The **Frontend** is built in modern React 18 with TypeScript and Vite, featuring component modularity and zero external UI bloat.*
> - *The **Backend** is built with Node.js, Express, and TypeScript, structured with clear separation of routes, controllers, models, and middleware.*
> - *The database layer features seamless dual-mode capability: full support for **MongoDB with Mongoose**, paired with an automatic zero-config persistent datastore fallback so the project works out-of-the-box.*
> - *For **Security**, the API enforces `helmet` security headers, CORS origin whitelisting, input sanitization against XSS, and rate limiting with `express-rate-limit`.*
> - *All environment variables and ports are configurable via `.env`, with zero hardcoded credentials.*
> - *The repository strictly complies with the company submission standard, organized into the canonical numbered folders `01_Source_Code` through `07_Submission_Checklist`.*
>
> *Thank you very much to the IPAGE Group team for evaluating my submission. I look forward to the next steps!"*

---

## 🎬 Recording & Production Checklist

### Pre-Recording Setup:
1. **Start Both Servers**:
   ```bash
   # Terminal 1 - Backend (port 5000):
   cd 01_Source_Code/backend && npm run dev

   # Terminal 2 - Frontend (port 5173):
   cd 01_Source_Code/frontend && npm run dev
   ```
2. **Verify Endpoints**:
   - Open `http://localhost:5000/api/health` $\rightarrow$ should return `{"status":"ONLINE"}`.
   - Open `http://localhost:5173/` $\rightarrow$ intro animation should play smoothly.
3. **Screen Resolution**: Set display to **1920x1080 (1080p)** for crystal-clear code and UI readability.
4. **Browser Setup**: Close extraneous tabs, enable Chrome DevTools on the right side for the Network tab demo, and test audio microphone input.

### Post-Recording Steps:
1. Export video in **MP4** or **MKV** format (recommended length: **7 to 9 minutes**).
2. Upload to **Google Drive** (set permission to *"Anyone with the link – Viewer"*) or **YouTube** (set to *"Unlisted"*).
3. Paste your public link into [`05_Video_Walkthrough/WALKTHROUGH_LINK.txt`](file:///c:/Users/PRIYANSHU/OneDrive/Desktop/DroneTV/FullStack_Chatbot_Task_Priyanshu_Pundir/05_Video_Walkthrough/WALKTHROUGH_LINK.txt).
