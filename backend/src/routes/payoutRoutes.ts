import express from "express";
import { requireAuth } from "../middleware/authMiddleware.ts";
import { getPayoutPreview } from "../controllers/payoutPreviewController.ts";
import { executePayout } from "../controllers/payoutExecutionController.ts";

const router = express.Router();

router.get("/me/payout-preview", requireAuth, getPayoutPreview);
router.post("/me/withdraw", requireAuth, executePayout);

export default router;