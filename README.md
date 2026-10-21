# 🚀 Momin Mahmmadbhai — Full-Stack Developer Portfolio

A modern, high-performance personal portfolio and dynamic Content Management System (CMS) built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

Designed with a sleek dark-mode-first aesthetic, fluid responsive layouts, micro-interactions, and a secure admin dashboard to manage portfolio content in real-time.

---

## ✨ Key Features

- **🎨 Modern & Responsive UI:** Fully responsive design across mobile, tablet, and desktop with customizable Dark / Light themes and glassmorphic cards.
- **⚡ Dynamic Admin CMS:** Dedicated, secure admin dashboard to create, update, and delete:
  - Projects & Featured Work
  - Tech Skills & Expertise
  - Work Experience & Education
  - Certifications & Achievements
  - Dynamic Resume upload & management
  - Social & Contact links
- **📬 Contact & Notification System:**
  - Interactive contact form with client and server-side validation.
  - Automated email notifications via Nodemailer.
  - Real-time Telegram alerts for incoming inquiries.
- **🛡️ Production-Grade Security:**
  - JWT (JSON Web Token) authentication for admin sessions.
  - Password hashing with `bcryptjs`.
  - HTTP security headers with `helmet`.
  - Strict CORS whitelist protection and request rate limiting.
- **⚡ Optimized Performance:** Vite-powered frontend for instant hot-reload and optimized production bundles.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Vanilla CSS3 (Custom Design System), Lucide Icons, Canvas Confetti |
| **Backend** | Node.js, Express.js, Mongoose, Multer, Helmet, CORS, Express Rate Limit |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT (JSON Web Tokens), Bcrypt.js |
| **Notifications** | Nodemailer (Gmail SMTP), Telegram Bot API |
| **Deployment** | Vercel (Frontend), Render (Backend), MongoDB Atlas (Database) |

---

## 🚀 Getting Started Locally

### 1. Clone the Repository
```bash
git clone https://github.com/mhd-coder-10/Mhd_Portfolio.git
cd Mhd_Portfolio
```

### 2. Install Dependencies
Install dependencies for root, backend, and frontend with a single command:
```bash
npm run install:all
```

### 3. Environment Variables Setup

Create a `.env` file in the **`backend`** directory (refer to `backend/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Optional: Email & Telegram Notifications
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

Create a `.env` file in the **`frontend`** directory (refer to `frontend/.env.example`):
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Run the Project
Start both frontend and backend concurrently:
```bash
npm run dev
```

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`
- **Admin Panel:** `http://localhost:5173/admin/login`

---

## 🚢 Deployment Overview

### Frontend on Vercel
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variable:**  
  `VITE_API_BASE_URL` = `https://your-backend.onrender.com`

### Backend on Render
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment Variables:** Set your `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, etc.

---

## 👨‍💻 Author

**Momin Mahmmadbhai**  
Full-Stack Developer (MERN Stack)

- **GitHub:** [@mhd-coder-10](https://github.com/mhd-coder-10)
- **Email:** [mhd.developer10@gmail.com](mailto:mhd.developer10@gmail.com)

---

## 📄 License
This project is licensed under the [ISC License](LICENSE).
