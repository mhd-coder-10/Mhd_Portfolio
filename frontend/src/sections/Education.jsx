import React from 'react';
import { GraduationCap, Award, Languages, Globe } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { usePortfolioData } from '../context/PortfolioContext';

export const Education = () => {
  const { educationData, languages } = usePortfolioData();
  return (
    <section id="education" className="section">
      <div className="container">
        <SectionHeader
          tag="Academic Foundation"
          title="Education &"
          highlightedText="Languages"
          description="Formal computer applications training coupled with multilingual professional communication."
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '2rem',
            alignItems: 'start',
          }}
          className="education-grid"
        >
          {/* Education Card */}
          {(educationData || []).map((edu, idx) => (
            <div key={edu._id || edu.id || idx} className="card hover-lift">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(56, 189, 248, 0.1)',
                    color: 'var(--accent-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{edu.degree}</h3>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                    {edu.institution}
                  </h4>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  margin: '1rem 0 1.25rem 0',
                  padding: '0.85rem 1rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
                    TIMELINE
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.92rem' }}>
                    {edu.duration}
                  </span>
                </div>
                <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
                    ACADEMIC SCORE
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      color: 'var(--accent-emerald)',
                    }}
                  >
                    {edu.score}
                  </span>
                </div>
                <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
                    LOCATION
                  </span>
                  <span style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                    {edu.location}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.94rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                {edu.details}
              </p>
            </div>
          ))}

          {/* Languages Card */}
          <div className="card hover-lift">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.25rem',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '0.75rem',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: 'var(--accent-indigo)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Languages size={20} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Languages</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(languages || []).map((lang, idx) => (
                <div
                  key={lang._id || lang.id || idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.65rem',
                    flexWrap: 'wrap',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: 'var(--accent-cyan)',
                        boxShadow: '0 0 8px var(--accent-cyan)',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {lang.name}
                    </span>
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.74rem',
                      color: 'var(--accent-cyan)',
                      background: 'rgba(56, 189, 248, 0.08)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      padding: '0.22rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      textAlign: 'right',
                    }}
                  >
                    {lang.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .education-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Education;
