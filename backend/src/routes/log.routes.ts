import { Router } from "express";
import {
  uploadLogs,
  fetchLogs,
  fetchLogById,
  fetchLogStats,
  uploadCsvLogs,
} from "../controllers/log.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.post("/bulk", asyncHandler(uploadLogs));

router.post("/upload-csv", upload.single("file"), asyncHandler(uploadCsvLogs));

router.get("/stats", asyncHandler(fetchLogStats));

router.get("/", asyncHandler(fetchLogs));

router.get("/:id", asyncHandler(fetchLogById));

export default router;
