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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: "var(--color-primary)" }}></div>
          <p style={{ color: "var(--color-ink-muted)" }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Faculty Dashboard Content
  if (user.role === "faculty") {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--color-ink)" }}>Faculty Dashboard</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-lg border shadow-sm app-surface">
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--color-ink)" }}>Project Management</h3>
            <p style={{ color: "var(--color-ink-muted)", marginBottom: "1rem" }}>
              Review and approve student project ideas, provide feedback, and assign marks.
            </p>
            <a 
              href="/admin" 
              className="btn btn-primary"
            >
              Manage Projects
            </a>
          </div>

          <div className="p-6 rounded-lg border shadow-sm app-surface">
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--color-ink)" }}>Student Evaluation</h3>
            <p style={{ color: "var(--color-ink-muted)", marginBottom: "1rem" }}>
              View final submissions, evaluate completed projects, and assign final grades.
            </p>
            <a 
              href="/final-marks" 
              className="btn btn-outline"
            >
              View Final Marks
            </a>
          </div>

          <div className="p-6 rounded-lg border shadow-sm app-surface">
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--color-ink)" }}>Announcements</h3>
            <p style={{ color: "var(--color-ink-muted)", marginBottom: "1rem" }}>
              Create and manage announcements to keep students informed about important updates.
            </p>
            <a 
              href="/announcements" 
              className="btn btn-outline"
            >
              Manage Announcements
            </a>
          </div>
        </div>

        <div className="p-6 rounded-lg border app-surface">
          <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--color-ink)" }}>Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <a 
              href="/admin" 
              className="btn btn-primary"
            >
              📋 Review Projects
            </a>
            <a 
              href="/final-marks" 
              className="btn btn-outline"
            >
              📊 Evaluate Submissions
            </a>
            <a 
              href="/announcements" 
              className="btn btn-outline"
            >
              📢 Post Announcements
            </a>
            <a 
              href="/search" 
              className="btn btn-outline"
            >
              🔍 Search Students
            </a>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-lg border app-surface">
          <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--color-ink)" }}>Welcome, {user.name}!</h3>
          <p style={{ color: "var(--color-ink-muted)" }}>
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
      <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--color-ink)" }}>Student Dashboard</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-lg border shadow-sm app-surface">
          <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--color-ink)" }}>Project Submission</h3>
          <p style={{ color: "var(--color-ink-muted)", marginBottom: "1rem" }}>
            Submit your project ideas, track progress, and manage your features.
          </p>
          <a 
            href="/submit" 
            className="btn btn-primary"
          >
            Submit Project
          </a>
        </div>

        <div className="p-6 rounded-lg border shadow-sm app-surface">
          <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--color-ink)" }}>Final Submission</h3>
          <p style={{ color: "var(--color-ink-muted)", marginBottom: "1rem" }}>
            Submit your final project link once your project is approved.
          </p>
          <a 
            href="/final-submit" 
            className="btn btn-outline"
          >
            Submit Final
          </a>
        </div>

        <div className="p-6 rounded-lg border shadow-sm app-surface">
          <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--color-ink)" }}>View Results</h3>
          <p style={{ color: "var(--color-ink-muted)", marginBottom: "1rem" }}>
            Check your final marks and faculty feedback on your project.
          </p>
          <a 
            href="/final-marks" 
            className="btn btn-outline"
          >
            View Marks
          </a>
        </div>
      </div>

      <div className="p-6 rounded-lg border app-surface">
        <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--color-ink)" }}>Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <a 
            href="/submit" 
            className="btn btn-primary"
          >
            💡 Submit Idea
          </a>
          <a 
            href="/final-submit" 
            className="btn btn-outline"
          >
            📤 Final Submit
          </a>
          <a 
            href="/final-marks" 
            className="btn btn-outline"
          >
            📊 View Marks
          </a>
          <a 
            href="/announcements" 
            className="btn btn-outline"
          >
            📢 Announcements
          </a>
        </div>
      </div>

      <div className="mt-8 p-6 rounded-lg border app-surface">
        <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--color-ink)" }}>Welcome, {user.name}!</h3>
        <p style={{ color: "var(--color-ink-muted)" }}>
          Welcome to your student dashboard! Here you can manage your project submissions, 
          track your progress, and view your final results. Use the quick action buttons above 
          to navigate to different sections of the system.
        </p>
      </div>
    </div>
  );
}