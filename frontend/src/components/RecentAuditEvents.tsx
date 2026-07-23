import React from 'react';
import type { IAuditLog } from '../types/log.types';
import { formatDate } from '../utils/formatting';
import { ExternalLink, ArrowRight } from 'lucide-react';

interface RecentAuditEventsProps {
  logs: IAuditLog[];
  loading: boolean;
  onSelectLog: (log: IAuditLog) => void;
  onViewAllLogs: () => void;
}

export const RecentAuditEvents: React.FC<RecentAuditEventsProps> = ({
  logs,
  loading,
  onSelectLog,
  onViewAllLogs,
}) => {
  const getSeverityBadge = (severity: string) => {
    const sev = String(severity).toUpperCase();
    let bg = 'var(--severity-info-bg)';
    let border = 'var(--severity-info-border)';
    let text = 'var(--severity-info-text)';

    if (sev === 'CRITICAL') {
      bg = 'var(--severity-critical-bg)';
      border = 'var(--severity-critical-border)';
      text = 'var(--severity-critical-text)';
    } else if (sev === 'HIGH') {
      bg = 'var(--severity-high-bg)';
      border = 'var(--severity-high-border)';
      text = 'var(--severity-high-text)';
    } else if (sev === 'MEDIUM') {
      bg = 'var(--severity-medium-bg)';
      border = 'var(--severity-medium-border)';
      text = 'var(--severity-medium-text)';
    } else if (sev === 'LOW') {
      bg = 'var(--severity-low-bg)';
      border = 'var(--severity-low-border)';
      text = 'var(--severity-low-text)';
    }

    return (
      <span
        style={{
          padding: '0.2rem 0.5rem',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: bg,
          border: `1px solid ${border}`,
          color: text,
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
        }}
        className="mono"
      >
        {sev}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const st = String(status).toLowerCase();
    let bg = 'var(--bg-elevated)';
    let text = 'var(--text-secondary)';

    if (st === 'success') {
      bg = 'var(--status-success-bg)';
      text = 'var(--status-success-text)';
    } else if (st === 'failure') {
      bg = 'var(--status-failure-bg)';
      text = 'var(--status-failure-text)';
    } else if (st === 'warning') {
      bg = 'var(--status-warning-bg)';
      text = 'var(--status-warning-text)';
    }

    return (
      <span
        style={{
          padding: '0.15rem 0.5rem',
          borderRadius: '9999px',
          backgroundColor: bg,
          color: text,
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'capitalize',
        }}
      >
        {st}
      </span>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Recent Audit Activity</div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="animate-pulse"
            style={{
              height: '38px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Recent Audit Activity
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            Latest security events requiring system awareness
          </p>
        </div>

        <button
          onClick={onViewAllLogs}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            color: 'var(--primary)',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          <span>View All Logs</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Timestamp</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actor</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Action</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Severity</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Region</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No recent audit events available.
                </td>
              </tr>
            ) : (
              logs.slice(0, 5).map((log) => (
                <tr
                  key={log._id}
                  onClick={() => onSelectLog(log)}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'background-color var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap', fontSize: '0.8rem' }} className="mono">
                    {formatDate(log.timestamp)}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                    {log.actor}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--primary)', fontSize: '0.85rem' }} className="mono">
                    {log.action}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                    {getSeverityBadge(log.severity)}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                    {getStatusBadge(log.status)}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--accent-cyan)', fontSize: '0.8rem' }} className="mono">
                    {log.region}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLog(log);
                      }}
                      style={{
                        padding: '0.3rem 0.55rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border-default)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.75rem',
                      }}
                    >
                      <ExternalLink size={12} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
