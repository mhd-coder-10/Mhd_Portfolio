const Admin = require('../models/admin.model');
const Profile = require('../models/profile.model');
const Experience = require('../models/experience.model');
const Skill = require('../models/skill.model');
const Project = require('../models/project.model');
const { Education, Language } = require('../models/education.model');
const Certification = require('../models/certification.model');
const SocialLink = require('../models/socialLink.model');
const ContactSettings = require('../models/contactSettings.model');
const Settings = require('../models/settings.model');
const env = require('../config/env');

const initialPersonalInfo = {
  name: 'Momin Mahmmadbhai',
  shortName: 'Mahmmadbhai',
  title: 'Full-Stack Developer (MERN)',
  headline: 'Building scalable web applications, business solutions, and secure REST APIs with modern JavaScript technologies.',
  location: 'Sidhpur, Patan, Gujarat, India',
  email: 'mhd.developer10@gmail.com',
  phone: '9316515672',
  displayPhone: '+91 93165 15672',
  status: 'Open to Opportunities',
  bio: 'MCA Graduate and Full-Stack Developer with hands-on experience in architecting modern web applications and scalable backend systems using React.js, Node.js, Express.js, and MongoDB. Skilled in REST API design, database modeling, JWT authentication, and responsive UI engineering. Along with development, experienced in functional testing, API validation, and end-to-end workflow verification to ensure software reliability and security.',
  hero: {
    rotatingRoles: [
      'Full-Stack Developer (MERN)',
      'React.js UI & System Architect',
      'Scalable RESTful API Engineer',
      'MongoDB Data Modeling Specialist',
      'Functional Testing & QA Engineer',
    ],
    stats: {
      mcaCpi: 8.45,
      enterpriseApps: 3,
      qaReliability: 100,
      techStacks: 10,
    },
    strengths: [
      'REST APIs & Clean MVC Architecture',
      'JWT Authentication & Secure RBAC',
      'Functional Validation & QA Testing',
    ],
    badgeText: 'Available for Full-Stack Roles',
    primaryCtaText: 'View My Work',
    primaryCtaLink: '#projects',
    secondaryCtaText: 'Download Resume',
    terminalFilename: 'momin-profile.json',
  },
  about: {
    heading: 'Full-Stack Engineering with a Quality-First Mindset',
    paragraph1:
      'I am an MCA Graduate and MERN Stack Developer with hands-on experience in architecting full-lifecycle web applications. My development focus centers on developing modular React.js user interfaces, scalable Node.js/Express.js backend services, and structured MongoDB Atlas data models.',
    paragraph2:
      'Beyond standard feature development, I place strong emphasis on functional testing, API contract validation, and workflow verification. Whether securing endpoints with JWT authentication and Role-Based Access Control (RBAC) or streamlining business processes for commercial software, I ensure software is resilient, secure, and user-friendly.',
    graduationText: 'MCA (GTU) • CPI: 8.45',
    pillars: [
      {
        icon: 'Layers',
        title: 'MERN Full-Stack',
        description: 'Cohesive full-stack applications using React.js, Express, Node.js, and MongoDB with clean component hierarchy.',
        color: 'var(--accent-cyan)',
      },
      {
        icon: 'Server',
        title: 'REST API & MVC',
        description: 'Predictable, versioned REST endpoints structured with strict MVC separation, request validation, and uniform responses.',
        color: 'var(--accent-indigo)',
      },
      {
        icon: 'ShieldCheck',
        title: 'Auth & RBAC',
        description: 'Stateless JWT token authentication coupled with granular Role-Based Access Control to safeguard sensitive resources.',
        color: 'var(--accent-violet)',
      },
      {
        icon: 'CheckCircle',
        title: 'Testing & QA',
        description: 'Functional validation, Postman API contract verification, and bug tracking to ensure production stability.',
        color: 'var(--accent-emerald)',
      },
    ],
  },
};

