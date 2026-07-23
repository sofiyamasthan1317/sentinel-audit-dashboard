export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type LogStatus = 'success' | 'failure' | 'warning' | 'pending';

export interface IAuditLog {
  _id: string;
  actor: string;
  role: string;
  action: string;
  resource: string;
  resourceType: string;
  ipAddress: string;
  region: string;
  severity: SeverityLevel | string;
  status: LogStatus | string;
  timestamp: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ILogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  severity?: string;
  status?: string;
  role?: string;
  action?: string;
  region?: string;
  resourceType?: string;
  sortBy?: 'timestamp' | 'actor' | 'role' | 'action' | 'severity' | 'status' | 'region';
  sortOrder?: 'asc' | 'desc';
}

export interface IStatItem {
  _id: string;
  count: number;
}

export interface IAuditLogStats {
  totalLogs: number;
  severity: IStatItem[];
  status: IStatItem[];
  region: IStatItem[];
}

export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: IPagination;
}

export interface IBulkUploadResponse {
  success: boolean;
  message: string;
  data: {
    insertedCount: number;
  };
}
