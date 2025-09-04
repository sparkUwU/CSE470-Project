import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// Protect routes
export const protect = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Admin-only
export const adminOnly = (req, res, next) => {
    if (req.user.role !== "faculty") {
        return res.status(403).json({ message: "Access denied" });
    }
    next();
};
