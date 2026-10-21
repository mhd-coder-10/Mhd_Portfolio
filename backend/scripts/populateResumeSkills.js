const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const Skill = require('../src/models/skill.model');

const resumeSkills = [
  // 1. Programming Languages
  {
    name: 'JavaScript (ES6+)',
    category: 'Programming Languages',
    categoryIcon: 'Code2',
    level: 'Advanced',
    desc: 'ES6+ features, Async/Await, Closures, DOM manipulation, Event loop',
    displayOrder: 1,
    categoryOrder: 1,
    isActive: true,
  },
  {
    name: 'TypeScript',
    category: 'Programming Languages',
    categoryIcon: 'Code2',
    level: 'Proficient',
    desc: 'Static typing, interfaces, generics, type-safe fullstack contracts',
    displayOrder: 2,
    categoryOrder: 1,
    isActive: true,
  },
  {
    name: 'HTML5',
    category: 'Programming Languages',
    categoryIcon: 'Code2',
    level: 'Proficient',
    desc: 'Semantic structure, accessibility, modern web markup',
    displayOrder: 3,
    categoryOrder: 1,
    isActive: true,
  },
  {
    name: 'CSS3',
    category: 'Programming Languages',
    categoryIcon: 'Code2',
    level: 'Proficient',
    desc: 'Flexbox, Grid, custom animations, media queries, CSS variables',
    displayOrder: 4,
    categoryOrder: 1,
    isActive: true,
  },

  // 2. Frontend Development
  {
    name: 'React.js',
    category: 'Frontend Development',
    categoryIcon: 'Layout',
    level: 'Core Competency',
    desc: 'Component hierarchy, Hooks, Virtual DOM, SPA architecture',
    displayOrder: 1,
    categoryOrder: 2,
    isActive: true,
  },
  {
    name: 'Tailwind CSS',
    category: 'Frontend Development',
    categoryIcon: 'Layout',
    level: 'Proficient',
    desc: 'Utility-first rapid responsive styling and modern design systems',
    displayOrder: 2,
    categoryOrder: 2,
    isActive: true,
  },
  {
    name: 'Bootstrap',
    category: 'Frontend Development',
    categoryIcon: 'Layout',
    level: 'Proficient',
    desc: 'Responsive grid systems, flex utilities, UI components',
    displayOrder: 3,
    categoryOrder: 2,
    isActive: true,
  },
  {
    name: 'Responsive Web Design',
    category: 'Frontend Development',
    categoryIcon: 'Layout',
    level: 'Core',
    desc: 'Mobile-first fluid layouts, cross-browser compatibility across viewports',
    displayOrder: 4,
    categoryOrder: 2,
    isActive: true,
  },

  // 3. Backend & Real-Time
  {
    name: 'Node.js',
    category: 'Backend & Real-Time',
    categoryIcon: 'Server',
    level: 'Core Competency',
    desc: 'Event-driven asynchronous runtime, modular backend architecture',
    displayOrder: 1,
    categoryOrder: 3,
    isActive: true,
  },
  {
    name: 'Express.js',
    category: 'Backend & Real-Time',
    categoryIcon: 'Server',
    level: 'Core Competency',
    desc: 'RESTful API routing, middleware pipelines, controllers, error handlers',
    displayOrder: 2,
    categoryOrder: 3,
    isActive: true,
  },
  {
    name: 'WebRTC (P2P Audio/Video)',
    category: 'Backend & Real-Time',
    categoryIcon: 'Server',
    level: 'Advanced',
    desc: 'Low-latency P2P audio/video streaming, peer connections, media tracks',
    displayOrder: 3,
    categoryOrder: 3,
    isActive: true,
  },
  {
    name: 'Socket.io (WebSockets)',
    category: 'Backend & Real-Time',
    categoryIcon: 'Server',
    level: 'Advanced',
    desc: 'Bi-directional real-time communication, rooms, signaling backed by Redis',
    displayOrder: 4,
    categoryOrder: 3,
    isActive: true,
  },
  {
    name: 'RESTful APIs',
    category: 'Backend & Real-Time',
    categoryIcon: 'Server',
    level: 'Core Competency',
    desc: 'Resource design, HTTP status codes, structured JSON request/response',
    displayOrder: 5,
    categoryOrder: 3,
    isActive: true,
  },

  // 4. Databases & Caching
  {
    name: 'MongoDB',
    category: 'Databases & Caching',
    categoryIcon: 'Database',
    level: 'Core Competency',
    desc: 'Document database modeling, indexing, aggregation pipelines, MongoDB Atlas',
    displayOrder: 1,
    categoryOrder: 4,
    isActive: true,
  },
  {
    name: 'Mongoose ODM',
    category: 'Databases & Caching',
    categoryIcon: 'Database',
    level: 'Core Competency',
    desc: 'Schema modeling, validations, middleware hooks, population',
    displayOrder: 2,
    categoryOrder: 4,
    isActive: true,
  },
  {
    name: 'Redis (In-Memory Cache & Pub/Sub)',
    category: 'Databases & Caching',
    categoryIcon: 'Database',
    level: 'Advanced',
    desc: 'High-speed caching, session storage, Pub/Sub messaging for real-time signaling',
    displayOrder: 3,
    categoryOrder: 4,
    isActive: true,
  },
  {
    name: 'MySQL',
    category: 'Databases & Caching',
    categoryIcon: 'Database',
    level: 'Proficient',
    desc: 'Relational database design, normalized schemas, SQL queries and joins',
    displayOrder: 4,
    categoryOrder: 4,
    isActive: true,
  },

  // 5. State Management
  {
    name: 'Redux Toolkit',
    category: 'State Management',
    categoryIcon: 'Share2',
    level: 'Advanced',
    desc: 'Predictable global store, createSlice, async thunks, RTK Query',
    displayOrder: 1,
    categoryOrder: 5,
    isActive: true,
  },
  {
    name: 'Zustand',
    category: 'State Management',
    categoryIcon: 'Share2',
    level: 'Proficient',
    desc: 'Lightweight reactive state management, simple hooks, minimal boilerplate',
    displayOrder: 2,
    categoryOrder: 5,
    isActive: true,
  },
  {
    name: 'React Context API',
    category: 'State Management',
    categoryIcon: 'Share2',
    level: 'Proficient',
    desc: 'Centralized state distribution for auth, themes, and global modals',
    displayOrder: 3,
    categoryOrder: 5,
    isActive: true,
  },

  // 6. AI & Cloud Services
  {
    name: 'Google Gemini API',
    category: 'AI & Cloud Services',
    categoryIcon: 'Sparkles',
    level: 'Advanced',
    desc: 'Gemini Flash integration, prompt engineering, speech-to-text transcripts, AI analysis',
    displayOrder: 1,
    categoryOrder: 6,
    isActive: true,
  },
  {
    name: 'Cloudinary (Media Storage)',
    category: 'AI & Cloud Services',
    categoryIcon: 'Sparkles',
    level: 'Proficient',
    desc: 'Cloud asset management, video/audio recordings, media upload pipelines',
    displayOrder: 2,
    categoryOrder: 6,
    isActive: true,
  },
  {
    name: 'Vercel',
    category: 'AI & Cloud Services',
    categoryIcon: 'Sparkles',
    level: 'Proficient',
    desc: 'Edge deployment, continuous integration, frontend cloud hosting',
    displayOrder: 3,
    categoryOrder: 6,
    isActive: true,
  },
  {
    name: 'Render',
    category: 'AI & Cloud Services',
    categoryIcon: 'Sparkles',
    level: 'Proficient',
    desc: 'Node.js web service deployment, background workers, environment management',
    displayOrder: 4,
    categoryOrder: 6,
    isActive: true,
  },

  // 7. DevOps & Observability
  {
    name: 'Docker',
    category: 'DevOps & Observability',
    categoryIcon: 'Cloud',
    level: 'Proficient',
    desc: 'Containerization, multi-stage Dockerfiles, Docker Compose service orchestration',
    displayOrder: 1,
    categoryOrder: 7,
    isActive: true,
  },
  {
    name: 'Kubernetes (HPA)',
    category: 'DevOps & Observability',
    categoryIcon: 'Cloud',
    level: 'Proficient',
    desc: 'K8s cluster deployments, services, pods, Horizontal Pod Autoscaling (HPA)',
    displayOrder: 2,
    categoryOrder: 7,
    isActive: true,
  },
  {
    name: 'Helm Charts',
    category: 'DevOps & Observability',
    categoryIcon: 'Cloud',
    level: 'Proficient',
    desc: 'Kubernetes package management, release templating, configuration values',
    displayOrder: 3,
    categoryOrder: 7,
    isActive: true,
  },
  {
    name: 'Prometheus',
    category: 'DevOps & Observability',
    categoryIcon: 'Cloud',
    level: 'Proficient',
    desc: 'Metrics collection, time-series monitoring, cluster health telemetry',
    displayOrder: 4,
    categoryOrder: 7,
    isActive: true,
  },
  {
    name: 'Grafana',
    category: 'DevOps & Observability',
    categoryIcon: 'Cloud',
    level: 'Proficient',
    desc: 'Observability dashboards, real-time metrics visualization, alert rules',
    displayOrder: 5,
    categoryOrder: 7,
    isActive: true,
  },
  {
    name: 'Sentry',
    category: 'DevOps & Observability',
    categoryIcon: 'Cloud',
    level: 'Proficient',
    desc: 'Application error tracking, performance tracing, production bug diagnostics',
    displayOrder: 6,
    categoryOrder: 7,
    isActive: true,
  },

  // 8. Testing & Security
  {
    name: 'Apache JMeter (Load Testing)',
    category: 'Testing & Security',
    categoryIcon: 'ShieldCheck',
    level: 'Proficient',
    desc: 'Performance benchmark testing, throughput load simulation, latency stress testing',
    displayOrder: 1,
    categoryOrder: 8,
    isActive: true,
  },
  {
    name: 'OWASP',
    category: 'Testing & Security',
    categoryIcon: 'ShieldCheck',
    level: 'Proficient',
    desc: 'Security audits, Grade A+ protection, vulnerability mitigation, input sanitization',
    displayOrder: 2,
    categoryOrder: 8,
    isActive: true,
  },
  {
    name: 'JWT Auth (RBAC)',
    category: 'Testing & Security',
    categoryIcon: 'ShieldCheck',
    level: 'Core Competency',
    desc: 'Stateless JWT tokens, role-based access control, secure authentication headers',
    displayOrder: 3,
    categoryOrder: 8,
    isActive: true,
  },
  {
    name: 'Postman',
    category: 'Testing & Security',
    categoryIcon: 'ShieldCheck',
    level: 'Proficient',
    desc: 'API testing suites, automated test scripts, mock servers, team workspaces',
    displayOrder: 4,
    categoryOrder: 8,
    isActive: true,
  },
  {
    name: 'Swagger',
    category: 'Testing & Security',
    categoryIcon: 'ShieldCheck',
    level: 'Proficient',
    desc: 'OpenAPI specification, interactive API documentation and endpoint testing',
    displayOrder: 5,
    categoryOrder: 8,
    isActive: true,
  },

  // 9. Tools & Concepts
  {
    name: 'Git',
    category: 'Tools & Concepts',
    categoryIcon: 'Wrench',
    level: 'Proficient',
    desc: 'Version control, branch management, merge conflict resolution, rebasing',
    displayOrder: 1,
    categoryOrder: 9,
    isActive: true,
  },
  {
    name: 'GitHub',
    category: 'Tools & Concepts',
    categoryIcon: 'Wrench',
    level: 'Proficient',
    desc: 'Pull requests, code reviews, collaboration, CI/CD GitHub Actions',
    displayOrder: 2,
    categoryOrder: 9,
    isActive: true,
  },
  {
    name: 'npm',
    category: 'Tools & Concepts',
    categoryIcon: 'Wrench',
    level: 'Proficient',
    desc: 'Package dependency management, semantic versioning, npm scripts',
    displayOrder: 3,
    categoryOrder: 9,
    isActive: true,
  },
  {
    name: 'MVC Architecture',
    category: 'Tools & Concepts',
    categoryIcon: 'Wrench',
    level: 'Core Concept',
    desc: 'Architectural separation of Models, Views, and Controllers for maintainability',
    displayOrder: 4,
    categoryOrder: 9,
    isActive: true,
  },
  {
    name: 'OOPs',
    category: 'Tools & Concepts',
    categoryIcon: 'Wrench',
    level: 'Core Concept',
    desc: 'Object-Oriented Programming principles: Encapsulation, Abstraction, Inheritance, Polymorphism',
    displayOrder: 5,
    categoryOrder: 9,
    isActive: true,
  },
];

const connectDB = require('../src/config/db');

async function run() {
  console.log('Connecting to database...');
  await connectDB();
  console.log('Database connected.');

  const beforeCount = await Skill.countDocuments();
  console.log(`Current skills in DB: ${beforeCount}`);

  console.log('Clearing old skills...');
  await Skill.deleteMany({});

  console.log(`Inserting ${resumeSkills.length} new resume skills...`);
  const inserted = await Skill.insertMany(resumeSkills);
  console.log(`Successfully inserted ${inserted.length} skills!`);

  const categories = await Skill.distinct('category');
  console.log('Distinct Categories:', categories);

  await mongoose.disconnect();
  console.log('Disconnected from database.');
}

run().catch((err) => {
  console.error('Error populating skills:', err);
  process.exit(1);
});