const initialExperiences = [
  {
    company: 'Inspire Software Co.',
    role: 'MERN Stack Developer',
    duration: 'July 2026 - Present',
    type: 'Current Position',
    location: 'India',
    description:
      'Developing custom business management software and client-tailored web solutions that transform real-world business workflows into robust software features.',
    responsibilities: [
      'Architect and develop custom business management software tailored to specific operational requirements.',
      'Transform complex business logic and manual workflows into automated, scalable software features.',
      'Implement responsive user interfaces in React.js and connect them to Express RESTful endpoints.',
      'Design and manage MongoDB database schemas, ensuring data integrity and query efficiency.',
      'Execute continuous functional testing, API contract validation, and rigorous debugging across application modules.',
    ],
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Git', 'Software Testing'],
    isCurrent: true,
    isActive: true,
    displayOrder: 1,
  },
  {
    company: 'ScubeN Techlabs Inc.',
    role: 'MERN Stack Developer',
    duration: 'December 2025 - May 2026',
    type: 'Professional Experience',
    location: 'India',
    description:
      'Engineered SaaS, CRM, and enterprise business solutions with high emphasis on scalable API architectures, authentication, and role-based permissions.',
    responsibilities: [
      'Engineered core modules for SaaS and CRM systems using React.js, Node.js, Express.js, and MongoDB.',
      'Designed scalable RESTful APIs with structured request/response cycles and centralized error handling.',
      'Implemented secure JWT authentication systems paired with Role-Based Access Control (RBAC).',
      'Constructed modular, responsive user interface components adhering to clean UI/UX standards.',
      'Conducted functional testing, bug verification, workflow validation, and deployment preparation.',
    ],
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT Auth', 'RBAC', 'RESTful APIs', 'Postman'],
    isCurrent: false,
    isActive: true,
    displayOrder: 2,
  },
];

