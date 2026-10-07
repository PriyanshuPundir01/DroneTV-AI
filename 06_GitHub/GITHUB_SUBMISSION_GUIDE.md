# 🐙 GitHub Submission & Push Guide

This guide details how to publish this project to GitHub as required by Part 9 of the assignment.

- **Required Repository Name:** `FullStack_Chatbot_Task_Priyanshu_Pundir`
- **Visibility:** Public (or Private with access shared to evaluators)

---

## 🚀 Step-by-Step Push Instructions

### 1. Create the GitHub Repository
1. Log in to [GitHub](https://github.com/).
2. Click **New Repository** (`+` icon at top right).
3. Name the repository: `FullStack_Chatbot_Task_Priyanshu_Pundir`
4. Description: `Full Stack DroneTV AI Support & Lead Assistant Web Application for IPAGE Group Internship`
5. Set visibility to **Public**.
6. Do **NOT** initialize with a README, .gitignore, or license (we already have complete ones).
7. Click **Create repository**.

---

### 2. Initialize Git & Push Code from Terminal
Open PowerShell in the project directory:

```powershell
# Navigate to the project root
cd "C:\Users\PRIYANSHU\OneDrive\Desktop\New folder\FullStack_Chatbot_Task_Priyanshu_Pundir"

# Initialize local git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: complete DroneTV Full Stack AI Support and Lead Assistant implementation"

# Set default branch to main
git branch -M main

# Link remote repository (replace with your personal GitHub username)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/FullStack_Chatbot_Task_Priyanshu_Pundir.git

# Push to GitHub
git push -u origin main
```

---

### 3. Record the Repository Link
After pushing, paste your repository URL into:
- [`06_GitHub/REPO_LINK.txt`](file:///06_GitHub/REPO_LINK.txt)
- Main `README.md`

---

## 🔒 Security Verification Checklist Before Push
- [x] No plaintext passwords or database credentials in code.
- [x] Backend `.env.example` provided for safe environment duplication.
- [x] `.gitignore` configured to ignore `node_modules/`, `dist/`, and local `.env`.
- [x] Input sanitization middleware active against XSS attacks.
