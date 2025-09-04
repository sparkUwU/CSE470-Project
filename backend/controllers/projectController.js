import { ProjectIdea } from "../models/ProjectIdea.js";

// Submit new project idea
export const submitProject = async (req, res) => {
  try {
    const { title, description, features } = req.body;
    // prevent multiple active approved projects
    const existingApproved = await ProjectIdea.findOne({ student: req.user._id, approved: true });
    if (existingApproved) {
      return res.status(400).json({ message: "You already have an approved project. Only one active project is allowed." });
    }
    const project = await ProjectIdea.create({
      student: req.user._id,
      title,
      description,
      features
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all projects for current student
export const getMyProjects = async (req, res) => {
  try {
    const projects = await ProjectIdea.find({ student: req.user._id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update project (title, description, features)
export const updateProject = async (req, res) => {
  try {
    const project = await ProjectIdea.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.student.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not allowed" });

    const { title, description, features } = req.body;
    if (typeof title !== "undefined") project.title = title;
    if (typeof description !== "undefined") project.description = description;
    if (Array.isArray(features)) project.features = features;
    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const project = await ProjectIdea.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.student.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not allowed" });

    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get all projects (faculty)
export const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectIdea.find().populate("student", "name studentID email");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve or reject project
export const approveProject = async (req, res) => {
  try {
    const { approved } = req.body; // true or false
    const project = await ProjectIdea.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (approved) {
      // Approve the project
      project.approved = true;
      await project.save();
      res.json(project);
    } else {
      // Reject and delete the project
      await project.deleteOne();
      res.json({ message: "Project rejected and deleted", deleted: true });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add faculty feedback
export const addFeedback = async (req, res) => {
  try {
    const { feedback, marks } = req.body;
    const project = await ProjectIdea.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.facultyFeedback = feedback;
    if (marks !== undefined) project.marks = Math.max(0, Math.min(20, Number(marks)));
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Submit final project link (student)
export const submitFinal = async (req, res) => {
  try {
    const { finalLink } = req.body;
    const project = await ProjectIdea.findOne({ student: req.user._id, approved: true });
    if (!project) return res.status(404).json({ message: "No approved project found" });

    project.finalLink = finalLink;
    project.finalSubmitted = true;
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get final marks for all students (faculty) or for current student
export const getFinalMarks = async (req, res) => {
  try {
    let projects;
    if (req.user.role === "faculty") {
      projects = await ProjectIdea.find().populate("student", "name studentID");
    } else {
      // Per requirement: final marks visible to all students
      projects = await ProjectIdea.find().populate("student", "name studentID");
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle feature completion by index for a project (student only, own project)
export const toggleFeatureCompletion = async (req, res) => {
  try {
    const { id, index } = { id: req.params.id, index: parseInt(req.params.index, 10) };
    const { completed } = req.body;
    const project = await ProjectIdea.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.student.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not allowed" });
    if (!Array.isArray(project.features) || index < 0 || index >= project.features.length) {
      return res.status(400).json({ message: "Invalid feature index" });
    }
    project.features[index].completed = Boolean(completed);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

