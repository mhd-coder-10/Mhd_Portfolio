const mongoose = require('mongoose');

const pillarSchema = new mongoose.Schema({
  icon: { type: String, default: 'Layers' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: String, default: 'var(--accent-cyan)' },
});

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Momin Mahmmadbhai',
    },
    shortName: {
      type: String,
      default: 'Mahmmadbhai',
    },
    title: {
      type: String,
      required: true,
      default: 'Full-Stack Developer (MERN)',
    },
    headline: {
      type: String,
      default: 'Building scalable web applications, business solutions, and secure REST APIs with modern JavaScript technologies.',
    },
    location: {
      type: String,
      default: 'Sidhpur, Patan, Gujarat, India',
    },
    email: {
      type: String,
      default: 'mhd.developer10@gmail.com',
    },
    phone: {
      type: String,
      default: '9316515672',
    },
    displayPhone: {
      type: String,
      default: '+91 93165 15672',
    },
    status: {
      type: String,
      default: 'Open to Opportunities',
    },
    bio: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
    },
    // Hero Section settings
    hero: {
      rotatingRoles: {
        type: [String],
        default: [
          'Full-Stack Developer (MERN)',
          'React.js UI & System Architect',
          'Scalable RESTful API Engineer',
          'MongoDB Data Modeling Specialist',
          'Functional Testing & QA Engineer',
        ],
      },
      stats: {
        mcaCpi: { type: Number, default: 8.45 },
        enterpriseApps: { type: Number, default: 3 },
        qaReliability: { type: Number, default: 100 },
        techStacks: { type: Number, default: 10 },
      },
      strengths: {
        type: [String],
        default: [
          'REST APIs & Clean MVC Architecture',
          'JWT Authentication & Secure RBAC',
          'Functional Validation & QA Testing',
        ],
      },
      badgeText: {
        type: String,
        default: 'Available for Full-Stack Roles',
      },
      primaryCtaText: { type: String, default: 'View My Work' },
      primaryCtaLink: { type: String, default: '#projects' },
      secondaryCtaText: { type: String, default: 'Download Resume' },
      terminalFilename: { type: String, default: 'momin-profile.json' },
    },
    // About Section settings
    about: {
      heading: {
        type: String,
        default: 'Full-Stack Engineering with a Quality-First Mindset',
      },
      paragraph1: {
        type: String,
        default: 'I am an MCA Graduate and MERN Stack Developer with hands-on experience in architecting full-lifecycle web applications. My development focus centers on developing modular React.js user interfaces, scalable Node.js/Express.js backend services, and structured MongoDB Atlas data models.',
      },
      paragraph2: {
        type: String,
        default: 'Beyond standard feature development, I place strong emphasis on functional testing, API contract validation, and workflow verification. Whether securing endpoints with JWT authentication and Role-Based Access Control (RBAC) or streamlining business processes for commercial software, I ensure software is resilient, secure, and user-friendly.',
      },
      graduationText: {
        type: String,
        default: 'MCA (GTU) • CPI: 8.45',
      },
      pillars: [pillarSchema],
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
