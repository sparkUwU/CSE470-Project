import { useState, useEffect } from "react";
import axios from "axios";

export default function StudentDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true });
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Faculty Dashboard Content
  if (user.role === "faculty") {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Faculty Dashboard</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Project Management</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Review and approve student project ideas, provide feedback, and assign marks.
            </p>
            <a 
              href="/admin" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Manage Projects
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Student Evaluation</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              View final submissions, evaluate completed projects, and assign final grades.
            </p>
            <a 
              href="/final-marks" 
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              View Final Marks
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Announcements</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create and manage announcements to keep students informed about important updates.
            </p>
            <a 
              href="/announcements" 
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              Manage Announcements
            </a>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <a 
              href="/admin" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              📋 Review Projects
            </a>
            <a 
              href="/final-marks" 
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              📊 Evaluate Submissions
            </a>
            <a 
              href="/announcements" 
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              📢 Post Announcements
            </a>
            <a 
              href="/search" 
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              🔍 Search Students
            </a>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Welcome, {user.name}!</h3>
          <p className="text-gray-600 dark:text-gray-400">
            As a faculty member, you have access to comprehensive tools for managing student projects, 
            providing feedback, and evaluating final submissions. Use the quick action buttons above 
            to navigate to different sections of the system.
          </p>
        </div>
      </div>
    );
  }

  // Student Dashboard Content
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Student Dashboard</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Project Submission</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Submit your project ideas, track progress, and manage your features.
          </p>
          <a 
            href="/submit" 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Submit Project
          </a>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Final Submission</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Submit your final project link once your project is approved.
          </p>
          <a 
            href="/final-submit" 
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Submit Final
          </a>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">View Results</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Check your final marks and faculty feedback on your project.
          </p>
          <a 
            href="/final-marks" 
            className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
          >
            View Marks
          </a>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <a 
            href="/submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            💡 Submit Idea
          </a>
          <a 
            href="/final-submit" 
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            📤 Final Submit
          </a>
          <a 
            href="/final-marks" 
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            📊 View Marks
          </a>
          <a 
            href="/announcements" 
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            📢 Announcements
          </a>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Welcome, {user.name}!</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to your student dashboard! Here you can manage your project submissions, 
          track your progress, and view your final results. Use the quick action buttons above 
          to navigate to different sections of the system.
        </p>
      </div>
    </div>
  );
}