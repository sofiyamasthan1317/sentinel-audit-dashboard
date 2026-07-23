import React from 'react';
import { ShieldAlert, LayoutDashboard, FileText, UploadCloud, Activity, Database } from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'logs' | 'upload';
  setActiveTab: (tab: 'dashboard' | 'logs' | 'upload') => void;
  onOpenUpload: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
}) => {
  return (
    <aside
      className="sidebar-container"
      style={{
        width: '260px',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          height: '64px',
          padding: '0 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ShieldAlert size={20} color="var(--primary)" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>
            Sentinel<span style={{ color: 'var(--primary)' }}>Audit</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }} className="mono">
            v1.0.0 • SIEM LOGS
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Overview
        </div>

        <button
          onClick={() => setActiveTab('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: activeTab === 'dashboard' ? 'var(--bg-elevated)' : 'transparent',
            color: activeTab === 'dashboard' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'dashboard' ? 600 : 400,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all var(--transition-fast)',
          }}
        >
          <LayoutDashboard size={18} color={activeTab === 'dashboard' ? 'var(--primary)' : 'currentColor'} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: activeTab === 'logs' ? 'var(--bg-elevated)' : 'transparent',
            color: activeTab === 'logs' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'logs' ? 600 : 400,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all var(--transition-fast)',
          }}
        >
          <FileText size={18} color={activeTab === 'logs' ? 'var(--primary)' : 'currentColor'} />
          <span>Audit Logs</span>
        </button>

        <div style={{ margin: '1rem 0 0.5rem', padding: '0 0.75rem', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Ingestion
        </div>

        <button
          onClick={onOpenUpload}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all var(--transition-fast)',
          }}
        >
          <UploadCloud size={18} color="var(--accent-cyan)" />
          <span>Upload Logs</span>
        </button>
      </nav>

      {/* Footer metadata */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <Activity size={14} color="var(--status-success-text)" />
          <span>System Healthy</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <Database size={14} />
          <span>MongoDB Atlas</span>
        </div>
      </div>
    </aside>
  );
};
