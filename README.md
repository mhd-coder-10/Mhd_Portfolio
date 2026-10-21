# Momin Mahmmadbai — Full-Stack Developer Portfolio (MERN)

A modern, production-grade personal portfolio website built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). Designed with a premium dark-first aesthetic, responsive layouts, subtle animations, centralized configurations, and an MVC backend with MongoDB persistence for contact inquiries.

---

## 🚀 Technology Stack

### Frontend
- **React.js** (Plain JavaScript ES6+, JSX, React Hooks)
- **CSS3 & Custom Design System** (CSS Variables, Glassmorphism, Responsive Grid/Flexbox)
- **Vite** (Next-generation lightning-fast frontend tooling)
- **Lucide Icons** & Custom SVG Icons
- **Canvas-Confetti** (Submission celebration feedback)

### Backend
- **Node.js** (Asynchronous event-driven runtime)
- **Express.js** (Modular MVC RESTful API framework)
- **MongoDB & Mongoose** (Document database with schema validation & timestamps)
- **Security Middleware**:
  - `helmet` (HTTP security headers)
  - `cors` (Cross-Origin Resource Sharing whitelist)
  - `express-rate-limit` (Anti-spam protection for contact submissions)
  - `nodemailer` (Configurable automated email notifications with graceful fallback)

---

## 📁 Repository Structure

```
Portfolio/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                 # Mongoose connection & connection events
│   │   │   └── env.js                # Sanitized environment variable configuration
│   │   ├── controllers/
│   │   │   ├── contact.controller.js # Contact submission & count endpoints
│   │   │   └── health.controller.js  # System status & database health
│   │   ├── middleware/
│   │   │   ├── errorHandler.js       # Centralized JSON error responder
│   │   │   ├── rateLimiter.js        # IP rate limiting (5 req / 15 min)
│   │   │   └── validateContact.js    # Strict request body sanitization
│   │   ├── models/
│   │   │   └── contact.model.js      # Mongoose Contact model schema
│   │   ├── routes/
│   │   │   ├── contact.routes.js     # /api/v1/contact routes
│   │   │   ├── health.routes.js      # /api/health route
│   │   │   └── index.js              # Aggregated master API router
│   │   ├── services/
│   │   │   └── email.service.js      # Nodemailer service with safe credentials check
│   │   ├── app.js                    # Express app configuration
│   │   └── server.js                 # HTTP server listener & graceful shutdown
│   ├── .env
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── assets/
│   │   │   └── resume/
│   │   │       └── Momin-Mahmmadbai-Resume.pdf  # Downloadable resume PDF
│   │   ├── favicon.svg
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   ├── src/
│   │   ├── components/
│   │   │   ├── BackgroundMesh.jsx    # Subtle animated glowing mesh & grid
│   │   │   ├── Navbar.jsx            # Desktop & mobile drawer navigation
│   │   │   ├── ProjectModal.jsx      # Accessible keyboard-controlled modal
│   │   │   ├── ScrollToTop.jsx       # Floating scroll-to-top button
│   │   │   ├── SectionHeader.jsx     # Reusable section heading component
│   │   │   ├── SocialIcons.jsx       # Custom SVG icons
│   │   │   └── ThemeToggle.jsx       # Dark / Light theme switcher
│   │   ├── sections/
│   │   │   ├── Hero.jsx              # Hero entrance, headline, CTAs, social links
│   │   │   ├── About.jsx             # Bio, education credentials, core pillars
│   │   │   ├── Experience.jsx        # Animated vertical timeline
│   │   │   ├── Skills.jsx            # Categorized skills grid (no fake percentages)
│   │   │   ├── Approach.jsx          # "What I Build / Development Approach"
│   │   │   ├── Projects.jsx          # Featured project cards
│   │   │   ├── Workflow.jsx          # AI-assisted & QA developer workflow
│   │   │   ├── Education.jsx         # MCA GTU (8.45 CPI) & Languages
│   │   │   ├── Certification.jsx     # Apna College Full-Stack Certification
│   │   │   ├── Contact.jsx           # Controlled form + direct WhatsApp/Phone/Email
│   │   │   └── Footer.jsx            # Quick links, social profiles, status
│   │   ├── config/
│   │   │   ├── portfolioData.js      # Single source of truth for portfolio content
│   │   │   └── socialLinks.js        # Centralized social links & WhatsApp numbers
│   │   ├── hooks/
│   │   │   ├── useTheme.js           # Theme state with localStorage persistence
│   │   │   └── useScrollSpy.js       # Active section detection
│   │   ├── services/
│   │   │   └── api.js                # Fetch API client for backend
│   │   ├── styles/
│   │   │   ├── variables.css         # Dark & light color tokens, surfaces, glows
│   │   │   ├── animations.css        # Keyframes, hover micro-interactions
│   │   │   └── index.css             # Resets, typography, utilities
│   │   ├── App.jsx                   # Main layout container
│   │   └── main.jsx                  # React DOM entry
│   ├── index.html                    # SEO tags, OpenGraph, Google Fonts
│   ├── vite.config.js                # Vite configuration with API proxy
│   └── package.json
├── .gitignore
├── package.json                      # Workspace root scripts (concurrent dev)
└── README.md
```

