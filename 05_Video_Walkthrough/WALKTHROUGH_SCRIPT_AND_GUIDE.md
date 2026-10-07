# 🎥 DroneTV AI Assistant — 5-10 Minute Video Walkthrough Script & Guide

This document provides a structured, professional presentation script for recording your **5 to 10-minute video walkthrough** for the IPAGE Group technical evaluation.

---

## ⏱️ Video Timeline & Screen Breakdown

| Time Window | Section | Screen / Visual Focus | Key Talking Points |
|---|---|---|---|
| **00:00 – 01:15** | **Introduction & Architecture** | VS Code / Architecture diagram & Home Page | Introduce yourself (Priyanshu Pundir), project title, and end-to-end architecture: `React + TypeScript Frontend` ➔ `REST API Layer` ➔ `Node.js + Express Backend` ➔ `MongoDB / Datastore`. |
| **01:15 – 03:00** | **Frontend UI & Business Context** | Landing page (`http://localhost:5173`) | Showcase original aerospace dark theme, radar telemetry animation, DGCA metrics, Services grid, and Course Academy with syllabus expansion. |
| **03:00 – 05:00** | **Rule-Based Chatbot Functionality** | Chatbot Panel (Floating Widget) | Click predefined questions (Services, Courses, Registration, Student concession). Show quick prompt chips, natural query matching, fallback handling, and clear conversation reset. |
| **05:00 – 06:45** | **Lead Enquiry & Dual-Layer Validation** | Enquiry Form & Network Tab | Demonstrate client-side error triggers (invalid email, short phone). Submit a valid enquiry. Show `POST /api/enquiries` payload with `201 Created` status in Chrome DevTools Network tab. |
| **06:45 – 08:30** | **Admin Dashboard & CRUD Operations** | Admin Portal Tab | Show live enquiries table, real-time search filtering, category filtering (Student vs Customer), status update (`PATCH /api/enquiries/:id`), detail modal, and delete action (`DELETE /api/enquiries/:id`). |
| **08:30 – 10:00** | **Codebase Walkthrough & Security** | VS Code Codebase | Highlight TypeScript types, Helmet/CORS headers, input sanitization against XSS, rate limiting, and environment variable configuration without hardcoded secrets. |

---

## 🎙️ Step-by-Step Spoken Script

### 1. Introduction (0:00 - 1:15)
> "Hello hiring team at IPAGE Group. My name is Priyanshu Pundir, and this is my submission for the Full Stack Developer Intern practical assignment: the **DroneTV AI Support & Lead Assistant** web application.
> 
> As requested, I have developed a typed, responsive web application inspired by DroneTV's ecosystem, covering drone training and commercial aerial operations.
> 
> The architecture consists of:
> - A modern **React.js and TypeScript** frontend built with Vite.
> - A modular **Node.js and Express** backend in TypeScript following strict REST conventions.
> - A persistent database layer supporting **MongoDB with Mongoose**, with automatic zero-setup persistent fallback and standard SQL schemas.
> - Full CRUD operations, rule-based chatbot query processing, dual-layer validation, and defensive security practices."

### 2. Frontend Overview & Services (1:15 - 3:00)
> *(Scroll through Homepage)*
> "Here is the DroneTV landing page. I designed an original aerospace-inspired dark theme featuring:
> - A live radar telemetry animation and fleet statistics.
> - An interactive **Services Section** covering 8K Cinematography, LiDAR Surveying, Agriculture spraying, and Industrial inspection with key deliverables.
> - A **Courses & Training Section** featuring DGCA-authorized Remote Pilot Certification (RPC), FPV racing, and expandable curriculum highlights.
> - Notice the live API status badge in the navbar indicating real-time communication with port 5000."

### 3. Rule-Based Chatbot Demonstration (3:00 - 5:00)
> *(Click the AI Assistant button bottom-right)*
> "Now let's open the AI Support Chatbot. As specified in Part 2, it does not rely on costly external LLM APIs; instead, it uses a rule-based matching engine that supports all required predefined queries:
> - When I click **'What services does DroneTV provide?'**, the assistant formats our 5 core enterprise services with direct navigation actions.
> - When I click **'What courses / training are available?'**, it provides our DGCA RPC and FPV masterclass options.
> - It also supports **'How can I register?'**, **'I am a student'**, and **'I want to speak with someone'**.
> - If an unknown question is typed, such as 'Can you fly to Mars?', the assistant gracefully catches it with fallback recommendations.
> - Users can also reset session conversation history with the reset button at the top."

### 4. Lead Enquiry Submission & Validation (5:00 - 6:45)
> *(Open Enquiry Form and open Chrome DevTools Network Tab)*
> "Now let's test lead collection from Part 3.
> - If I submit with empty or malformed fields, client validation prevents the dispatch and highlights the issues.
> - Let's enter:
>   Name: 'Priyanshu Pundir'
>   Email: 'priyanshu@example.com'
>   Phone: '+91 98765 43210'
>   User Type: 'Student'
>   Interest: 'DGCA Certified Remote Pilot Training'
>   Message: 'Looking for upcoming batch start dates.'
> - When I submit, you can see in the Network tab: a `POST` request to `/api/enquiries` returning `201 Created` with sanitized input."

### 5. Admin Dashboard & CRUD Operations (6:45 - 8:30)
> *(Switch to Admin Portal tab)*
> "Here is the Admin CRM Dashboard from Part 6:
> - We have real-time KPI counter cards for New, Contacted, In Progress, and Closed leads.
> - Let's test search: typing 'Priyanshu' instantly filters to the newly submitted record.
> - We can filter by category: 'Student' vs 'Customer'.
> - We can update the status directly from the dropdown to 'In Progress' or 'Contacted', which triggers an immediate `PATCH` request to the backend.
> - Clicking the eye icon opens the full enquiry modal with details and admin notes.
> - Clicking the delete button removes the record with confirmation.
> - We can also export all filtered leads to CSV with the 'Export CSV' button."

### 6. Security, Code Quality & Conclusion (8:30 - 10:00)
> *(Switch briefly to VS Code)*
> "Under the hood:
> - Security is enforced with `helmet`, CORS origin verification, input sanitization against XSS, and rate limiting (`express-rate-limit`).
> - No secrets or credentials are hardcoded; configuration is managed through `.env`.
> - The repository is organized into the requested 7 folders.
> 
> Thank you for reviewing my assignment for IPAGE Group. I look forward to discussing the role further!"

---

## 💡 Recording Tips
1. Record with OBS Studio, Loom, or Windows Xbox Game Bar (`Win + G`).
2. Make sure your microphone is clear and background noise is minimal.
3. Test your screen resolution at 1080p for sharp code visibility.
4. Upload the final MP4/MKV video to Google Drive or YouTube (Unlisted), and paste the link into `05_Video_Walkthrough/WALKTHROUGH_LINK.txt`.
