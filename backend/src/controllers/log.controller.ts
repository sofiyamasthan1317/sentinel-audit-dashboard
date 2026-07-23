import { Request, Response } from "express";
import { Types } from "mongoose";
import {
  createBulkLogs,
  getLogs,
  getLogById,
  getLogStats,
  createLogsFromCsv,
} from "../services/log.service.js";
import {
  bulkUploadSchema,
  getLogsQuerySchema,
} from "../validators/log.validator.js";

export const uploadLogs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const validatedData = bulkUploadSchema.parse(req.body);

  const insertedLogs = await createBulkLogs(validatedData.logs);

  res.status(201).json({
    success: true,
    message: `${insertedLogs.length} logs uploaded successfully`,
    data: {
      insertedCount: insertedLogs.length,
    },
  });
};

export const fetchLogs = async (req: Request, res: Response): Promise<void> => {
  const validatedQuery = getLogsQuerySchema.parse(req.query);

  const result = await getLogs(validatedQuery);

  res.status(200).json({
    success: true,
    data: result.logs,
    pagination: result.pagination,
  });
};

export const fetchLogById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;

  if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid log ID",
    });

    return;
  }

  const log = await getLogById(id);

  if (!log) {
    res.status(404).json({
      success: false,
      message: "Log not found",
    });

    return;
  }

  res.status(200).json({
    success: true,
    data: log,
  });
};

export const fetchLogStats = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const stats = await getLogStats();

  res.status(200).json({
    success: true,
    data: stats,
  });
};

export const uploadCsvLogs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      message: "CSV file is required",
    });

    return;
  }

  const insertedLogs = await createLogsFromCsv(req.file.buffer);

  res.status(201).json({
    success: true,
    message: `${insertedLogs.length} logs uploaded successfully`,
    data: {
      insertedCount: insertedLogs.length,
    },
  });
};
