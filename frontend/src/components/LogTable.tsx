import React from 'react';
import type { IAuditLog, ILogQueryParams } from '../types/log.types';
import { ArrowUp, ArrowDown, ExternalLink, AlertCircle, FileX } from 'lucide-react';

interface LogTableProps {
  logs: IAuditLog[];
  loading: boolean;
  error: string | null;
  filters: ILogQueryParams;
  onSortChange: (field: ILogQueryParams['sortBy']) => void;
  onSelectLog: (log: IAuditLog) => void;
}

export const LogTable: React.FC<LogTableProps> = ({
  logs,
  loading,
  error,
  filters,
  onSortChange,
  onSelectLog,
}) => {
  const getSeverityBadge = (severity: string) => {
    const sev = severity.toUpperCase();
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
    const st = status.toLowerCase();
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

  const renderSortIcon = (field: ILogQueryParams['sortBy']) => {
    if (filters.sortBy !== field) return null;
    return filters.sortOrder === 'asc' ? (
      <ArrowUp size={14} color="var(--primary)" />
    ) : (
      <ArrowDown size={14} color="var(--primary)" />
    );
  };

  const renderSortHeader = (label: string, field: ILogQueryParams['sortBy']) => (
    <th
      onClick={() => onSortChange(field)}
      style={{
        padding: '0.85rem 1rem',
        textAlign: 'left',
        fontSize: '0.75rem',
        fontWeight: 600,
        color: filters.sortBy === field ? 'var(--primary)' : 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        cursor: 'pointer',
        userSelect: 'none',
        borderBottom: '1px solid var(--border-subtle)',
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <span>{label}</span>
        {renderSortIcon(field)}
      </div>
    </th>
  );

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="animate-pulse"
              style={{
                height: '42px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: '3rem 2rem',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--severity-critical-border)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <AlertCircle size={40} color="var(--severity-critical-text)" />
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Failed to Load Audit Logs
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div
        style={{
          padding: '4rem 2rem',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <FileX size={44} color="var(--text-muted)" />
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            No Audit Logs Found
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Try adjusting your search criteria or clear active filters.
          </div>
        </div>
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
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
              {renderSortHeader('Timestamp', 'timestamp')}
              {renderSortHeader('Actor', 'actor')}
              {renderSortHeader('Role', 'role')}
              {renderSortHeader('Action', 'action')}
              <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-subtle)' }}>
                Resource
              </th>
              {renderSortHeader('Severity', 'severity')}
              {renderSortHeader('Status', 'status')}
              <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-subtle)' }}>
                IP Address
              </th>
              {renderSortHeader('Region', 'region')}
              <th style={{ padding: '0.85rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-subtle)' }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log._id}
                onClick={() => onSelectLog(log)}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'background-color var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {/* Timestamp */}
                <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap', fontSize: '0.8rem' }} className="mono">
                  {new Date(log.timestamp).toLocaleString(undefined, {
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </td>

                {/* Actor */}
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                  {log.actor}
                </td>

                {/* Role */}
                <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span
                    style={{
                      padding: '0.15rem 0.45rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-default)',
                    }}
                    className="mono"
                  >
                    {log.role}
                  </span>
                </td>

                {/* Action */}
                <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }} className="mono">
                  {log.action}
                </td>

                {/* Resource */}
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <span title={log.resource}>{log.resource}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }} className="mono">
                    ({log.resourceType})
                  </span>
                </td>

                {/* Severity */}
                <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                  {getSeverityBadge(log.severity)}
                </td>

                {/* Status */}
                <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                  {getStatusBadge(log.status)}
                </td>

                {/* IP Address */}
                <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap', fontSize: '0.8rem', color: 'var(--text-muted)' }} className="mono">
                  {log.ipAddress}
                </td>

                {/* Region */}
                <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap', fontSize: '0.8rem', color: 'var(--accent-cyan)' }} className="mono">
                  {log.region}
                </td>

                {/* Investigate Action */}
                <td style={{ padding: '0.85rem 1rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLog(log);
                    }}
                    style={{
                      padding: '0.35rem 0.6rem',
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
