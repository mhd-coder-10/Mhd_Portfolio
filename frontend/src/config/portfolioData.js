/**
 * Portfolio Data Source of Truth
 * Contains verified personal details, professional history, skills, and project highlights.
 */

export const personalInfo = {
  name: 'Momin Mahmmadbhai',
  shortName: 'Mahmmadbhai',
  title: 'Full-Stack Developer (MERN)',
  headline: 'Building scalable web applications, business solutions, and secure REST APIs with modern JavaScript technologies.',
  location: 'Sidhpur, Patan, Gujarat, India',
  email: 'mhd.developer10@gmail.com',
  phone: '9316515672',
  displayPhone: '+91 93165 15672',
  status: 'Open to Opportunities',
  profileImage: '/assets/profile-momin.jpg',
  bio: `MCA Graduate and Full-Stack Developer with hands-on experience in architecting modern web applications and scalable backend systems using React.js, Node.js, Express.js, and MongoDB. Skilled in REST API design, database modeling, JWT authentication, and responsive UI engineering. Along with development, experienced in functional testing, API validation, and end-to-end workflow verification to ensure software reliability and security.`,
};

export const educationData = [
  {
    degree: 'Master of Computer Application (MCA)',
    institution: 'Gujarat Technological University (GTU)',
    duration: '2024 - 2026',
    score: 'CPI: 8.45',
    location: 'Gujarat, India',
    details: 'Specialized in Advanced Web Technologies, Software Engineering, Database Systems, and Enterprise Application Development.',
  },
];

export const languages = [
  { name: 'English', proficiency: 'Professional Working Proficiency' },
  { name: 'Hindi', proficiency: 'Full Professional / Fluent' },
  { name: 'Gujarati', proficiency: 'Native / Bilingual' },
];

