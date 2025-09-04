import { Announcement } from "../models/Announcement.js";

// List all announcements (newest first)
export const listAnnouncements = async (req, res) => {
  try {
    const items = await Announcement.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create announcement (faculty only)
export const createAnnouncement = async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) return res.status(400).json({ message: "Title and body are required" });
    const item = await Announcement.create({ title, body, createdBy: req.user._id });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete announcement (faculty only)
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Announcement.findById(id);
    if (!item) return res.status(404).json({ message: "Announcement not found" });
    await item.deleteOne();
    res.json({ message: "Announcement deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


