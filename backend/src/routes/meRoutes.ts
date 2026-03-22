import express from "express";
import {
  getMyTasks,
  getMySubmissions,
  getMyEarnings,
  getMyFundingHistory,
} from "../controllers/meController.ts";
import { requireAuth } from "../middleware/authMiddleware.ts";



const router = express.Router();

router.get("/tasks", requireAuth, getMyTasks);
router.get("/submissions", requireAuth, getMySubmissions);
router.get("/earnings", requireAuth, getMyEarnings);
router.get("/funding-history", requireAuth, getMyFundingHistory);

export default router;
