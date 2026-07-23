import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { UploadModal } from './components/UploadModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs'>('dashboard');
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="app-shell">
      {/* Fixed 260px Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'upload') {
            setIsUploadOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* Flexible App Main Container */}
      <div className="app-main">
        {/* Top Header */}
        <Header
          onRefresh={() => setRefreshKey((prev) => prev + 1)}
          onOpenUpload={() => setIsUploadOpen(true)}
        />

        {/* Dynamic Page Views */}
        <main className="main-content">
          {activeTab === 'dashboard' ? (
            <DashboardPage
              key={`dashboard-${refreshKey}`}
              onNavigateToAuditLogs={() => setActiveTab('logs')}
            />
          ) : (
            <AuditLogsPage key={`logs-${refreshKey}`} />
          )}
        </main>
      </div>

      {/* Bulk Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default App;