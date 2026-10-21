# MERN Stack Portfolio & Content Management System

A full-stack web application featuring an interactive personal developer portfolio and a secure, dynamic Admin Content Management System (CMS). Built with **MongoDB**, **Express.js**, **React 19**, and **Node.js**, with **Vite** for the frontend tooling.

The project is architected into two core experiences:
1. **Public Portfolio:** A responsive, dark-mode-first showcase of projects, technical skills, professional experience, education, certifications, and a working contact form.
2. **Admin Panel:** A protected management dashboard that allows the owner to update portfolio content, upload media and resumes, manage site settings, and review client messages without touching the source code.

---

## ✨ Features

### 1. Public Portfolio
- **Modern UI & Theming:** Dark and Light mode support with persistent state in `localStorage` and a responsive glassmorphic layout.
- **Hero & Profile:** Personal introduction, dynamic headline, call-to-action buttons, social profile links, and direct resume download.
- **Projects Showcase:** Interactive project cards with technology tags, live demo links, source code links, and a modal for detailed views with keyboard navigation (`Esc` to close).
- **Skills & Experience:** Categorized technical skills and an interactive chronological timeline of work experience.
- **Education & Certifications:** Structured presentation of degrees, academic institutions, grades, and credentials.
- **Interactive Contact Form:** Client-side validation, server-side sanitization, request rate limiting, submission success feedback (confetti), and automated notifications via email and Telegram.
- **Navigation & Ergonomics:** Sticky navbar with active section scroll-spy, smooth scrolling, and a floating scroll-to-top button.

### 2. Admin Panel (`/admin`)
- **Authentication & Security:** Protected routes using JWT (JSON Web Tokens), hashed password verification with `bcryptjs`, and session validation (`/admin/login`).
- **Dashboard Overview:** Quick statistics and navigation to content management modules.
- **Dynamic Content CMS:** Full CRUD capabilities to update:
  - Hero & Profile details (name, title, bio, contact details)
  - About section paragraphs and highlights
  - Work Experience entries
  - Technical Skills by category
  - Projects with descriptions, tags, and links
  - Education and Certification records
  - Social media and contact links
- **Media & Resume Management:** Direct image and PDF resume upload powered by `multer` with immediate public site updates.
- **Message Center:** Dedicated inbox to view incoming contact inquiries (sender name, email, subject, timestamp, and message body).

---

## 🛠️ Technologies Used

### Frontend
- **Library:** [React 19](https://react.dev/)
- **Routing:** [React Router DOM v7](https://reactrouter.com/)
- **Build Tool:** [Vite](https://vite.dev/)
- **Styling:** Vanilla CSS3 (Custom design system with CSS custom properties, responsive flexbox/grid, and animations)
- **Icons & UI Utilities:** [Lucide React](https://lucide.dev/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Linter:** [Oxlint](https://oxc.rs/)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) (ODM)
- **Authentication:** [JSON Web Token (jsonwebtoken)](https://jwt.io/), [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- **File Uploads:** [Multer](https://github.com/expressjs/multer)
- **Security:** [Helmet](https://helmetjs.github.io/), [CORS](https://www.npmjs.com/package/cors), [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
- **Notifications:** [Nodemailer](https://nodemailer.com/) (SMTP email notifications), Telegram Bot API
- **Logging & Config:** [Morgan](https://www.npmjs.com/package/morgan), [Dotenv](https://www.npmjs.com/package/dotenv)

---

## 📁 Project Structure

```
Portfolio/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection and environment loader
│   │   ├── controllers/     # Request handlers for auth, public data, modules, and messages
│   │   ├── middleware/      # JWT auth, rate limiter, validation, error handler, multer upload
│   │   ├── models/          # Mongoose schemas (Admin, Project, Skill, Experience, Message, etc.)
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Email (Nodemailer) and Telegram dispatch services
│   │   ├── utils/           # Admin credential reset and seed utilities
│   │   ├── app.js           # Express app setup and middleware pipeline
│   │   └── server.js        # Server listener and MongoDB connection handler
│   ├── uploads/             # Server-side storage for images and resumes
│   ├── .env.example         # Backend environment variables template
│   └── package.json
├── frontend/
│   ├── public/              # Static public assets, templates, and icons
│   ├── src/
│   │   ├── admin/           # Admin CMS pages, dashboard, components, and auth guard
│   │   ├── components/      # Shared UI components (Navbar, Modal, ThemeToggle, etc.)
│   │   ├── context/         # React context providers (PortfolioContext, AdminAuthContext)
│   │   ├── hooks/           # Custom React hooks (useTheme, useScrollSpy, useScrollReveal)
│   │   ├── pages/           # Public portfolio entry and admin routing
│   │   ├── sections/        # Public portfolio sections (Hero, About, Projects, Contact, etc.)
│   │   ├── services/        # Fetch API client for backend communication
│   │   ├── styles/          # Design tokens, variables, animations, and global CSS
│   │   ├── App.jsx          # Top-level routing
│   │   └── main.jsx         # React application entry
│   ├── .env.example         # Frontend environment variables template
│   ├── index.html           # HTML shell and metadata
│   ├── vite.config.js       # Vite configuration
│   └── package.json
├── .gitignore
├── package.json             # Root workspace script runner
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
Create a `.env` file inside the `backend/` directory based on `backend/.env.example`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/portfolio_db

# Admin Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_secure_admin_password

# Email Notifications (Optional - Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
CONTACT_EMAIL=your_notification_recipient@example.com

# Telegram Notifications (Optional)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

### Frontend (`frontend/.env`)
Create a `.env` file inside the `frontend/` directory based on `frontend/.env.example`:

```env
# Backend API URL (leave empty to use Vite proxy, or set full backend URL)
VITE_API_BASE_URL=http://localhost:5000

# Application Metadata
VITE_APP_TITLE=Momin Mahmmadbhai | Full-Stack Developer
VITE_APP_ENV=development
VITE_PORT=5173
```

---

## 🚀 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (Local community edition or MongoDB Atlas connection string)

### 1. Clone the Repository
```bash
git clone https://github.com/mhd-coder-10/Mhd_Portfolio.git
cd Mhd_Portfolio
```

### 2. Install Dependencies
Install dependencies across the root, backend, and frontend with a single command:
```bash
npm run install:all
```

*(Alternatively, run `npm install` inside the root, `backend/`, and `frontend/` directories individually).*

### 3. Initialize or Reset Admin Account (Optional)
To create or reset the admin user using the credentials defined in `backend/.env`:
```bash
npm run reset-admin --prefix backend
```

---

## 💻 Commands to Run the Project

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs backend (`node --watch`) and frontend (`vite`) concurrently. |
| `npm run dev:backend` | Starts only the backend server in watch mode. |
| `npm run dev:frontend` | Starts only the frontend Vite development server. |
| `npm run host` | Starts the frontend dev server exposed to the local network (`vite --host`). |
| `npm run build` | Builds the frontend for production into `frontend/dist`. |
| `npm start` | Starts the production backend server (`node src/server.js`). |

### Default Local URLs
- **Public Portfolio:** `http://localhost:5173`
- **Admin Panel Login:** `http://localhost:5173/admin/login`
- **Backend API:** `http://localhost:5000/api`
- **API Health Check:** `http://localhost:5000/api/health`
