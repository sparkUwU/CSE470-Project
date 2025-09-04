import mongoose from "mongoose";

const projectIdeaSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  features: [{ name: String, completed: { type: Boolean, default: false } }],
  submissionDate: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
  finalSubmitted: { type: Boolean, default: false },
  facultyFeedback: { type: String, default: "" },
  marks: { type: Number, default: 0 },
  finalLink: { type: String, default: "" }
}, { timestamps: true });

export const ProjectIdea = mongoose.model("ProjectIdea", projectIdeaSchema);