---

## 🛠️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer; tested on v24)
- [npm](https://www.npmjs.com/) (v9 or newer)
- [MongoDB](https://www.mongodb.com/) (Community Server running locally on port 27017 or a MongoDB Atlas URI)

### 1. Clone & Install Dependencies
Run the following from the project root:

```bash
# Install all root, backend, and frontend packages with one command:
npm run install:all
```

Or install individually:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
Create `backend/.env` using `backend/.env.example` as reference:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/portfolio_db
CLIENT_URL=http://localhost:5173

# Optional Email Notification Configuration (e.g. Gmail App Password)
# If left blank, contact submissions are still stored in MongoDB without errors.
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=
CONTACT_EMAIL=mhd.developer10@gmail.com
```

### Frontend (`frontend/.env`) [Optional for production]
```env
VITE_API_BASE_URL=
```
*(In local development, requests to `/api/*` are automatically proxied to `http://localhost:5000` via Vite).*

---

## 🏃 Running the Application

### Option A: Run Both Together (Recommended)
From the project root:
```bash
npm run dev
```
This runs both the Express API (`http://localhost:5000`) and the Vite React frontend (`http://localhost:5173`) concurrently.

### Option B: Run Separately
```bash
# Terminal 1 - Backend Server:
cd backend
npm run dev

# Terminal 2 - Frontend Development Server:
cd frontend
npm run dev
```

Visit the website in your browser at:
👉 **`http://localhost:5173`**

---

## 📡 REST API Documentation

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Description**: Returns API uptime, timestamp, and MongoDB connection status.
- **Sample Response**:
  ```json
  {
    "success": true,
    "status": "healthy",
    "message": "Momin Mahmmadbai Portfolio API is operational",
    "timestamp": "2026-09-21T17:41:52.928Z",
    "uptime": 124.5,
    "database": {
      "status": "connected"
    }
  }
  ```

### 2. Submit Contact Form
- **Endpoint**: `POST /api/v1/contact` (also aliased to `POST /api/contact`)
- **Rate Limit**: Maximum 5 submissions per 15 minutes per IP address.
- **Payload**:
  ```json
  {
    "name": "Alex Vance",
    "email": "alex@example.com",
    "phone": "+91 9316515672",
    "subject": "Full-Stack Opportunity Inquiry",
    "message": "Hi Momin, we reviewed your projects and would love to discuss a developer position."
  }
  ```
- **Validation Rules**:
  - `name`: String, 2 to 100 characters (Required)
  - `email`: Valid email format, max 150 characters (Required)
  - `phone`: String, max 25 characters (Optional)
  - `subject`: String, 3 to 200 characters (Required)
  - `message`: String, 10 to 3000 characters (Required)
- **Sample Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Thank you for reaching out! Your message has been received successfully. I will get back to you shortly.",
    "data": {
      "id": "673f8b0124c1f938b29f9e11",
      "createdAt": "2026-09-21T17:42:57.123Z"
    }
  }
  ```

### 3. Contact Message Status / Counter
- **Endpoint**: `GET /api/v1/contact/status`
- **Description**: Returns total message count received.

---

## 🔗 Centralized Social Profiles Configuration

To update personal profile URLs (GitHub, LinkedIn, Instagram), open:
**`frontend/src/config/socialLinks.js`**

```javascript
export const socialLinks = {
  // Add your actual URLs here:
  github: "https://github.com/your-username",
  linkedin: "https://linkedin.com/in/your-username",
  instagram: "https://instagram.com/your-username",

  // Already configured:
  email: "mailto:mhd.developer10@gmail.com",
  phone: "tel:9316515672",
  whatsapp: "https://wa.me/919316515672?text=..."
};
```

---

## 📄 Downloadable Resume

The resume file is located at:
**`frontend/public/assets/resume/Momin-Mahmmadbai-Resume.pdf`**

You can replace this starter PDF at any time with your updated resume without modifying any frontend code.

---

## 🚢 Deployment Guide

### Frontend Deployment (Vercel / Netlify)
1. Set the root directory to `frontend`.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend-service.onrender.com`

### Backend Deployment (Render / Railway / Heroku)
1. Set root directory to `backend`.
2. Build command: `npm install`
3. Start command: `node src/server.js`
4. Set Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or dynamically assigned)
   - `MONGODB_URI`: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/portfolio_db`
   - `CLIENT_URL`: `https://your-frontend.vercel.app`
   - `EMAIL_USER`: `your-email@gmail.com`
   - `EMAIL_PASSWORD`: `your-app-password`
