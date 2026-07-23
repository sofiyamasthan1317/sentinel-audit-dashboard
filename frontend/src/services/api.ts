import axios from 'axios';
import type {
  IAuditLog,
  IAuditLogStats,
  ILogQueryParams,
  IApiResponse,
  IBulkUploadResponse,
} from '../types/log.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

/**
 * Fetch logs with server-side pagination, search, filtering, and sorting
 */
export const fetchLogsApi = async (
  params: ILogQueryParams = {}
): Promise<IApiResponse<IAuditLog[]>> => {
  const cleanParams: Record<string, any> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'ALL') {
      cleanParams[key] = value;
    }
  });

  const response = await apiClient.get<IApiResponse<IAuditLog[]>>('/logs', {
    params: cleanParams,
  });
  return response.data;
};

/**
 * Fetch detailed audit log by ID
 */
export const fetchLogByIdApi = async (id: string): Promise<IApiResponse<IAuditLog>> => {
  const response = await apiClient.get<IApiResponse<IAuditLog>>(`/logs/${id}`);
  return response.data;
};

/**
 * Fetch dashboard aggregated statistics
 */
export const fetchLogStatsApi = async (): Promise<IApiResponse<IAuditLogStats>> => {
  const response = await apiClient.get<IApiResponse<IAuditLogStats>>('/logs/stats');
  return response.data;
};

/**
 * Bulk upload JSON array of logs
 */
export const uploadJsonLogsApi = async (
  logs: Omit<IAuditLog, '_id' | 'createdAt' | 'updatedAt'>[]
): Promise<IBulkUploadResponse> => {
  const response = await apiClient.post<IBulkUploadResponse>('/logs/bulk', { logs });
  return response.data;
};

/**
 * Upload CSV file containing audit logs
 */
export const uploadCsvLogsApi = async (file: File): Promise<IBulkUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<IBulkUploadResponse>('/logs/upload-csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
