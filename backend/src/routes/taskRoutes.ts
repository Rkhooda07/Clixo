import express from "express";
import { createTask } from "../controllers/taskController.ts";
import { fundTask } from "../controllers/fundingController.ts";
import { getTaskStats } from "../controllers/taskStatsController.ts";

const router = express.Router();

// POST /api/tasks -> create a new task
router.post("/", createTask);

// Fund a task
router.post("/:id/fund", fundTask);

// Check stats for a task
router.get("/:id/stats", getTaskStats);

export default router;