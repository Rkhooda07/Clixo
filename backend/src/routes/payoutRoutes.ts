import express from "express";
import { requireAuth } from "../middleware/authMiddleware.ts";
import { getPayoutPreview } from "../controllers/payoutPreviewController.ts";

const router = express.Router();

router.get("/me/payout-preview", requireAuth, getPayoutPreview);

export default router;