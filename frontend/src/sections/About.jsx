import React from 'react';
import {
  GraduationCap,
  Layers,
  Server,
  Database,
  ShieldCheck,
  CheckCircle,
  MapPin,
  Sparkles,
  Code2,
  Award,
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import SpotlightCard from '../components/SpotlightCard';
import useScrollReveal from '../hooks/useScrollReveal';
import { usePortfolioData } from '../context/PortfolioContext';

export const About = () => {
  const { personalInfo } = usePortfolioData();
  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <section id="about" className="section">
      <div className="container">
        <div ref={headerRef} className={`reveal-item ${headerVisible ? 'revealed' : ''}`}>
          <SectionHeader
            tag="Background"
            title="About"
            highlightedText="My Journey"
            description="A dedicated MERN Stack Developer committed to building reliable, high-performance web systems and verified business workflows."
          />
        </div>

        {/* Top Showcase: Developer Portrait & Bio Narrative */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: personalInfo.profileImage ? '380px 1fr' : '1fr',
            gap: '3rem',
            alignItems: 'center',
            marginBottom: '3.5rem',
          }}
          className="about-showcase-grid"
        >
          {/* Left: Professional Portrait Card */}
          {personalInfo.profileImage && (
            <div
              className="about-portrait-card animate-fade-up"
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                border: '1px solid var(--border-hover)',
                backgroundColor: 'var(--bg-surface)',
                boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6), 0 0 30px rgba(56, 189, 248, 0.12)',
              }}
            >
              {/* Ambient Glow Aura */}
              <div
                style={{
                  position: 'absolute',
                  top: '-20%',
                  right: '-20%',
                  width: '240px',
                  height: '240px',
                  background: 'radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, transparent 70%)',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              />

              {/* Image Frame */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '460px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={personalInfo.profileImage}
                  alt={personalInfo.name}
                  className="about-portrait-img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 15%',
                    display: 'block',
                    transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />

                {/* Gradient Vignette Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(3, 7, 18, 0.35) 0%, transparent 35%, transparent 60%, rgba(3, 7, 18, 0.95) 100%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Floating Top Left Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    backdropFilter: 'blur(12px)',
                    background: 'rgba(3, 7, 18, 0.8)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.78rem',
                    color: 'var(--accent-cyan)',
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                    zIndex: 2,
                  }}
                >
                  <Code2 size={13} />
                  <span>MERN Full-Stack</span>
                </div>

                {/* Floating Top Right Status Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    backdropFilter: 'blur(12px)',
                    background: 'rgba(3, 7, 18, 0.8)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.78rem',
                    color: 'var(--accent-emerald)',
                    fontWeight: 500,
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                    zIndex: 2,
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-emerald)',
                      boxShadow: '0 0 8px var(--accent-emerald)',
                    }}
                  />
                  <span>Open to Roles</span>
                </div>

                {/* Bottom Overlay Label */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    padding: '1.5rem',
                    zIndex: 2,
                  }}
                >
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.2rem' }}>
                    {personalInfo.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--accent-cyan)',
                      fontFamily: 'var(--font-mono)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {personalInfo.title}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '0.2rem 0.55rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      MCA Graduate (GTU)
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '0.2rem 0.55rem',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--accent-emerald)',
                        fontWeight: 600,
                      }}
                    >
                      CPI: 8.45
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right: Bio Story Narrative */}
          <div className="animate-fade-up">
            <h3 style={{ fontSize: '1.85rem', marginBottom: '1.25rem', fontWeight: 700, lineHeight: 1.25 }}>
              Full-Stack Engineering with a <span className="text-gradient">Quality-First</span> Mindset
            </h3>

            <p style={{ fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
              I am an <strong>MCA Graduate</strong> and <strong>MERN Stack Developer</strong> with hands-on experience in architecting full-lifecycle web applications. My development focus centers on developing modular React.js user interfaces, scalable Node.js/Express.js backend services, and structured MongoDB Atlas data models.
            </p>

            <p style={{ fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
              Beyond standard feature development, I place strong emphasis on <strong>functional testing, API contract validation, and workflow verification</strong>. Whether securing endpoints with JWT authentication and Role-Based Access Control (RBAC) or streamlining business processes for commercial software, I ensure software is resilient, secure, and user-friendly.
            </p>

            {/* Location & Key Attributes */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                padding: '1.25rem',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MapPin size={18} color="var(--accent-cyan)" />
                <span style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>{personalInfo.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <GraduationCap size={18} color="var(--accent-indigo)" />
                <span style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>MCA (GTU) • CPI: 8.45</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Sparkles size={18} color="var(--accent-emerald)" />
                <span style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>AI-Assisted Workflow Productivity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars of Engineering Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}
          className="about-pillars-grid"
        >
          {/* Pillar 1 */}
          <SpotlightCard
            className="hover-lift"
            spotlightColor="rgba(56, 189, 248, 0.16)"
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(56, 189, 248, 0.1)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <Layers size={22} />
            </div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>MERN Full-Stack</h4>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.6' }}>
              Cohesive full-stack applications using React.js, Express, Node.js, and MongoDB with clean component hierarchy.
            </p>
          </SpotlightCard>

          {/* Pillar 2 */}
          <SpotlightCard
            className="hover-lift"
            spotlightColor="rgba(99, 102, 241, 0.16)"
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.1)',
                color: 'var(--accent-indigo)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <Server size={22} />
            </div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>REST API & MVC</h4>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.6' }}>
              Predictable, versioned REST endpoints structured with strict MVC separation, request validation, and uniform responses.
            </p>
          </SpotlightCard>

          {/* Pillar 3 */}
          <SpotlightCard
            className="hover-lift"
            spotlightColor="rgba(168, 85, 247, 0.16)"
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(168, 85, 247, 0.1)',
                color: 'var(--accent-violet)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Auth & RBAC</h4>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.6' }}>
              Stateless JWT token authentication coupled with granular Role-Based Access Control to safeguard sensitive resources.
            </p>
          </SpotlightCard>

          {/* Pillar 4 */}
          <SpotlightCard
            className="hover-lift"
            spotlightColor="rgba(16, 185, 129, 0.16)"
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <CheckCircle size={22} />
            </div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Testing & QA</h4>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.6' }}>
              Functional validation, Postman API contract verification, and bug tracking to ensure production stability.
            </p>
          </SpotlightCard>
        </div>
      </div>

      <style>{`
        .about-portrait-card:hover .about-portrait-img {
          transform: scale(1.04);
        }
        @media (max-width: 968px) {
          .about-showcase-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .about-portrait-card {
            max-width: 380px !important;
            margin: 0 auto !important;
          }
        }
      `}</style>
    </section>
  );
};

export default About;
