import React, { useState, useEffect } from 'react';
import type { IAuditLog, IAuditLogStats } from '../types/log.types';
import { fetchLogStatsApi, fetchLogsApi, fetchLogByIdApi } from '../services/api';
import { DashboardStats } from '../components/DashboardStats';
import { RecentAuditEvents } from '../components/RecentAuditEvents';
import { LogDetailsModal } from '../components/LogDetailsModal';

interface DashboardPageProps {
  onNavigateToAuditLogs: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateToAuditLogs }) => {
  const [stats, setStats] = useState<IAuditLogStats | null>(null);
  const [recentLogs, setRecentLogs] = useState<IAuditLog[]>([]);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  const [logsLoading, setLogsLoading] = useState<boolean>(true);

  // Inspection modal state
  const [selectedLog, setSelectedLog] = useState<IAuditLog | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setStatsLoading(true);
      setLogsLoading(true);

      try {
        const statsRes = await fetchLogStatsApi();
        if (statsRes.success) {
          setStats(statsRes.data);
        }
      } catch (err) {
        console.error('Error loading stats:', err);
      } finally {
        setStatsLoading(false);
      }

      try {
        const logsRes = await fetchLogsApi({ page: 1, limit: 5, sortBy: 'timestamp', sortOrder: 'desc' });
        if (logsRes.success) {
          setRecentLogs(logsRes.data);
        }
      } catch (err) {
        console.error('Error loading recent logs:', err);
      } finally {
        setLogsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleSelectLog = async (log: IAuditLog) => {
    setSelectedLog(log);
    setModalLoading(true);
    setModalError(null);
    try {
      const res = await fetchLogByIdApi(log._id);
      if (res.success) {
        setSelectedLog(res.data);
      }
    } catch (err: any) {
      setModalError(err?.response?.data?.message || 'Failed to load log details');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header Section */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
          Security Overview Dashboard
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
          High-level security monitoring overview and KPI trends across cloud regions.
        </p>
      </div>

      {/* KPI Cards & Breakdown Visual Summaries */}
      <DashboardStats stats={stats} loading={statsLoading} />

      {/* Recent Audit Activity Section */}
      <RecentAuditEvents
        logs={recentLogs}
        loading={logsLoading}
        onSelectLog={handleSelectLog}
        onViewAllLogs={onNavigateToAuditLogs}
      />

      {/* Log Details Modal */}
      <LogDetailsModal
        log={selectedLog}
        loading={modalLoading}
        error={modalError}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
};
