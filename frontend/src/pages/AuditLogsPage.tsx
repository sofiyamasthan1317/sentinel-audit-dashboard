import React, { useState, useEffect, useCallback } from 'react';
import type { IAuditLog, ILogQueryParams, IPagination } from '../types/log.types';
import { fetchLogsApi, fetchLogByIdApi } from '../services/api';
import { LogFilters } from '../components/LogFilters';
import { LogTable } from '../components/LogTable';
import { Pagination } from '../components/Pagination';
import { LogDetailsModal } from '../components/LogDetailsModal';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<IAuditLog[]>([]);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Inspection modal state
  const [selectedLog, setSelectedLog] = useState<IAuditLog | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Query Params state for server-side operations
  const [queryParams, setQueryParams] = useState<ILogQueryParams>({
    page: 1,
    limit: 20,
    sortBy: 'timestamp',
    sortOrder: 'desc',
  });

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLogsApi(queryParams);
      if (res.success) {
        setLogs(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      } else {
        setError('Failed to fetch audit logs.');
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Cannot connect to backend server. Make sure the Node.js API server is running on port 5000.'
      );
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleFilterChange = (newParams: Partial<ILogQueryParams>) => {
    setQueryParams((prev) => ({
      ...prev,
      ...newParams,
    }));
  };

  const handleResetFilters = () => {
    setQueryParams({
      page: 1,
      limit: 20,
      sortBy: 'timestamp',
      sortOrder: 'desc',
    });
  };

  const handleSortChange = (field: ILogQueryParams['sortBy']) => {
    setQueryParams((prev) => {
      if (prev.sortBy === field) {
        return {
          ...prev,
          sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
          page: 1,
        };
      }
      return {
        ...prev,
        sortBy: field,
        sortOrder: 'desc',
        page: 1,
      };
    });
  };

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
          Audit Logs Explorer
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
          Investigate, search, filter, and analyze all system security events with server-side pagination.
        </p>
      </div>

      {/* Server-Side Filtering & Search Controls */}
      <LogFilters
        filters={queryParams}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Full Server-Side Paginated Logs Table */}
      <LogTable
        logs={logs}
        loading={loading}
        error={error}
        filters={queryParams}
        onSortChange={handleSortChange}
        onSelectLog={handleSelectLog}
      />

      {/* Server-Side Pagination */}
      <Pagination
        pagination={pagination}
        onPageChange={(page) => handleFilterChange({ page })}
        onLimitChange={(limit) => handleFilterChange({ limit, page: 1 })}
      />

      {/* Log Investigation Drawer */}
      <LogDetailsModal
        log={selectedLog}
        loading={modalLoading}
        error={modalError}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
};