const initialSkills = [
  // 1. Programming Languages
  { name: 'JavaScript (ES6+)', category: 'Programming Languages', categoryIcon: 'Code2', level: 'Advanced', desc: 'ES6+ features, Async/Await, Closures, DOM manipulation, Event loop', displayOrder: 1, categoryOrder: 1 },
  { name: 'TypeScript', category: 'Programming Languages', categoryIcon: 'Code2', level: 'Proficient', desc: 'Static typing, interfaces, generics, type-safe fullstack contracts', displayOrder: 2, categoryOrder: 1 },
  { name: 'HTML5', category: 'Programming Languages', categoryIcon: 'Code2', level: 'Proficient', desc: 'Semantic structure, accessibility, modern web markup', displayOrder: 3, categoryOrder: 1 },
  { name: 'CSS3', category: 'Programming Languages', categoryIcon: 'Code2', level: 'Proficient', desc: 'Flexbox, Grid, custom animations, media queries, CSS variables', displayOrder: 4, categoryOrder: 1 },

  // 2. Frontend Development
  { name: 'React.js', category: 'Frontend Development', categoryIcon: 'Layout', level: 'Core Competency', desc: 'Component hierarchy, Hooks, Virtual DOM, SPA architecture', displayOrder: 1, categoryOrder: 2 },
  { name: 'Tailwind CSS', category: 'Frontend Development', categoryIcon: 'Layout', level: 'Proficient', desc: 'Utility-first rapid responsive styling and modern design systems', displayOrder: 2, categoryOrder: 2 },
  { name: 'Bootstrap', category: 'Frontend Development', categoryIcon: 'Layout', level: 'Proficient', desc: 'Responsive grid systems, flex utilities, UI components', displayOrder: 3, categoryOrder: 2 },
  { name: 'Responsive Web Design', category: 'Frontend Development', categoryIcon: 'Layout', level: 'Core', desc: 'Mobile-first fluid layouts, cross-browser compatibility across viewports', displayOrder: 4, categoryOrder: 2 },

  // 3. Backend & Real-Time
  { name: 'Node.js', category: 'Backend & Real-Time', categoryIcon: 'Server', level: 'Core Competency', desc: 'Event-driven asynchronous runtime, modular backend architecture', displayOrder: 1, categoryOrder: 3 },
  { name: 'Express.js', category: 'Backend & Real-Time', categoryIcon: 'Server', level: 'Core Competency', desc: 'RESTful API routing, middleware pipelines, controllers, error handlers', displayOrder: 2, categoryOrder: 3 },
  { name: 'WebRTC (P2P Audio/Video)', category: 'Backend & Real-Time', categoryIcon: 'Server', level: 'Advanced', desc: 'Low-latency P2P audio/video streaming, peer connections, media tracks', displayOrder: 3, categoryOrder: 3 },
  { name: 'Socket.io (WebSockets)', category: 'Backend & Real-Time', categoryIcon: 'Server', level: 'Advanced', desc: 'Bi-directional real-time communication, rooms, signaling backed by Redis', displayOrder: 4, categoryOrder: 3 },
  { name: 'RESTful APIs', category: 'Backend & Real-Time', categoryIcon: 'Server', level: 'Core Competency', desc: 'Resource design, HTTP status codes, structured JSON request/response', displayOrder: 5, categoryOrder: 3 },

  // 4. Databases & Caching
  { name: 'MongoDB', category: 'Databases & Caching', categoryIcon: 'Database', level: 'Core Competency', desc: 'Document database modeling, indexing, aggregation pipelines, MongoDB Atlas', displayOrder: 1, categoryOrder: 4 },
  { name: 'Mongoose ODM', category: 'Databases & Caching', categoryIcon: 'Database', level: 'Core Competency', desc: 'Schema modeling, validations, middleware hooks, population', displayOrder: 2, categoryOrder: 4 },
  { name: 'Redis (In-Memory Cache & Pub/Sub)', category: 'Databases & Caching', categoryIcon: 'Database', level: 'Advanced', desc: 'High-speed caching, session storage, Pub/Sub messaging for real-time signaling', displayOrder: 3, categoryOrder: 4 },
  { name: 'MySQL', category: 'Databases & Caching', categoryIcon: 'Database', level: 'Proficient', desc: 'Relational database design, normalized schemas, SQL queries and joins', displayOrder: 4, categoryOrder: 4 },

  // 5. State Management
  { name: 'Redux Toolkit', category: 'State Management', categoryIcon: 'Share2', level: 'Advanced', desc: 'Predictable global store, createSlice, async thunks, RTK Query', displayOrder: 1, categoryOrder: 5 },
  { name: 'Zustand', category: 'State Management', categoryIcon: 'Share2', level: 'Proficient', desc: 'Lightweight reactive state management, simple hooks, minimal boilerplate', displayOrder: 2, categoryOrder: 5 },
  { name: 'React Context API', category: 'State Management', categoryIcon: 'Share2', level: 'Proficient', desc: 'Centralized state distribution for auth, themes, and global modals', displayOrder: 3, categoryOrder: 5 },

  // 6. AI & Cloud Services
  { name: 'Google Gemini API', category: 'AI & Cloud Services', categoryIcon: 'Sparkles', level: 'Advanced', desc: 'Gemini Flash integration, prompt engineering, speech-to-text transcripts, AI analysis', displayOrder: 1, categoryOrder: 6 },
  { name: 'Cloudinary (Media Storage)', category: 'AI & Cloud Services', categoryIcon: 'Sparkles', level: 'Proficient', desc: 'Cloud asset management, video/audio recordings, media upload pipelines', displayOrder: 2, categoryOrder: 6 },
  { name: 'Vercel', category: 'AI & Cloud Services', categoryIcon: 'Sparkles', level: 'Proficient', desc: 'Edge deployment, continuous integration, frontend cloud hosting', displayOrder: 3, categoryOrder: 6 },
  { name: 'Render', category: 'AI & Cloud Services', categoryIcon: 'Sparkles', level: 'Proficient', desc: 'Node.js web service deployment, background workers, environment management', displayOrder: 4, categoryOrder: 6 },

  // 7. DevOps & Observability
  { name: 'Docker', category: 'DevOps & Observability', categoryIcon: 'Cloud', level: 'Proficient', desc: 'Containerization, multi-stage Dockerfiles, Docker Compose service orchestration', displayOrder: 1, categoryOrder: 7 },
  { name: 'Kubernetes (HPA)', category: 'DevOps & Observability', categoryIcon: 'Cloud', level: 'Proficient', desc: 'K8s cluster deployments, services, pods, Horizontal Pod Autoscaling (HPA)', displayOrder: 2, categoryOrder: 7 },
  { name: 'Helm Charts', category: 'DevOps & Observability', categoryIcon: 'Cloud', level: 'Proficient', desc: 'Kubernetes package management, release templating, configuration values', displayOrder: 3, categoryOrder: 7 },
  { name: 'Prometheus', category: 'DevOps & Observability', categoryIcon: 'Cloud', level: 'Proficient', desc: 'Metrics collection, time-series monitoring, cluster health telemetry', displayOrder: 4, categoryOrder: 7 },
  { name: 'Grafana', category: 'DevOps & Observability', categoryIcon: 'Cloud', level: 'Proficient', desc: 'Observability dashboards, real-time metrics visualization, alert rules', displayOrder: 5, categoryOrder: 7 },
  { name: 'Sentry', category: 'DevOps & Observability', categoryIcon: 'Cloud', level: 'Proficient', desc: 'Application error tracking, performance tracing, production bug diagnostics', displayOrder: 6, categoryOrder: 7 },

  // 8. Testing & Security
  { name: 'Apache JMeter (Load Testing)', category: 'Testing & Security', categoryIcon: 'ShieldCheck', level: 'Proficient', desc: 'Performance benchmark testing, throughput load simulation, latency stress testing', displayOrder: 1, categoryOrder: 8 },
  { name: 'OWASP', category: 'Testing & Security', categoryIcon: 'ShieldCheck', level: 'Proficient', desc: 'Security audits, Grade A+ protection, vulnerability mitigation, input sanitization', displayOrder: 2, categoryOrder: 8 },
  { name: 'JWT Auth (RBAC)', category: 'Testing & Security', categoryIcon: 'ShieldCheck', level: 'Core Competency', desc: 'Stateless JWT tokens, role-based access control, secure authentication headers', displayOrder: 3, categoryOrder: 8 },
  { name: 'Postman', category: 'Testing & Security', categoryIcon: 'ShieldCheck', level: 'Proficient', desc: 'API testing suites, automated test scripts, mock servers, team workspaces', displayOrder: 4, categoryOrder: 8 },
  { name: 'Swagger', category: 'Testing & Security', categoryIcon: 'ShieldCheck', level: 'Proficient', desc: 'OpenAPI specification, interactive API documentation and endpoint testing', displayOrder: 5, categoryOrder: 8 },

  // 9. Tools & Concepts
  { name: 'Git', category: 'Tools & Concepts', categoryIcon: 'Wrench', level: 'Proficient', desc: 'Version control, branch management, merge conflict resolution, rebasing', displayOrder: 1, categoryOrder: 9 },
  { name: 'GitHub', category: 'Tools & Concepts', categoryIcon: 'Wrench', level: 'Proficient', desc: 'Pull requests, code reviews, collaboration, CI/CD GitHub Actions', displayOrder: 2, categoryOrder: 9 },
  { name: 'npm', category: 'Tools & Concepts', categoryIcon: 'Wrench', level: 'Proficient', desc: 'Package dependency management, semantic versioning, npm scripts', displayOrder: 3, categoryOrder: 9 },
  { name: 'MVC Architecture', category: 'Tools & Concepts', categoryIcon: 'Wrench', level: 'Core Concept', desc: 'Architectural separation of Models, Views, and Controllers for maintainability', displayOrder: 4, categoryOrder: 9 },
  { name: 'OOPs', category: 'Tools & Concepts', categoryIcon: 'Wrench', level: 'Core Concept', desc: 'Object-Oriented Programming principles: Encapsulation, Abstraction, Inheritance, Polymorphism', displayOrder: 5, categoryOrder: 9 },
];

