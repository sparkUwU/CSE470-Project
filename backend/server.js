import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";


dotenv.config();
const app = express();
connectDB(); // connect to MongoDB

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true
}));


// Test route
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});


// Routes
app.use("/api/auth", authRoutes); // auth routes
app.use("/api/projects", projectRoutes); // project routes
app.use("/api/users", userRoutes); // user routes
app.use("/api/announcements", announcementRoutes); // announcement routes



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
