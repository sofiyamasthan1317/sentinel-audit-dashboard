import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import logRoutes from "./routes/log.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(express.json({ limit: "10mb" }));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "SentinelAudit API is running successfully.",
    description:
      "A full-stack audit log monitoring and security event investigation API.",
    endpoints: {
      getLogs: "GET /api/logs",
      getLogStatistics: "GET /api/logs/stats",
      getLogById: "GET /api/logs/:id",
      bulkJsonUpload: "POST /api/logs/bulk",
      bulkCsvUpload: "POST /api/logs/bulk/csv",
    },
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "SentinelAudit API is healthy and running.",
  });
});

app.use("/api/logs", logRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorMiddleware);

export default app;