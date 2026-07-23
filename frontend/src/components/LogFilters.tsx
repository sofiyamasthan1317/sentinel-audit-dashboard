import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import type { ILogQueryParams } from '../types/log.types';

interface LogFiltersProps {
  filters: ILogQueryParams;
  onFilterChange: (newFilters: Partial<ILogQueryParams>) => void;
  onResetFilters: () => void;
}

export const LogFilters: React.FC<LogFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const activeCount = [
    filters.search,
    filters.severity,
    filters.status,
    filters.role,
    filters.action,
    filters.region,
    filters.resourceType,
  ].filter((v) => v && v !== 'ALL').length;

  return (
    <div
      style={{
        padding: 'var(--space-5)',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* 1. Full-Width Search Input */}
      <div style={{ position: 'relative', width: '100%' }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          className="input-field"
          placeholder="Search logs by actor, action, resource, or IP address..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
          style={{ paddingLeft: '36px', paddingRight: filters.search ? '36px' : '12px' }}
        />
        {filters.search && (
          <button
            onClick={() => onFilterChange({ search: '', page: 1 })}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* 2. Responsive 3-Column Filter Dropdowns */}
      <div className="filters-grid">
        {/* Severity Select */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Severity
          </label>
          <select
            className="select-field"
            value={filters.severity || 'ALL'}
            onChange={(e) => onFilterChange({ severity: e.target.value === 'ALL' ? undefined : e.target.value, page: 1 })}
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
            <option value="INFO">INFO</option>
          </select>
        </div>

        {/* Status Select */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Status
          </label>
          <select
            className="select-field"
            value={filters.status || 'ALL'}
            onChange={(e) => onFilterChange({ status: e.target.value === 'ALL' ? undefined : e.target.value, page: 1 })}
          >
            <option value="ALL">All Statuses</option>
            <option value="success">success</option>
            <option value="failure">failure</option>
            <option value="warning">warning</option>
            <option value="pending">pending</option>
          </select>
        </div>

        {/* Sort By Select */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Sort By
          </label>
          <select
            className="select-field"
            value={filters.sortBy || 'timestamp'}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any, page: 1 })}
          >
            <option value="timestamp">Timestamp</option>
            <option value="actor">Actor</option>
            <option value="role">Role</option>
            <option value="action">Action</option>
            <option value="severity">Severity</option>
            <option value="status">Status</option>
            <option value="region">Region</option>
          </select>
        </div>

        {/* Role Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Role
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Admin, Developer"
            value={filters.role || ''}
            onChange={(e) => onFilterChange({ role: e.target.value || undefined, page: 1 })}
          />
        </div>

        {/* Action Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Action
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. LOGIN, DELETE_USER"
            value={filters.action || ''}
            onChange={(e) => onFilterChange({ action: e.target.value || undefined, page: 1 })}
          />
        </div>

        {/* Sort Order Select */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Sort Order
          </label>
          <select
            className="select-field"
            value={filters.sortOrder || 'desc'}
            onChange={(e) => onFilterChange({ sortOrder: e.target.value as any, page: 1 })}
          >
            <option value="desc">Descending (Newest / High)</option>
            <option value="asc">Ascending (Oldest / Low)</option>
          </select>
        </div>

        {/* Region Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Region
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. us-east-1, eu-west-1"
            value={filters.region || ''}
            onChange={(e) => onFilterChange({ region: e.target.value || undefined, page: 1 })}
          />
        </div>

        {/* Resource Type Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Resource Type
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. DATABASE, S3_BUCKET"
            value={filters.resourceType || ''}
            onChange={(e) => onFilterChange({ resourceType: e.target.value || undefined, page: 1 })}
          />
        </div>

        {/* Clear Filters Action */}
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          {activeCount > 0 ? (
            <button
              onClick={onResetFilters}
              style={{
                width: '100%',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: 'var(--severity-critical-text)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <RotateCcw size={14} />
              <span>Clear Filters ({activeCount})</span>
            </button>
          ) : (
            <div style={{ height: '38px', display: 'flex', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              No active filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
