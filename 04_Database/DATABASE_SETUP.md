# 🗄️ DroneTV Lead Assistant — Database Setup Guide

This project supports **MongoDB** (via Mongoose) as the primary document database, includes standard schemas for **SQL (PostgreSQL/MySQL)**, and features an **automatic zero-setup fallback persistent datastore** so evaluators can run and test the complete application immediately without local database installation friction.

---

## 1. Quick Zero-Config Evaluation (No DB Installation Needed)

By default, if no active MongoDB server is detected at runtime:
1. The backend automatically switches to the persistent JSON datastore located at `backend/data/enquiries.json`.
2. Full CRUD operations (Create, Read, Update, Delete, Search, and Filtering) execute with complete persistence.
3. Seed records are pre-loaded automatically.
4. **No database daemon setup is required to evaluate!**

---

## 2. Using MongoDB (Local or MongoDB Atlas)

### Option A: Local MongoDB
1. Ensure MongoDB Community Server is installed and running:
   ```bash
   # Windows (via Service)
   net start MongoDB
   
   # Linux / macOS
   sudo systemctl start mongod
   ```
2. Set the connection string in `01_Source_Code/backend/.env`:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/dronetv_db
   ```
3. Run the seed script:
   ```bash
   cd 01_Source_Code/backend
   npm run seed
   ```

### Option B: MongoDB Atlas (Cloud)
1. Create a free M0 cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Obtain your connection string.
3. In `01_Source_Code/backend/.env`, set:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/dronetv_db?retryWrites=true&w=majority
   ```
4. Run `npm run seed`.

---

## 3. Relational Database Migration (PostgreSQL / MySQL)

For deployments using a relational database:
1. Review the SQL schema file in this directory:
   - [`schema.sql`](file:///schema.sql)
2. Run the script against your database:
   ```bash
   # PostgreSQL
   psql -U postgres -d dronetv_db -f schema.sql
   
   # MySQL
   mysql -u root -p dronetv_db < schema.sql
   ```

---

## 4. Data Dictionary

| Field | Data Type | Nullable | Validation / Constraints | Description |
|---|---|---|---|---|
| `_id` | String / ObjectId | No | Unique Primary Key | Lead identifier |
| `name` | String | No | 2–100 chars, trimmed | Full name of the prospect |
| `email` | String | No | RFC email regex, lowercase | Email address |
| `phone` | String | No | 7–20 digits format | Phone / WhatsApp number |
| `userType` | Enum | No | `Student`, `Customer`, `Other` | Prospect category |
| `interest` | String | No | Max 150 chars | Course or service chosen |
| `message` | String | No | 5–2000 chars | Enquiry details |
| `status` | Enum | No | `New`, `Contacted`, `In Progress`, `Closed` | Lifecycle state |
| `adminNotes`| String | Yes | Max 2000 chars | Internal CRM remarks |
| `createdAt` | Date/Timestamp | No | Auto ISO-8601 | Submission date |
| `updatedAt` | Date/Timestamp | No | Auto ISO-8601 | Last updated date |