const initialProjects = [
  {
    name: 'IntellMeet – AI Video Conferencing & Workspace Platform',
    slug: 'intellmeet-ai-conferencing',
    badge: 'Real-Time WebRTC + Gemini 8.5 Flash',
    tagline: 'Low-latency WebRTC video conferencing, Redis-backed Socket.io signaling, and Gemini-powered real-time workspace intelligence.',
    overview:
      'A production-grade real-time video conferencing and intelligent workspace platform built with WebRTC, React, TypeScript, and Node.js. Features peer-to-peer audio/video streaming, Cloudinary cloud recording, Redis-backed Socket.io signaling, automated speech-to-text transcripts with Google Gemini 8.5 Flash API, and orchestrated cloud deployment using Docker and Kubernetes.',
    technologies: [
      'React',
      'TypeScript',
      'Node.js',
      'Express 5',
      'WebRTC',
      'Socket.io',
      'Google Gemini 8.5 Flash API',
      'Redis',
      'MongoDB Atlas',
      'Cloudinary',
      'Docker',
      'Kubernetes',
      'Helm',
      'Prometheus',
      'Grafana',
      'Apache JMeter',
      'OWASP',
    ],
    features: [
      'Real-Time Collaboration: Built a low-latency WebRTC video conferencing platform featuring P2P audio/video streaming, screen sharing, Cloudinary cloud recording, and Socket.io signaling backed by Redis.',
      'AI & Workspace Management: Integrated Google Gemini 8.5 Flash API for automated speech-to-text transcripts, executive summaries, and action item extraction with real-time Kanban board task synchronization.',
      'Testing & DevOps: Achieved 100% OWASP (Grade A+) security, verified high throughput with Apache JMeter load testing, and orchestrated cloud deployment using Docker, Kubernetes, Helm, and Prometheus monitoring.',
    ],
    contributions: [
      'Built low-latency WebRTC peer-to-peer audio/video streaming, screen sharing, and Cloudinary cloud recording.',
      'Architected a scalable Socket.io signaling layer backed by Redis Pub/Sub for cross-cluster real-time synchronization.',
      'Integrated Google Gemini 8.5 Flash API for automated speech-to-text transcription, executive meeting summaries, and real-time Kanban board task synchronization.',
      'Achieved 100% OWASP (Grade A+) security audit score, verified high concurrent throughput with Apache JMeter load testing, and orchestrated cloud deployment with Docker, Kubernetes (HPA), Helm, and Prometheus/Grafana monitoring.',
    ],
    category: 'Real-Time & AI Platform',
    status: 'Featured Platform',
    hasDemo: true,
    demoUrl: 'https://intelmeet-alpha.vercel.app',
    hasGithub: false,
    githubUrl: '',
    availabilityNote: 'Code repository and architecture demo available upon professional inquiry.',
    featured: true,
    isActive: true,
    displayOrder: 1,
  },
  {
    name: 'AI-Powered Interview Preparation Platform',
    slug: 'ai-interview-prep',
    badge: 'MERN Stack + Google Gemini API',
    tagline: 'AI-powered resume analysis, skill-gap assessment, personalized mock interviews, and ATS PDF generation.',
    overview:
      'An end-to-end full-stack platform built with the MERN stack and Google Gemini API for intelligent resume parsing, skill-gap assessment, dynamic interview preparation, and automated ATS-friendly PDF evaluation reports.',
    technologies: [
      'React.js',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Google Gemini API',
      'JWT Authentication',
      'RESTful APIs',
      'Axios',
      'Multer',
      'Zod',
      'PDF-Parse',
      'Puppeteer',
    ],
    features: [
      'Development: Developed a MERN-based application for AI-powered resume analysis, skill-gap assessment, and interview preparation.',
      'API & Security Integration: Built secure REST APIs, integrated Gemini API, and implemented JWT Authentication for personalized interview question generation.',
      'Testing & Report Generation: Performed functional testing, API validation, and end-to-end workflow verification while generating ATS-friendly PDF reports using Puppeteer.',
    ],
    contributions: [
      'Developed a MERN-based web application for automated resume parsing, skill-gap analysis, and tailored interview preparation.',
      'Built secure REST APIs, integrated Google Gemini API, and implemented JWT Authentication for personalized interview question generation.',
      'Performed functional testing, API validation, and end-to-end workflow verification while generating ATS-friendly PDF reports using Puppeteer.',
      'Enforced robust input validation with Zod schemas and multipart file processing with Multer and PDF-Parse.',
    ],
    category: 'Full-Stack & AI',
    status: 'Featured Platform',
    hasDemo: false,
    demoUrl: '',
    hasGithub: false,
    githubUrl: '',
    availabilityNote: 'Code repository and architecture demo available upon professional inquiry.',
    featured: true,
    isActive: true,
    displayOrder: 2,
  },
];

