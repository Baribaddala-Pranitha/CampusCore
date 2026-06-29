import { Router } from "express";
import { signup, verifyEmail, login, resendVerification } from "../controllers/auth.controller.js";
import { validateSignup, validateLogin, validateResendVerification } from "../middleware/validate.js";

const router = Router();

router.post("/signup", validateSignup, signup);
router.get("/verify/:token", verifyEmail);
router.post("/login", validateLogin, login);
router.post("/resend-verification", validateResendVerification, resendVerification);

export default router;
