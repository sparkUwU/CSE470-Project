import User, { User as NamedUser } from "../models/User.js";

// Search students by name or studentID
export const searchStudents = async (req, res) => {
  try {
    const { query } = req.query; // ?query=someText
    if (!query) return res.status(400).json({ message: "Query is required" });

    const students = await NamedUser.find({
      role: "student",
      $or: [
        { name: { $regex: query, $options: "i" } },
        { studentID: { $regex: query, $options: "i" } },
      ],
    }).select("name studentID email");

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update current user's profile (students and faculty)
export const updateProfile = async (req, res) => {
  try {
    const { name, studentID, email } = req.body;
    if (req.user.role !== "student") {
      const updated = await NamedUser.findByIdAndUpdate(
        req.user._id,
        { name, email },
        { new: true, runValidators: true }
      ).select("-password");
      return res.json(updated);
    }

    const updated = await NamedUser.findByIdAndUpdate(
      req.user._id,
      { name, email, studentID },
      { new: true, runValidators: true }
    ).select("-password");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