const initialEducation = [
  {
    degree: 'Master of Computer Application (MCA)',
    institution: 'Gujarat Technological University (GTU)',
    duration: '2024 - 2026',
    score: 'CPI: 8.45',
    location: 'Gujarat, India',
    details: 'Specialized in Advanced Web Technologies, Software Engineering, Database Systems, and Enterprise Application Development.',
    displayOrder: 1,
    isActive: true,
  },
];

const initialLanguages = [
  { name: 'English', proficiency: 'Professional Working Proficiency', displayOrder: 1 },
  { name: 'Hindi', proficiency: 'Full Professional / Fluent', displayOrder: 2 },
  { name: 'Gujarati', proficiency: 'Native / Bilingual', displayOrder: 3 },
];

const initialCertification = {
  title: 'Full-Stack Web Development Course',
  institution: 'Apna College',
  description:
    'Comprehensive curriculum covering end-to-end web engineering, React.js UI systems, Node.js & Express server architectures, MongoDB data modeling, and production project workflows.',
  skillsCovered: ['HTML5 & CSS3', 'JavaScript ES6+', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
  displayOrder: 1,
  isActive: true,
};

const initialSocialLinks = [
  {
    platform: 'github',
    label: 'GitHub',
    url: 'https://github.com/mhd-coder-10',
    username: 'mhd-coder-10',
    icon: 'Github',
    displayOrder: 1,
    isActive: true,
  },
  {
    platform: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/momin-mahmmadbhai-3b482836b/',
    username: 'momin-mahmmadbhai',
    icon: 'Linkedin',
    displayOrder: 2,
    isActive: true,
  },
  {
    platform: 'instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/mohmdd._.10/',
    username: 'mohmdd._.10',
    icon: 'Instagram',
    displayOrder: 3,
    isActive: true,
  },
  {
    platform: 'email',
    label: 'Email',
    url: 'mailto:mhd.developer10@gmail.com',
    username: 'mhd.developer10@gmail.com',
    icon: 'Mail',
    displayOrder: 4,
    isActive: true,
  },
  {
    platform: 'phone',
    label: 'Phone',
    url: 'tel:9316515672',
    username: '+91 93165 15672',
    icon: 'Phone',
    displayOrder: 5,
    isActive: true,
  },
  {
    platform: 'whatsapp',
    label: 'WhatsApp',
    url: 'https://wa.me/919316515672?text=Hello%20Mohammad%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project%20or%20professional%20opportunity.',
    username: '+91 93165 15672',
    icon: 'MessageSquare',
    displayOrder: 6,
    isActive: true,
  },
  {
    platform: 'telegram',
    label: 'Telegram',
    url: 'https://telegram.me/Mohammad_041?text=Hello%20Mohammad%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project%20or%20professional%20opportunity.',
    username: '@Mohammad_041',
    icon: 'Telegram',
    displayOrder: 7,
    isActive: true,
  },
];

const initialContactSettings = {
  whatsapp: {
    rawPhone: '9316515672',
    countryCode: '91',
    displayPhone: '+91 93165 15672',
    prefilledMessage: 'Hello Mohammad, I visited your portfolio and would like to discuss a project or professional opportunity.',
    buttonText: 'Chat on WhatsApp',
    isActive: true,
  },
  telegram: {
    username: 'Mohammad_041',
    displayLabel: '@Mohammad_041',
    profileUrl: 'https://telegram.me/Mohammad_041',
    prefilledMessage: 'Hello Mohammad, I visited your portfolio and would like to discuss a project or professional opportunity.',
    buttonText: 'Chat on Telegram',
    isActive: true,
  },
  publicEmail: 'mhd.developer10@gmail.com',
  contactEmail: 'mhd.developer10@gmail.com',
  phone: '9316515672',
  formattedPhone: '+91 93165 15672',
  location: 'Sidhpur, Patan, Gujarat, India',
};

const initialSettings = {
  seo: {
    siteTitle: 'Momin Mahmmadbhai | Full-Stack Developer (MERN)',
    metaDescription:
      'Portfolio of Momin Mahmmadbhai, a Full-Stack MERN Developer specializing in scalable web applications, secure REST APIs, MongoDB database architecture, and verified business solutions.',
    keywords:
      'Momin Mahmmadbhai, MERN Stack Developer, Full Stack Developer, React.js, Node.js, Express.js, MongoDB, REST APIs, Web Developer India',
    ogTitle: 'Momin Mahmmadbhai | Full-Stack Developer (MERN)',
    ogDescription:
      'Portfolio of Momin Mahmmadbhai, a Full-Stack MERN Developer specializing in scalable web applications, secure REST APIs, and database architecture.',
    ogImage: '/favicon.svg',
    canonicalUrl: '',
  },
  resume: {
    url: '/assets/resume/Momin-Mahmmadbhai-Resume.pdf',
    fileName: 'Momin-Mahmmadbhai-Resume.pdf',
    fileSize: '339 KB',
    isDownloadActive: true,
  },
  navigationLinks: [
    { label: 'About', href: '#about', displayOrder: 1, isActive: true },
    { label: 'Experience', href: '#experience', displayOrder: 2, isActive: true },
    { label: 'Skills', href: '#skills', displayOrder: 3, isActive: true },
    { label: 'Approach', href: '#approach', displayOrder: 4, isActive: true },
    { label: 'Projects', href: '#projects', displayOrder: 5, isActive: true },
    { label: 'Education', href: '#education', displayOrder: 6, isActive: true },
    { label: 'Contact', href: '#contact', displayOrder: 7, isActive: true },
  ],
  footer: {
    description: 'Full-Stack MERN Developer specialized in scalable web architectures, secure RESTful APIs, and rigorous QA verification.',
    statusText: 'Full-Stack Services Active & Available',
    copyrightText: 'All rights reserved.',
  },
  approachSteps: [
    {
      number: '01',
      title: 'Requirements & Workflow Modeling',
      description: 'Deconstruct business needs into distinct data schemas, system states, and user journeys before writing code.',
      displayOrder: 1,
    },
    {
      number: '02',
      title: 'Clean MVC Architecture',
      description: 'Enforce strict separation between data models, business logic controllers, and presentation layers for long-term maintainability.',
      displayOrder: 2,
    },
    {
      number: '03',
      title: 'Secure & Validated APIs',
      description: 'Implement rigorous payload validation, JWT authentication, rate limiting, and structured error responses on every endpoint.',
      displayOrder: 3,
    },
    {
      number: '04',
      title: 'Testing & Quality Assurance',
      description: 'Conduct functional testing, API validation with Postman, and workflow verification to eliminate bugs prior to deployment.',
      displayOrder: 4,
    },
    {
      number: '05',
      title: 'AI-Augmented Productivity',
      description: 'Leverage modern AI tools to accelerate boilerplate generation, optimize refactoring, and maintain rapid delivery cycles.',
      displayOrder: 5,
    },
  ],
  workflowSteps: [
    {
      icon: 'Terminal',
      title: '1. Modular Architecture & MVC',
      description: 'Structure every service with distinct separation of Concerns: Models manage Mongoose schemas, Controllers handle business logic, and Routes orchestrate security middleware.',
      accent: 'var(--accent-cyan)',
      displayOrder: 1,
    },
    {
      icon: 'Sparkles',
      title: '2. AI-Assisted Workflow Productivity',
      description: 'Leverage AI tools purposefully to accelerate component boilerplate, speed up regex modeling, and investigate edge cases while maintaining full architectural ownership.',
      accent: 'var(--accent-indigo)',
      displayOrder: 2,
    },
    {
      icon: 'Shield',
      title: '3. Rigorous API Contract Validation',
      description: 'All incoming payloads are strictly validated for types, sanitization, and length limits before hitting database transactions. Zero unhandled promise rejections.',
      accent: 'var(--accent-emerald)',
      displayOrder: 3,
    },
    {
      icon: 'CheckCircle2',
      title: '4. Functional Testing & QA Verification',
      description: 'Systematic testing of user workflows, error states, and network boundaries with Postman collections to ensure zero regressions in production environments.',
      accent: 'var(--accent-violet)',
      displayOrder: 4,
    },
  ],
};

const seedDatabase = async () => {
  try {
    // Check if initial seeding has already been performed
    const existingSettings = await Settings.findOne();
    if (existingSettings && existingSettings.isInitialSeeded) {
      console.log('[Database Seed] Database already initialized. Skipping re-seed to preserve user modifications.');
      return;
    }

    // 1. Seed Admin
    const adminExists = await Admin.findOne({ email: env.ADMIN_EMAIL.toLowerCase() });
    if (!adminExists) {
      await Admin.create({
        name: 'Momin Mahmmadbhai',
        email: env.ADMIN_EMAIL.toLowerCase(),
        password: env.ADMIN_PASSWORD,
      });
      console.log(`[Database Seed] Initial Admin account created for ${env.ADMIN_EMAIL}`);
    }

    // 2. Seed Profile
    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      await Profile.create(initialPersonalInfo);
      console.log('[Database Seed] Profile data seeded successfully.');
    }

    // 3. Seed Experiences
    const expCount = await Experience.countDocuments();
    if (expCount === 0) {
      await Experience.insertMany(initialExperiences);
      console.log('[Database Seed] Experiences seeded successfully.');
    }

    // 4. Seed Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany(initialSkills);
      console.log('[Database Seed] Skills seeded successfully.');
    }

    // 5. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany(initialProjects);
      console.log('[Database Seed] Projects seeded successfully.');
    }

    // 6. Seed Education & Languages
    const eduCount = await Education.countDocuments();
    if (eduCount === 0) {
      await Education.insertMany(initialEducation);
      console.log('[Database Seed] Education records seeded.');
    }

    const langCount = await Language.countDocuments();
    if (langCount === 0) {
      await Language.insertMany(initialLanguages);
      console.log('[Database Seed] Languages seeded.');
    }

    // 7. Seed Certification
    const certCount = await Certification.countDocuments();
    if (certCount === 0) {
      await Certification.create(initialCertification);
      console.log('[Database Seed] Certification seeded.');
    }

    // 8. Seed Social Links
    const socialCount = await SocialLink.countDocuments();
    if (socialCount === 0) {
      await SocialLink.insertMany(initialSocialLinks);
      console.log('[Database Seed] Social Links seeded.');
    }

    // 9. Seed Contact Settings
    const contactSettingsCount = await ContactSettings.countDocuments();
    if (contactSettingsCount === 0) {
      await ContactSettings.create(initialContactSettings);
      console.log('[Database Seed] Contact Settings seeded.');
    }

    // 10. Seed General Settings
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      await Settings.create({ ...initialSettings, isInitialSeeded: true });
      console.log('[Database Seed] Website & SEO Settings seeded.');
    } else {
      await Settings.updateOne({}, { $set: { isInitialSeeded: true } });
    }

    console.log('[Database Seed] Data synchronization check complete.');
  } catch (error) {
    console.error('[Database Seed Error]', error);
  }
};

module.exports = seedDatabase;
