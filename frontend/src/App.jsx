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
          <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">CSE470 Project Website</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">Welcome to the project management system</p>
              <div className="space-x-4">
                <Link to="/login" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Login</Link>
                <Link to="/signup" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">Signup</Link>
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
