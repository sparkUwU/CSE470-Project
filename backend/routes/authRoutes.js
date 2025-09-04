import express from "express";
import { signup, login, logout, changePassword } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { getMe } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/change-password", protect, changePassword);

router.get("/me", protect, getMe); // Get current user

export default router;