export const certificationData = {
  title: 'Full-Stack Web Development Course',
  institution: 'Apna College',
  description: 'Comprehensive curriculum covering end-to-end web engineering, React.js UI systems, Node.js & Express server architectures, MongoDB data modeling, and production project workflows.',
  skillsCovered: ['HTML5 & CSS3', 'JavaScript ES6+', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
};

export const experiences = [
  {
    id: 'inspire-software',
    company: 'Inspire Software Co.',
    role: 'MERN Stack Developer',
    duration: 'July 2026 - Present',
    type: 'Current Position',
    location: 'India',
    description: 'Developing custom business management software and client-tailored web solutions that transform real-world business workflows into robust software features.',
    responsibilities: [
      'Architect and develop custom business management software tailored to specific operational requirements.',
      'Transform complex business logic and manual workflows into automated, scalable software features.',
      'Implement responsive user interfaces in React.js and connect them to Express RESTful endpoints.',
      'Design and manage MongoDB database schemas, ensuring data integrity and query efficiency.',
      'Execute continuous functional testing, API contract validation, and rigorous debugging across application modules.',
    ],
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Git', 'Software Testing'],
  },
  {
    id: 'scuben-techlabs',
    company: 'ScubeN Techlabs Inc.',
    role: 'MERN Stack Developer',
    duration: 'December 2025 - May 2026',
    type: 'Professional Experience',
    location: 'India',
    description: 'Engineered SaaS, CRM, and enterprise business solutions with high emphasis on scalable API architectures, authentication, and role-based permissions.',
    responsibilities: [
      'Engineered core modules for SaaS and CRM systems using React.js, Node.js, Express.js, and MongoDB.',
      'Designed scalable RESTful APIs with structured request/response cycles and centralized error handling.',
      'Implemented secure JWT authentication systems paired with Role-Based Access Control (RBAC).',
      'Constructed modular, responsive user interface components adhering to clean UI/UX standards.',
      'Conducted functional testing, bug verification, workflow validation, and deployment preparation.',
    ],
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT Auth', 'RBAC', 'RESTful APIs', 'Postman'],
  },
];

export const skillCategories = [
  {
    title: 'Programming Languages',
    icon: 'Code2',
    skills: [
      { name: 'JavaScript (ES6+)', level: 'Advanced', desc: 'ES6+ features, Async/Await, Closures, DOM manipulation, Event loop' },
      { name: 'TypeScript', level: 'Proficient', desc: 'Static typing, interfaces, generics, type-safe fullstack contracts' },
      { name: 'HTML5', level: 'Proficient', desc: 'Semantic structure, accessibility, modern web markup' },
      { name: 'CSS3', level: 'Proficient', desc: 'Flexbox, Grid, custom animations, media queries, CSS variables' },
    ],
  },
  {
    title: 'Frontend Development',
    icon: 'Layout',
    skills: [
      { name: 'React.js', level: 'Core Competency', desc: 'Component hierarchy, Hooks, Virtual DOM, SPA architecture' },
      { name: 'Tailwind CSS', level: 'Proficient', desc: 'Utility-first rapid responsive styling and modern design systems' },
      { name: 'Bootstrap', level: 'Proficient', desc: 'Responsive grid systems, flex utilities, UI components' },
      { name: 'Responsive Web Design', level: 'Core', desc: 'Mobile-first fluid layouts, cross-browser compatibility across viewports' },
    ],
  },
  {
    title: 'Backend & Real-Time',
    icon: 'Server',
    skills: [
      { name: 'Node.js', level: 'Core Competency', desc: 'Event-driven asynchronous runtime, modular backend architecture' },
      { name: 'Express.js', level: 'Core Competency', desc: 'RESTful API routing, middleware pipelines, controllers, error handlers' },
      { name: 'WebRTC (P2P Audio/Video)', level: 'Advanced', desc: 'Low-latency P2P audio/video streaming, peer connections, media tracks' },
      { name: 'Socket.io (WebSockets)', level: 'Advanced', desc: 'Bi-directional real-time communication, rooms, signaling backed by Redis' },
      { name: 'RESTful APIs', level: 'Core Competency', desc: 'Resource design, HTTP status codes, structured JSON request/response' },
    ],
  },
  {
    title: 'Databases & Caching',
    icon: 'Database',
    skills: [
      { name: 'MongoDB', level: 'Core Competency', desc: 'Document database modeling, indexing, aggregation pipelines, MongoDB Atlas' },
      { name: 'Mongoose ODM', level: 'Core Competency', desc: 'Schema modeling, validations, middleware hooks, population' },
      { name: 'Redis (In-Memory Cache & Pub/Sub)', level: 'Advanced', desc: 'High-speed caching, session storage, Pub/Sub messaging for real-time signaling' },
      { name: 'MySQL', level: 'Proficient', desc: 'Relational database design, normalized schemas, SQL queries and joins' },
    ],
  },
  {
    title: 'State Management',
    icon: 'Share2',
    skills: [
      { name: 'Redux Toolkit', level: 'Advanced', desc: 'Predictable global store, createSlice, async thunks, RTK Query' },
      { name: 'Zustand', level: 'Proficient', desc: 'Lightweight reactive state management, simple hooks, minimal boilerplate' },
      { name: 'React Context API', level: 'Proficient', desc: 'Centralized state distribution for auth, themes, and global modals' },
    ],
  },
  {
    title: 'AI & Cloud Services',
    icon: 'Sparkles',
    skills: [
      { name: 'Google Gemini API', level: 'Advanced', desc: 'Gemini Flash integration, prompt engineering, speech-to-text transcripts, AI analysis' },
      { name: 'Cloudinary (Media Storage)', level: 'Proficient', desc: 'Cloud asset management, video/audio recordings, media upload pipelines' },
      { name: 'Vercel', level: 'Proficient', desc: 'Edge deployment, continuous integration, frontend cloud hosting' },
      { name: 'Render', level: 'Proficient', desc: 'Node.js web service deployment, background workers, environment management' },
    ],
  },
  {
    title: 'DevOps & Observability',
    icon: 'Cloud',
    skills: [
      { name: 'Docker', level: 'Proficient', desc: 'Containerization, multi-stage Dockerfiles, Docker Compose service orchestration' },
      { name: 'Kubernetes (HPA)', level: 'Proficient', desc: 'K8s cluster deployments, services, pods, Horizontal Pod Autoscaling (HPA)' },
      { name: 'Helm Charts', level: 'Proficient', desc: 'Kubernetes package management, release templating, configuration values' },
      { name: 'Prometheus', level: 'Proficient', desc: 'Metrics collection, time-series monitoring, cluster health telemetry' },
      { name: 'Grafana', level: 'Proficient', desc: 'Observability dashboards, real-time metrics visualization, alert rules' },
      { name: 'Sentry', level: 'Proficient', desc: 'Application error tracking, performance tracing, production bug diagnostics' },
    ],
  },
  {
    title: 'Testing & Security',
    icon: 'ShieldCheck',
    skills: [
      { name: 'Apache JMeter (Load Testing)', level: 'Proficient', desc: 'Performance benchmark testing, throughput load simulation, latency stress testing' },
      { name: 'OWASP', level: 'Proficient', desc: 'Security audits, Grade A+ protection, vulnerability mitigation, input sanitization' },
      { name: 'JWT Auth (RBAC)', level: 'Core Competency', desc: 'Stateless JWT tokens, role-based access control, secure authentication headers' },
      { name: 'Postman', level: 'Proficient', desc: 'API testing suites, automated test scripts, mock servers, team workspaces' },
      { name: 'Swagger', level: 'Proficient', desc: 'OpenAPI specification, interactive API documentation and endpoint testing' },
    ],
  },
  {
    title: 'Tools & Concepts',
    icon: 'Wrench',
    skills: [
      { name: 'Git', level: 'Proficient', desc: 'Version control, branch management, merge conflict resolution, rebasing' },
      { name: 'GitHub', level: 'Proficient', desc: 'Pull requests, code reviews, collaboration, CI/CD GitHub Actions' },
      { name: 'npm', level: 'Proficient', desc: 'Package dependency management, semantic versioning, npm scripts' },
      { name: 'MVC Architecture', level: 'Core Concept', desc: 'Architectural separation of Models, Views, and Controllers for maintainability' },
      { name: 'OOPs', level: 'Core Concept', desc: 'Object-Oriented Programming principles: Encapsulation, Abstraction, Inheritance, Polymorphism' },
    ],
  },
];

export const projects = [
  {
    id: 'intellmeet-ai-conferencing',
    name: 'IntellMeet – AI Video Conferencing & Workspace Platform',
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
    availabilityNote: 'Code repository and architecture demo available upon professional inquiry.',
  },
  {
    id: 'ai-interview-prep',
    name: 'AI-Powered Interview Preparation Platform',
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
    hasGithub: false,
    availabilityNote: 'Code repository and architecture demo available upon professional inquiry.',
  },
];

export const developmentApproach = [
  {
    number: '01',
    title: 'Requirements & Workflow Modeling',
    description: 'Deconstruct business needs into distinct data schemas, system states, and user journeys before writing code.',
  },
  {
    number: '02',
    title: 'Clean MVC Architecture',
    description: 'Enforce strict separation between data models, business logic controllers, and presentation layers for long-term maintainability.',
  },
  {
    number: '03',
    title: 'Secure & Validated APIs',
    description: 'Implement rigorous payload validation, JWT authentication, rate limiting, and structured error responses on every endpoint.',
  },
  {
    number: '04',
    title: 'Testing & Quality Assurance',
    description: 'Conduct functional testing, API validation with Postman, and workflow verification to eliminate bugs prior to deployment.',
  },
  {
    number: '05',
    title: 'AI-Augmented Productivity',
    description: 'Leverage modern AI tools to accelerate boilerplate generation, optimize refactoring, and maintain rapid delivery cycles.',
  },
];

export const navigationLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Approach', href: '#approach' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];
