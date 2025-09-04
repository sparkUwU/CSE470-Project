import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import FinalSubmission from "./pages/FinalSubmission";
import FinalMarks from "./pages/FinalMarks";
import ProjectSubmission from "./pages/ProjectSubmission";
import Announcements from "./pages/Announcements";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)", background: "var(--color-bg)" }}>
            <div className="container" style={{ textAlign: "center" }}>
              <div style={{ margin: "0 auto", maxWidth: "42rem", padding: "2rem", borderRadius: "1rem" }} className="app-surface">
                <h1 style={{ fontSize: "2.25rem", lineHeight: 1.2, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--color-ink)" }}>CSE470 Project Website</h1>
                <p style={{ marginTop: "0.75rem", color: "var(--color-ink-muted)" }}>Welcome to the project management system</p>
                <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                  <Link to="/login" className="btn btn-outline">Login</Link>
                  <Link to="/signup" className="btn btn-primary">Signup</Link>
                </div>
              </div>
            </div>
          </div>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <FacultyDashboard />
          </ProtectedRoute>
        } />
        <Route path="/final-submit" element={
          <ProtectedRoute>
            <FinalSubmission />
          </ProtectedRoute>
        } />

        <Route path="/final-marks" element={
          <ProtectedRoute>
            <FinalMarks />
          </ProtectedRoute>
        } />

        <Route path="/submit" element={
          <ProtectedRoute studentOnly={true}>
            <ProjectSubmission />
          </ProtectedRoute>
        } />

        <Route path="/announcements" element={
          <ProtectedRoute>
            <Announcements />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
