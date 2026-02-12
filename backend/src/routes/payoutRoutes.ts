import express from "express";
import { requireAuth } from "../middleware/authMiddleware.ts";
import { getPayoutPreview } from "../controllers/payoutPreviewController.ts";
import { executePayout } from "../controllers/payoutExecutionController.ts";
import { getMypayouts } from "../controllers/payoutHistoryController.ts";

const router = express.Router();

router.get("/me/payout-preview", requireAuth, getPayoutPreview);
router.post("/me/withdraw", requireAuth, executePayout);
router.get("/me/payouts", requireAuth, getMypayouts);

export default router;