import express from "express";
import { searchStudents, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", protect, searchStudents);
router.put("/me", protect, updateProfile);

export default router;
