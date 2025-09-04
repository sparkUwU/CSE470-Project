import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { listAnnouncements, createAnnouncement, deleteAnnouncement } from "../controllers/announcementController.js";

const router = express.Router();

router.get("/", protect, listAnnouncements);
router.post("/", protect, adminOnly, createAnnouncement);
router.delete("/:id", protect, adminOnly, deleteAnnouncement);

export default router;


