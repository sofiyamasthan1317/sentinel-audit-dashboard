import React from 'react';
import type { IAuditLogStats } from '../types/log.types';
import { formatNumber, calculatePercentage } from '../utils/formatting';
import { ShieldAlert, Activity, Globe, XCircle } from 'lucide-react';

interface DashboardStatsProps {
  stats: IAuditLogStats | null;
  loading: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="kpi-grid">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse"
            style={{
              height: '110px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
            }}
          />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const getSeverityColor = (sev: string) => {
    switch (String(sev).toUpperCase()) {
      case 'CRITICAL': return 'var(--severity-critical-text)';
      case 'HIGH': return 'var(--severity-high-text)';
      case 'MEDIUM': return 'var(--severity-medium-text)';
      case 'LOW': return 'var(--severity-low-text)';
      default: return 'var(--severity-info-text)';
    }
  };

  const getStatusColor = (st: string) => {
    switch (String(st).toLowerCase()) {
      case 'success': return 'var(--status-success-text)';
      case 'failure': return 'var(--status-failure-text)';
      case 'warning': return 'var(--status-warning-text)';
      default: return 'var(--text-muted)';
    }
  };

  const criticalHighCount =
    (stats.severity.find((s) => String(s._id).toUpperCase() === 'CRITICAL')?.count || 0) +
    (stats.severity.find((s) => String(s._id).toUpperCase() === 'HIGH')?.count || 0);

  const failureCount =
    stats.status.find((s) => String(s._id).toLowerCase() === 'failure')?.count || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Primary KPI Cards */}
      <div className="kpi-grid">
        {/* Total Logs Card */}
        <div
          style={{
            padding: 'var(--space-5)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-default)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Log Events
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: 'var(--space-1)', color: 'var(--text-primary)' }} className="mono">
              {formatNumber(stats.totalLogs)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>
              Indexed across all regions
            </div>
          </div>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Activity size={20} />
          </div>
        </div>

        {/* Severity Count Card */}
        <div
          style={{
            padding: 'var(--space-5)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-default)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Critical / High Alerts
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: 'var(--space-1)', color: 'var(--severity-critical-text)' }} className="mono">
              {formatNumber(criticalHighCount)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>
              Requires security triage
            </div>
          </div>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: 'var(--severity-critical-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldAlert size={20} />
          </div>
        </div>

        {/* Failed Executions Card */}
        <div
          style={{
            padding: 'var(--space-5)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-default)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Failed Executions
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: 'var(--space-1)', color: 'var(--status-failure-text)' }} className="mono">
              {formatNumber(failureCount)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>
              Unsuccessful status executions
            </div>
          </div>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: 'var(--status-failure-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <XCircle size={20} />
          </div>
        </div>

        {/* Unique Regions Card */}
        <div
          style={{
            padding: 'var(--space-5)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-default)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Regions
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: 'var(--space-1)', color: 'var(--text-primary)' }} className="mono">
              {stats.region.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>
              Global cloud zones
            </div>
          </div>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Globe size={20} />
          </div>
        </div>
      </div>

      {/* Visual Metric Breakdown Bars */}
      <div className="analytics-grid">
        {/* Severity Distribution */}
        <div
          style={{
            padding: 'var(--space-5)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}>
            Severity Distribution
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {stats.severity.map((item) => {
              const pct = calculatePercentage(item.count, stats.totalLogs);
              return (
                <div key={item._id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: getSeverityColor(item._id), fontWeight: 600 }}>{item._id}</span>
                    <span className="mono text-muted">{item.count} ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        backgroundColor: getSeverityColor(item._id),
                        borderRadius: '4px',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Summary */}
        <div
          style={{
            padding: 'var(--space-5)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}>
            Status Summary
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {stats.status.map((item) => {
              const pct = calculatePercentage(item.count, stats.totalLogs);
              return (
                <div key={item._id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: getStatusColor(item._id), fontWeight: 600, textTransform: 'capitalize' }}>
                      {item._id}
                    </span>
                    <span className="mono text-muted">{item.count} ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        backgroundColor: getStatusColor(item._id),
                        borderRadius: '4px',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Region Breakdown */}
        <div
          style={{
            padding: 'var(--space-5)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}>
            Region Breakdown
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {stats.region.slice(0, 4).map((item) => {
              const pct = calculatePercentage(item.count, stats.totalLogs);
              return (
                <div key={item._id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }} className="mono">
                      {item._id}
                    </span>
                    <span className="mono text-muted">{item.count} ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        backgroundColor: 'var(--accent-cyan)',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
