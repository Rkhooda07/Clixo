import Express from "express";
import { settleTaskRewards } from "../controllers/rewardSettlementController.ts";

const router = Express.Router();

router.post("/task/:taskId/rewards/settle", settleTaskRewards);

export default router;