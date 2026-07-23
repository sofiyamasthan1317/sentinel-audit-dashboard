import React from 'react';
import { Upload, RefreshCw, Radio } from 'lucide-react';

interface HeaderProps {
  totalLogs?: number;
  onRefresh: () => void;
  onOpenUpload: () => void;
  loading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  totalLogs,
  onRefresh,
  onOpenUpload,
  loading = false,
}) => {
  return (
    <header
      style={{
        height: '64px',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Radio size={16} color="var(--status-success-text)" className="animate-pulse" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Live Security Stream
          </span>
        </div>
        {totalLogs !== undefined && (
          <span
            style={{
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
            }}
            className="mono"
          >
            {totalLogs.toLocaleString()} events recorded
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={onRefresh}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-primary)',
            fontSize: '0.8rem',
            fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all var(--transition-fast)',
            opacity: loading ? 0.6 : 1,
          }}
          aria-label="Refresh data"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>

        <button
          onClick={onOpenUpload}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary)',
            border: 'none',
            color: '#ffffff',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
            transition: 'all var(--transition-fast)',
          }}
          aria-label="Import logs"
        >
          <Upload size={14} />
          <span>Import Logs</span>
        </button>
      </div>
    </header>
  );
};
