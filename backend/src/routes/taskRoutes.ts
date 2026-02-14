import express from "express";
import { createTask } from "../controllers/taskController.ts";
import { fundTask } from "../controllers/fundingController.ts";

const router = express.Router();

// POST /api/tasks -> create a new task
router.post("/", createTask);

// Fund a task
router.post("/:id/fund", fundTask);

export default router;