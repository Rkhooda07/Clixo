import Express from "express";
import { previewTaskRewards } from "../controllers/rewardController.ts";

const router = Express.Router();

router.post("/task/:taskId/rewards/preview", previewTaskRewards);

export default router;