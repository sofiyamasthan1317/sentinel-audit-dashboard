import React from 'react';
import type { IAuditLog } from '../types/log.types';
import { formatDate } from '../utils/formatting';
import { X, Copy, Check, ShieldAlert, Terminal, AlertCircle } from 'lucide-react';

interface LogDetailsModalProps {
  log: IAuditLog | null;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
}

export const LogDetailsModal: React.FC<LogDetailsModalProps> = ({
  log,
  loading = false,
  error = null,
  onClose,
}) => {
  const [copied, setCopied] = React.useState<boolean>(false);

  if (!log && !loading && !error) return null;

  const handleCopyJson = () => {
    if (!log) return;
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          padding: '0.25rem 0.6rem',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: bg,
          border: `1px solid ${border}`,
          color: text,
          fontSize: '0.75rem',
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
          padding: '0.2rem 0.6rem',
          borderRadius: '9999px',
          backgroundColor: bg,
          color: text,
          fontSize: '0.8rem',
          fontWeight: 600,
          textTransform: 'capitalize',
        }}
      >
        {st}
      </span>
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 50,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      {/* Side Drawer Panel */}
      <div
        style={{
          width: '100%',
          maxWidth: '620px',
          backgroundColor: 'var(--bg-surface)',
          height: '100%',
          borderLeft: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldAlert size={22} color="var(--primary)" />
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>Audit Event Details</div>
              {log && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} className="mono">
                  LOG ID: {log._id}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '0.4rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
            aria-label="Close panel"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse" style={{ height: '50px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }} />
              ))}
            </div>
          ) : error ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--severity-critical-text)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={32} />
              <div>{error}</div>
            </div>
          ) : log ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Header Badges Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {getSeverityBadge(log.severity)}
                {getStatusBadge(log.status)}
              </div>

              {/* Event Information Section */}
              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Event Information
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Actor</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{log.actor}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Role</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }} className="mono">{log.role}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Action</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)' }} className="mono">{log.action}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Event Timestamp</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }} className="mono">{formatDate(log.timestamp)}</div>
                  </div>
                </div>
              </div>

              {/* Resource Information Section */}
              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Resource & Network Details
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Resource</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }} className="mono">{log.resource}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Resource Type</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }} className="mono">{log.resourceType}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Originating IP Address</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }} className="mono">{log.ipAddress}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Region</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)' }} className="mono">{log.region}</div>
                  </div>
                </div>

                {(log.createdAt || log.updatedAt) && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                    {log.createdAt && (
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Created At</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }} className="mono">{formatDate(log.createdAt)}</div>
                      </div>
                    )}
                    {log.updatedAt && (
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Updated At</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }} className="mono">{formatDate(log.updatedAt)}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Technical JSON Payload Inspector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Terminal size={14} />
                    <span>Technical Payload (Raw JSON)</span>
                  </div>
                  <button
                    onClick={handleCopyJson}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.3rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-default)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    {copied ? <Check size={12} color="var(--status-success-text)" /> : <Copy size={12} />}
                    <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                  </button>
                </div>

                <pre
                  style={{
                    padding: '1rem',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.75rem',
                    color: 'var(--text-primary)',
                    overflowX: 'auto',
                    maxHeight: '260px',
                  }}
                  className="mono"
                >
                  {JSON.stringify(log, null, 2)}
                </pre>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
