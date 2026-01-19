import Express from "express";
import { createSiweChallenge } from "../controllers/authController.ts";

const router = Express.Router();

router.post("/auth/challenge", createSiweChallenge);

export default router;