# MERN Stack Portfolio & CMS

A full-stack personal portfolio and dynamic Content Management System (CMS) built with MongoDB, Express.js, React, and Node.js.

The project is divided into two core parts:
1. **Public Portfolio:** A modern, responsive web portfolio to showcase projects, skills, experience, and handle client inquiries.
2. **Admin Panel:** A secure dashboard to manage and update all portfolio content and view incoming messages in real-time without touching code.

---

## 🌟 Key Features

### 1. Public Portfolio
- **Modern & Responsive UI:** Dark and light theme switcher with persistent settings, fluid animations, and mobile-friendly layouts.
- **Dynamic Content:** Showcases hero profile, bio, categorized skills, work experience timeline, education, and certifications.
- **Interactive Projects:** Featured project cards with tech tags, live demo links, GitHub source links, and a full detail modal.
- **Resume Download:** Direct download of the latest resume uploaded through the admin panel.
- **Contact Form:** Interactive contact form with client validation, rate limiting, success feedback, automated email notifications, and Telegram alerts.

### 2. Admin Panel (`/admin`)
- **Secure Authentication:** Protected login using JWT authentication, encrypted passwords, and session management.
- **Full Content Management (CMS):** Add, update, or remove:
  - Hero & Profile details
  - About bio and highlights
  - Work Experience
  - Technical Skills
  - Projects
  - Education & Certifications
  - Social and Contact links
- **Media & Resume Uploads:** Upload new profile photos and PDF resumes directly from the browser.
- **Messages Inbox:** View and manage inquiries submitted through the contact form.

---

## 🛠️ Technologies Used

- **Frontend:** React 19, React Router, Vite, Vanilla CSS3 (Custom Design System), Lucide Icons, Canvas Confetti
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication & Security:** JWT (JSON Web Tokens), Bcrypt, Helmet, CORS, Express Rate Limit
- **File Uploads:** Multer (Images & PDF Resumes)
- **Notifications:** Nodemailer (Email), Telegram Bot API

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Environment Variables
- Create `.env` inside `backend/` (MongoDB URI, JWT secret, Admin email & password, Port).
- Create `.env` inside `frontend/` (Vite API base URL).
*(Check `.env.example` in both folders for reference).*

### 3. Start Application
```bash
npm run dev
```

- **Public Portfolio:** `http://localhost:5173`
- **Admin Panel:** `http://localhost:5173/admin/login`
- **Backend API:** `http://localhost:5000/api`
