/**
 * Formatting utilities for dates, numbers, and badges
 */

export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString(undefined, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const formatIsoDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toISOString();
};

export const formatNumber = (num: number): string => {
  return (num || 0).toLocaleString();
};

export const calculatePercentage = (count: number, total: number): string => {
  if (!total || total === 0) return '0.0';
  return ((count / total) * 100).toFixed(1);
};
