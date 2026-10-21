const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const connectDB = require('../src/config/db');
const Project = require('../src/models/project.model');

const resumeProjects = [
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
    hasDemo: false,
    demoUrl: '',
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

async function run() {
  console.log('Connecting to database...');
  await connectDB();
  console.log('Database connected.');

  const beforeCount = await Project.countDocuments();
  console.log(`Current projects in DB: ${beforeCount}`);

  console.log('Removing old projects...');
  await Project.deleteMany({});

  console.log(`Inserting ${resumeProjects.length} new resume projects...`);
  const inserted = await Project.insertMany(resumeProjects);
  console.log(`Successfully inserted ${inserted.length} projects!`);

  const titles = inserted.map((p) => p.name);
  console.log('New Projects in DB:', titles);

  await mongoose.disconnect();
  console.log('Disconnected from database.');
}

run().catch((err) => {
  console.error('Error populating projects:', err);
  process.exit(1);
});
