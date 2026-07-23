import { z } from "zod";

export const auditLogSchema = z.object({
  actor: z.string().min(1, "Actor is required"),
  role: z.string().min(1, "Role is required"),
  action: z.string().min(1, "Action is required"),
  resource: z.string().min(1, "Resource is required"),
  resourceType: z.string().min(1, "Resource type is required"),
  ipAddress: z.string().min(1, "IP address is required"),
  region: z.string().min(1, "Region is required"),
  severity: z.string().min(1, "Severity is required"),
  status: z.string().min(1, "Status is required"),
  timestamp: z.coerce.date(),
});

export const bulkUploadSchema = z.object({
  logs: z
    .array(auditLogSchema)
    .min(1, "At least one log is required")
    .max(10000, "Maximum 10,000 logs can be uploaded at once"),
});

export const getLogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  search: z.string().optional(),
  severity: z.string().optional(),
  status: z.string().optional(),
  role: z.string().optional(),
  action: z.string().optional(),
  region: z.string().optional(),
  resourceType: z.string().optional(),
  sortBy: z
    .enum([
      "timestamp",
      "actor",
      "role",
      "action",
      "severity",
      "status",
      "region",
    ])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});