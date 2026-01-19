import Express from "express";
import { createSiweChallenge, verifySiweSignature } from "../controllers/authController.ts";

const router = Express.Router();

router.post("/auth/challenge", createSiweChallenge);
router.post("/auth/verify", verifySiweSignature);

export default router;