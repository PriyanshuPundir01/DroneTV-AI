# 📡 DroneTV AI Support & Lead Assistant — API Documentation

This document describes the REST API endpoints exposed by the DroneTV backend server.

- **Base URL:** `http://localhost:5000/api`
- **Content-Type:** `application/json`
- **Default Port:** `5000`

---

## 📑 Table of Contents
1. [Overview & Conventions](#overview--conventions)
2. [Health Check](#1-health-check)
3. [Enquiries Endpoints (CRUD)](#2-enquiries-crud-endpoints)
   - [Get All Enquiries](#get-apienquiries)
   - [Get Single Enquiry](#get-apienquiriesid)
   - [Create New Enquiry](#post-apienquiries)
   - [Update Enquiry](#patch-put-apienquiriesid)
   - [Delete Enquiry](#delete-apienquiriesid)
   - [Get Enquiry Statistics](#get-apienquiriesstatssummary)
4. [Chatbot Engine Endpoints](#3-chatbot-engine-endpoints)
   - [Get Predefined Questions](#get-apichatquestions)
   - [Process Chat Query](#post-apichatmessage)
5. [Error Handling & HTTP Status Codes](#4-error-handling--http-status-codes)
6. [Security & Sanitization](#5-security--sanitization)

---

## Overview & Conventions

All successful responses return JSON with a `success: true` flag and either a `data` payload or operational confirmation.

### Standard Response Format
```json
{
  "success": true,
  "message": "Optional human-readable confirmation",
  "data": { ... },
  "meta": { ... }
}
```

---

## 1. Health Check

### `GET /api/health`
Checks server availability, uptime, and database connectivity.

#### Response `200 OK`
```json
{
  "success": true,
  "status": "ONLINE",
  "service": "DroneTV AI Support & Lead Assistant API",
  "uptimeSeconds": 142,
  "timestamp": "2026-10-06T15:35:43.601Z",
  "database": {
    "connected": true,
    "type": "MongoDB",
    "uri": "mongodb://127.0.0.1:27017/dronetv_db"
  }
}
```

---

## 2. Enquiries CRUD Endpoints

### `GET /api/enquiries`
Retrieves a paginated list of enquiries with real-time search and multi-criteria filtering.

#### Query Parameters:
| Parameter | Type | Default | Description |
|---|---|---|---|
| `search` | String | `""` | Search query matching `name`, `email`, `phone`, `interest`, or `message` |
| `userType` | String | `"All"` | Filter by: `Student`, `Customer`, `Other`, or `All` |
| `status` | String | `"All"` | Filter by: `New`, `Contacted`, `In Progress`, `Closed`, or `All` |
| `page` | Integer | `1` | Page number |
| `limit` | Integer | `10` | Number of records per page (max 100) |
| `sortBy` | String | `"createdAt"` | Sort field (`createdAt`, `name`, `status`) |
| `sortOrder`| String | `"desc"` | Sort direction: `asc` or `desc` |

#### Example Request:
```bash
curl -X GET "http://localhost:5000/api/enquiries?status=New&userType=Student&limit=5"
```

#### Response `200 OK`:
```json
{
  "success": true,
  "data": [
    {
      "_id": "66f50001a1b2c3d4e5f60001",
      "name": "Aarav Sharma",
      "email": "aarav.sharma@example.com",
      "phone": "+91 98765 43210",
      "userType": "Student",
      "interest": "DGCA Certified Remote Pilot Training",
      "message": "Final-year student inquiring about upcoming pilot batch timings.",
      "status": "New",
      "adminNotes": "",
      "createdAt": "2026-10-04T10:15:00.000Z",
      "updatedAt": "2026-10-04T10:15:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "totalPages": 1,
    "limit": 5
  }
}
```

---

### `GET /api/enquiries/:id`
Retrieves a single enquiry by its unique identifier.

#### Example Request:
```bash
curl -X GET "http://localhost:5000/api/enquiries/66f50001a1b2c3d4e5f60001"
```

#### Response `200 OK`:
```json
{
  "success": true,
  "data": {
    "_id": "66f50001a1b2c3d4e5f60001",
    "name": "Aarav Sharma",
    "email": "aarav.sharma@example.com",
    "phone": "+91 98765 43210",
    "userType": "Student",
    "interest": "DGCA Certified Remote Pilot Training",
    "message": "Final-year student inquiring about upcoming pilot batch timings.",
    "status": "New",
    "adminNotes": "",
    "createdAt": "2026-10-04T10:15:00.000Z",
    "updatedAt": "2026-10-04T10:15:00.000Z"
  }
}
```

#### Error Response `404 Not Found`:
```json
{
  "success": false,
  "message": "Enquiry with ID 'non_existent_id' was not found."
}
```

---

### `POST /api/enquiries`
Creates a new lead enquiry from the contact form or chatbot interface.

#### Request Body:
```json
{
  "name": "Priyanshu Pundir",
  "email": "priyanshu@example.com",
  "phone": "+91 98765 43210",
  "userType": "Student",
  "interest": "DGCA Certified Remote Pilot Training",
  "message": "Looking to enroll in the DGCA certified small category drone pilot batch."
}
```

#### Validation Rules:
- `name`: String, required, 2–100 characters.
- `email`: String, required, valid email RFC 5322 regex format.
- `phone`: String, required, 7–15 digits format (`+91...`).
- `userType`: Enum (`Student`, `Customer`, `Other`).
- `interest`: String, required, max 150 characters.
- `message`: String, required, 5–2000 characters.

#### Response `201 Created`:
```json
{
  "success": true,
  "message": "Enquiry submitted successfully! Our DroneTV representative will contact you soon.",
  "data": {
    "_id": "66f50007a1b2c3d4e5f60007",
    "name": "Priyanshu Pundir",
    "email": "priyanshu@example.com",
    "phone": "+91 98765 43210",
    "userType": "Student",
    "interest": "DGCA Certified Remote Pilot Training",
    "message": "Looking to enroll in the DGCA certified small category drone pilot batch.",
    "status": "New",
    "adminNotes": "",
    "createdAt": "2026-10-06T15:30:00.000Z",
    "updatedAt": "2026-10-06T15:30:00.000Z"
  }
}
```

#### Error Response `400 Bad Request` (Validation Failed):
```json
{
  "success": false,
  "message": "Validation failed. Please correct the highlighted errors.",
  "errors": {
    "email": "Please provide a valid email address (e.g., pilot@dronetv.in).",
    "phone": "Please provide a valid contact number (7 to 15 digits)."
  }
}
```

---

### `PATCH /api/enquiries/:id` / `PUT /api/enquiries/:id`
Updates an existing enquiry's status or operational notes.

#### Request Body:
```json
{
  "status": "In Progress",
  "adminNotes": "Spoke with candidate. Shared weekend batch schedule and fee structure."
}
```

#### Permitted Status Values:
- `New`
- `Contacted`
- `In Progress`
- `Closed`

#### Response `200 OK`:
```json
{
  "success": true,
  "message": "Enquiry updated successfully.",
  "data": {
    "_id": "66f50001a1b2c3d4e5f60001",
    "status": "In Progress",
    "adminNotes": "Spoke with candidate. Shared weekend batch schedule and fee structure.",
    "updatedAt": "2026-10-06T15:35:10.000Z"
  }
}
```

---

### `DELETE /api/enquiries/:id`
Permanently deletes an enquiry record from the database.

#### Example Request:
```bash
curl -X DELETE "http://localhost:5000/api/enquiries/66f50001a1b2c3d4e5f60001"
```

#### Response `200 OK`:
```json
{
  "success": true,
  "message": "Enquiry removed successfully.",
  "deletedId": "66f50001a1b2c3d4e5f60001"
}
```

---

### `GET /api/enquiries/stats/summary`
Returns aggregated analytical metrics for the Admin Dashboard KPI counters.

#### Response `200 OK`:
```json
{
  "success": true,
  "data": {
    "total": 6,
    "byStatus": {
      "new": 2,
      "contacted": 2,
      "inProgress": 1,
      "closed": 1
    },
    "byUserType": {
      "student": 2,
      "customer": 3,
      "other": 1
    },
    "recentCountLast7Days": 5
  }
}
```

---

## 3. Chatbot Engine Endpoints

### `GET /api/chat/questions`
Returns the predefined quick-action questions supported by the rule-based assistant.

#### Response `200 OK`:
```json
{
  "success": true,
  "data": [
    { "id": "services", "question": "What services does DroneTV provide?" },
    { "id": "courses", "question": "What courses / training are available?" },
    { "id": "contact", "question": "How can I contact DroneTV?" },
    { "id": "register", "question": "How can I register?" },
    { "id": "interested_service", "question": "I am interested in a service." },
    { "id": "student", "question": "I am a student." },
    { "id": "speak_someone", "question": "I want to speak with someone." }
  ]
}
```

---

### `POST /api/chat/message`
Processes incoming user questions, performs pattern matching and intent classification, and generates structured replies with suggestions.

#### Request Body:
```json
{
  "message": "What services does DroneTV provide?"
}
```

#### Response `200 OK`:
```json
{
  "success": true,
  "data": {
    "userMessage": "What services does DroneTV provide?",
    "reply": "🛸 **DroneTV provides enterprise-grade aerial solutions across India:**\n\n1. **Aerial Cinematography & Live Broadcast:** 4K/8K aerial filming...\n2. **LiDAR & Topographical Surveying**...",
    "matchedRule": "services",
    "suggestions": [
      "I am interested in a service.",
      "How can I contact DroneTV?",
      "What courses / training are available?"
    ],
    "actions": [
      { "label": "Explore Services", "actionType": "navigate", "payload": "#services" },
      { "label": "Request Service Quote", "actionType": "open_enquiry", "payload": "service" }
    ],
    "timestamp": "2026-10-06T15:36:57.543Z"
  }
}
```

---

## 4. Error Handling & HTTP Status Codes

The API employs standard HTTP status codes:
- `200 OK`: Request succeeded.
- `201 Created`: Resource created.
- `400 Bad Request`: Input validation failed (returns field-specific errors).
- `401 Unauthorized`: Missing or invalid admin authentication token when protected access is requested.
- `404 Not Found`: Resource or enquiry ID not found.
- `429 Too Many Requests`: Rate limiter triggered (max 250 requests per 15 min per IP).
- `500 Internal Server Error`: Server error (technical stack details sanitized).

---

## 5. Security & Authentication

1. **Helmet:** Enforces secure HTTP response headers (`X-Content-Type-Options`, `X-Frame-Options`, etc.).
2. **CORS:** Restricts cross-origin requests to configured trusted origins.
3. **Input Sanitization:** Strips HTML/script tags from user inputs to prevent stored XSS.
4. **Rate Limiting:** Prevents brute force and denial-of-service spamming.
5. **Zero Secrets in Code:** Environment configuration managed via `.env`.
6. **Administrator Authentication (Optional/Enforceable):**
   - Endpoints support Bearer token authentication via the `Authorization: Bearer <token>` header or `x-admin-token` header.
   - Default Demo Token: `dronetv_admin_session_auth_key_2026`
   - Evaluation Mode: When no token is passed, standard evaluative queries execute seamlessly. When an invalid token is provided, requests are securely rejected with `401 Unauthorized`. To strictly require authentication on all admin endpoints, set `REQUIRE_ADMIN_AUTH=true` in `.env`.

