import React from 'react';
import SectionHeader from '../components/SectionHeader';
import { usePortfolioData } from '../context/PortfolioContext';

export const Approach = () => {
  const { developmentApproach } = usePortfolioData();
  return (
    <section id="approach" className="section">
      <div className="container">
        <SectionHeader
          tag="Engineering Philosophy"
          title="What I Build &"
          highlightedText="My Approach"
          description="How I take ideas from initial operational workflows to battle-tested, maintainable full-stack software."
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {developmentApproach.map((step, idx) => (
            <div
              key={idx}
              className="card hover-lift"
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Step Number with Gradient */}
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '2rem',
                    fontWeight: 800,
                    marginBottom: '1rem',
                    background: 'var(--gradient-accent-text)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                  }}
                >
                  {step.number}
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  {step.title}
                </h3>

                <p style={{ fontSize: '0.92rem', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                  {step.description}
                </p>
              </div>

              {/* Decorative Accent Line */}
              <div
                style={{
                  marginTop: '1.5rem',
                  height: '2px',
                  width: '40px',
                  background: 'var(--accent-cyan)',
                  borderRadius: 'var(--radius-full)',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Approach;
