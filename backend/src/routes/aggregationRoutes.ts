import express from "express";
import { aggregateTaskResults } from "../controllers/aggregationController.ts";
import { requireAuth } from "../middleware/authMiddleware.ts";

const router = express.Router();

router.post("/task/:taskId/aggregate", requireAuth, aggregateTaskResults);

export default router;