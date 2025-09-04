import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/User.js";

dotenv.config();

const seedFaculty = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if faculty already exists
    const existingFaculty = await User.findOne({ role: "faculty" });
    if (existingFaculty) {
      console.log("✅ Faculty user already exists");
      process.exit(0);
    }

    // Create faculty user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const faculty = await User.create({
      name: "Faculty Admin",
      email: "faculty@cse470.com",
      password: hashedPassword,
      role: "faculty"
    });

    console.log("✅ Faculty user created successfully:");
    console.log(`   Email: ${faculty.email}`);
    console.log(`   Password: admin123`);
    console.log(`   Role: ${faculty.role}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding faculty:", error);
    process.exit(1);
  }
};

seedFaculty();
