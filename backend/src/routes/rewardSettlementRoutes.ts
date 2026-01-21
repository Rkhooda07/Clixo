import Express from "express";
import { settleTaskRewards } from "../controllers/rewardSettlementController.ts";
import { requireAuth } from "../middleware/authMiddleware.ts";

const router = Express.Router();

router.post("/task/:taskId/rewards/settle", requireAuth, settleTaskRewards);

export default router;