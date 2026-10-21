import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import SpotlightCard from '../components/SpotlightCard';
import useScrollReveal from '../hooks/useScrollReveal';
import { usePortfolioData } from '../context/PortfolioContext';

export const Experience = () => {
  const { experiences } = usePortfolioData();
  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <section id="experience" className="section">
      <div className="container">
        <div ref={headerRef} className={`reveal-item ${headerVisible ? 'revealed' : ''}`}>
          <SectionHeader
            tag="Career Journey"
            title="Work"
            highlightedText="Experience"
            description="Track record of engineering real-world business management solutions, enterprise SaaS modules, and scalable RESTful APIs."
          />
        </div>

        {/* Timeline Container */}
        <div className="timeline-container">
          {/* Vertical Glowing Timeline Line */}
          <div className="timeline-spine" />

          {(experiences || []).map((exp, index) => (
            <div key={exp._id || exp.id || index} className="timeline-item animate-fade-up">
              {/* Timeline Node Icon */}
              <div className="timeline-node">
                <Briefcase size={18} />
              </div>

              {/* Experience Card */}
              <SpotlightCard
                className="timeline-card hover-lift"
                spotlightColor={index === 0 ? 'rgba(16, 185, 129, 0.16)' : 'rgba(56, 189, 248, 0.16)'}
              >
                {/* Header info */}
                <div className="timeline-card-header">
                  <div>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.78rem',
                        fontFamily: 'var(--font-mono)',
                        color: index === 0 ? 'var(--accent-emerald)' : 'var(--accent-cyan)',
                        background: index === 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(56, 189, 248, 0.1)',
                        border: index === 0 ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(56, 189, 248, 0.25)',
                        padding: '0.2rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      {exp.type}
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{exp.role}</h3>
                    <h4
                      style={{
                        fontSize: '1.1rem',
                        color: 'var(--accent-cyan)',
                        fontWeight: 600,
                        marginTop: '0.2rem',
                      }}
                    >
                      {exp.company}
                    </h4>
                  </div>

                  <div className="timeline-meta">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={15} color="var(--accent-indigo)" />
                      <span>{exp.duration}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={15} color="var(--text-muted)" />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.96rem', lineHeight: '1.7', margin: '1rem 0' }}>
                  {exp.description}
                </p>

                {/* Responsibilities list */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h5
                    style={{
                      fontSize: '0.88rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      marginBottom: '0.75rem',
                    }}
                  >
                    Key Responsibilities & Deliverables:
                  </h5>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    {exp.responsibilities.map((resp, rIdx) => (
                      <li
                        key={rIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.6rem',
                          fontSize: '0.92rem',
                          color: 'var(--text-secondary)',
                          lineHeight: '1.5',
                        }}
                      >
                        <CheckCircle2
                          size={16}
                          color="var(--accent-emerald)"
                          style={{ flexShrink: 0, marginTop: '3px' }}
                        />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {exp.technologies.map((tech, tIdx) => (
                    <span key={tIdx} className="tech-badge">
                      {tech}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .timeline-container {
          position: relative;
          max-width: 950px;
          margin: 0 auto;
          padding: 1rem 0;
        }
        .timeline-spine {
          position: absolute;
          left: 28px;
          top: 20px;
          bottom: 20px;
          width: 2px;
          background: linear-gradient(180deg, var(--accent-cyan) 0%, var(--accent-indigo) 60%, transparent 100%);
          opacity: 0.4;
        }
        .timeline-item {
          position: relative;
          padding-left: 70px;
          margin-bottom: 2.5rem;
        }
        .timeline-item:last-child {
          margin-bottom: 0;
        }
        .timeline-node {
          position: absolute;
          left: 14px;
          top: 24px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--bg-card);
          border: 2px solid var(--accent-cyan);
          box-shadow: 0 0 14px rgba(56, 189, 248, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-cyan);
          z-index: 2;
          transition: all var(--transition-normal);
        }
        .timeline-item:hover .timeline-node {
          transform: scale(1.15);
          border-color: var(--accent-indigo);
          color: var(--accent-indigo);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
        }
        .timeline-card {
          padding: 2rem;
        }
        .timeline-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 1rem;
        }
        .timeline-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.35rem;
          font-family: var(--font-mono);
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        @media (max-width: 640px) {
          .timeline-spine {
            left: 18px;
          }
          .timeline-node {
            left: 4px;
            width: 28px;
            height: 28px;
          }
          .timeline-item {
            padding-left: 48px;
          }
          .timeline-card {
            padding: 1.5rem;
          }
          .timeline-meta {
            align-items: flex-start;
          }
        }
      `}</style>
    </section>
  );
};

export default Experience;
