import React from 'react';
import { Inbox, Plus } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'Get started by creating your first entry.',
  actionText,
  onAction,
}) => {
  return (
    <div
      style={{
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-card)',
        border: '1px dashed var(--border-hover)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'rgba(56, 189, 248, 0.1)',
          color: 'var(--accent-cyan)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <Icon size={26} />
      </div>

      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
        {title}
      </h4>

      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: 1.6, marginBottom: actionText ? '1.5rem' : 0 }}>
        {description}
      </p>

      {actionText && onAction && (
        <button type="button" className="admin-btn admin-btn-primary" onClick={onAction}>
          <Plus size={16} />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
