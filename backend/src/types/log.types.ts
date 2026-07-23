export interface IAuditLogInput {
  actor: string;
  role: string;
  action: string;
  resource: string;
  resourceType: string;
  ipAddress: string;
  region: string;
  severity: string;
  status: string;
  timestamp: Date;
}

export interface IGetLogsQuery {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  severity?: string | undefined;
  status?: string | undefined;
  role?: string | undefined;
  action?: string | undefined;
  region?: string | undefined;
  resourceType?: string | undefined;
  sortBy?:
    | "timestamp"
    | "actor"
    | "role"
    | "action"
    | "severity"
    | "status"
    | "region"
    | undefined;
  sortOrder?: "asc" | "desc" | undefined;
}