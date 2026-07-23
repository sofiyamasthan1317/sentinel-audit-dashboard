import React, { useState } from 'react';
import { uploadJsonLogsApi, uploadCsvLogsApi } from '../services/api';
import { X, UploadCloud, FileText, CheckCircle2, AlertTriangle, Code, Loader2 } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [tab, setTab] = useState<'csv' | 'json'>('csv');
  const [file, setFile] = useState<File | null>(null);
  const [jsonText, setJsonText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setFile(null);
    setJsonText('');
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const handleCsvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Please select a CSV file to upload.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await uploadCsvLogsApi(file);
      if (res.success) {
        setSuccessMsg(`Successfully imported ${res.data.insertedCount} audit logs!`);
        setTimeout(() => {
          onSuccess();
          onClose();
          handleReset();
        }, 1500);
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Failed to upload CSV file.');
    } finally {
      setLoading(false);
    }
  };

  const handleJsonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonText.trim()) {
      setErrorMsg('Please provide JSON array content.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const parsed = JSON.parse(jsonText);
      const logsArray = Array.isArray(parsed) ? parsed : [parsed];

      const res = await uploadJsonLogsApi(logsArray);
      if (res.success) {
        setSuccessMsg(`Successfully imported ${res.data.insertedCount} audit logs!`);
        setTimeout(() => {
          onSuccess();
          onClose();
          handleReset();
        }, 1500);
      }
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        setErrorMsg('Invalid JSON format. Please check your syntax syntax.');
      } else {
        setErrorMsg(err?.response?.data?.message || 'Failed to upload JSON logs.');
      }
    } finally {
      setLoading(false);
    }
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={() => {
        onClose();
        handleReset();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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
            <UploadCloud size={22} color="var(--primary)" />
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>Ingest Audit Logs</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Bulk upload security logs via CSV or JSON
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              handleReset();
            }}
            style={{
              padding: '0.4rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-main)' }}>
          <button
            onClick={() => {
              setTab('csv');
              setErrorMsg(null);
            }}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              borderBottom: tab === 'csv' ? '2px solid var(--primary)' : 'none',
              backgroundColor: tab === 'csv' ? 'var(--bg-surface)' : 'transparent',
              color: tab === 'csv' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <FileText size={16} />
            <span>CSV Upload</span>
          </button>

          <button
            onClick={() => {
              setTab('json');
              setErrorMsg(null);
            }}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              borderBottom: tab === 'json' ? '2px solid var(--primary)' : 'none',
              backgroundColor: tab === 'json' ? 'var(--bg-surface)' : 'transparent',
              color: tab === 'json' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <Code size={16} />
            <span>JSON Bulk Upload</span>
          </button>
        </div>

        {/* Body Form */}
        <div style={{ padding: '1.5rem' }}>
          {successMsg && (
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--status-success-bg)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                color: 'var(--status-success-text)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
              }}
            >
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--severity-critical-bg)',
                border: '1px solid var(--severity-critical-border)',
                color: 'var(--severity-critical-text)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
              }}
            >
              <AlertTriangle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {tab === 'csv' ? (
            <form onSubmit={handleCsvSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div
                style={{
                  border: '2px dashed var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-main)',
                  cursor: 'pointer',
                }}
                onClick={() => document.getElementById('csvInput')?.click()}
              >
                <input
                  id="csvInput"
                  type="file"
                  accept=".csv"
                  style={{ display: 'none' }}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <UploadCloud size={36} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {file ? file.name : 'Click to select CSV file'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: 1.4 }}>
                  <strong>Required CSV Headers:</strong><br />
                  <span className="mono" style={{ color: 'var(--accent-cyan)' }}>
                    actor, role, action, resource, resourceType, ipAddress, region, severity, status, timestamp
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    handleReset();
                  }}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || !file}
                  style={{
                    padding: '0.65rem 1.5rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary)',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 600,
                    cursor: loading || !file ? 'not-allowed' : 'pointer',
                    opacity: loading || !file ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  <span>{loading ? 'Uploading...' : 'Upload CSV'}</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleJsonSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  JSON LOG ARRAY PAYLOAD EXAMPLE
                </label>
                <textarea
                  rows={8}
                  placeholder={`[\n  {\n    "actor": "admin@security.io",\n    "role": "Admin",\n    "action": "POLICY_UPDATE",\n    "resource": "iam-policy-v2",\n    "resourceType": "IAM",\n    "ipAddress": "192.168.1.100",\n    "region": "us-east-1",\n    "severity": "HIGH",\n    "status": "success",\n    "timestamp": "${new Date().toISOString()}"\n  }\n]`}
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                  className="mono"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    handleReset();
                  }}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || !jsonText.trim()}
                  style={{
                    padding: '0.65rem 1.5rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary)',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 600,
                    cursor: loading || !jsonText.trim() ? 'not-allowed' : 'pointer',
                    opacity: loading || !jsonText.trim() ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  <span>{loading ? 'Uploading...' : 'Upload JSON'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
