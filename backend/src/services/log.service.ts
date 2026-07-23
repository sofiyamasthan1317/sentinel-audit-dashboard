import AuditLog from "../models/log.model.js";
import { IAuditLogInput, IGetLogsQuery } from "../types/log.types.js";
import { parse } from "csv-parse/sync";
import { bulkUploadSchema } from "../validators/log.validator.js";

export const createBulkLogs = async (logs: IAuditLogInput[]) => {
  const insertedLogs = await AuditLog.insertMany(logs);

  return insertedLogs;
};

export const getLogs = async (query: IGetLogsQuery) => {
  const {
    page = 1,
    limit = 20,
    search,
    severity,
    status,
    role,
    action,
    region,
    resourceType,
    sortBy = "timestamp",
    sortOrder = "desc",
  } = query;

  const pageNumber = Math.max(page, 1);
  const limitNumber = Math.min(Math.max(limit, 1), 100);
  const skip = (pageNumber - 1) * limitNumber;

  const filter: Record<string, unknown> = {};

  if (search) {
    filter.$or = [
      { actor: { $regex: search, $options: "i" } },
      { action: { $regex: search, $options: "i" } },
      { resource: { $regex: search, $options: "i" } },
      { ipAddress: { $regex: search, $options: "i" } },
    ];
  }

  if (severity) filter.severity = severity;
  if (status) filter.status = status;
  if (role) filter.role = role;
  if (action) filter.action = action;
  if (region) filter.region = region;
  if (resourceType) filter.resourceType = resourceType;

  const sort: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };

  const [logs, total] = await Promise.all([
    AuditLog.find(filter).sort(sort).skip(skip).limit(limitNumber).lean(),

    AuditLog.countDocuments(filter),
  ]);

  return {
    logs,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

export const getLogById = async (id: string) => {
  const log = await AuditLog.findById(id).lean();

  return log;
};

export const getLogStats = async () => {
  const [totalLogs, severityStats, statusStats, regionStats] =
    await Promise.all([
      AuditLog.countDocuments(),

      AuditLog.aggregate([
        {
          $group: {
            _id: "$severity",
            count: { $sum: 1 },
          },
        },
      ]),

      AuditLog.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      AuditLog.aggregate([
        {
          $group: {
            _id: "$region",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

  return {
    totalLogs,
    severity: severityStats,
    status: statusStats,
    region: regionStats,
  };
};

export const createLogsFromCsv = async (fileBuffer: Buffer) => {
  const records = parse(fileBuffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const validatedLogs = bulkUploadSchema.parse({
    logs: records,
  });

  const insertedLogs = await AuditLog.insertMany(validatedLogs.logs);

  return insertedLogs;
};
