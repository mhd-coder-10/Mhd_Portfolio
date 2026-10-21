import React from 'react';

export const LoadingSkeleton = ({ rows = 4, type = 'table' }) => {
  if (type === 'cards') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="admin-card" style={{ opacity: 0.7 }}>
            <div style={{ height: '20px', width: '60%', backgroundColor: 'var(--border-subtle)', borderRadius: '4px', marginBottom: '1rem' }} />
            <div style={{ height: '36px', width: '40%', backgroundColor: 'var(--border-subtle)', borderRadius: '4px', marginBottom: '0.75rem' }} />
            <div style={{ height: '14px', width: '80%', backgroundColor: 'var(--border-subtle)', borderRadius: '4px' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="admin-card" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {[...Array(rows)].map((_, i) => (
          <div
            key={i}
            style={{
              height: '42px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              animation: 'pulse 1.5s infinite',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
