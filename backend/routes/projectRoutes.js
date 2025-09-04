import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/authMiddleware.js";
import {
  submitProject,
  getMyProjects,
  updateProject,
  deleteProject,
  getAllProjects,
  approveProject,
  addFeedback,
  submitFinal,
  getFinalMarks,
  toggleFeatureCompletion
} from "../controllers/projectController.js";
// removed unused imports



const router = express.Router();

// Specific routes first (before parameter routes)
router.post("/", protect, submitProject);
router.get("/", protect, getMyProjects);
router.get("/all", protect, adminOnly, getAllProjects);
router.get("/final-marks", protect, getFinalMarks);
router.put("/final", protect, submitFinal);
router.put("/approve/:id", protect, adminOnly, approveProject);
router.put("/feedback/:id", protect, adminOnly, addFeedback);

// Parameter routes last
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);
router.put("/:id/features/:index", protect, toggleFeatureCompletion);


export default router;
