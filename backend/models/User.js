import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  studentID: { type: String, default: null },
  role: { type: String, enum: ["student", "faculty"], required: true }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export { User };
export default User;
