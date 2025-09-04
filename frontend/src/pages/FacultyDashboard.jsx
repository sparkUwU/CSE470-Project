import { useEffect, useState } from "react";
import axios from "axios";

export default function FacultyDashboard() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState({});
  const [marks, setMarks] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/api/projects/all", { withCredentials: true });
        setProjects(res.data);
        setFilteredProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProjects(projects);
      return;
    }

    const filtered = projects.filter(project => {
      const studentName = project.student?.name?.toLowerCase() || "";
      const studentID = project.student?.studentID?.toLowerCase() || "";
      const projectTitle = project.title?.toLowerCase() || "";
      const projectDesc = project.description?.toLowerCase() || "";
      const query = searchQuery.toLowerCase();

      return studentName.includes(query) || 
             studentID.includes(query) || 
             projectTitle.includes(query) ||
             projectDesc.includes(query);
    });

    setFilteredProjects(filtered);
  }, [searchQuery, projects]);

  const handleApprove = async (id, approved) => {
    try {
      const res = await axios.put(`/api/projects/approve/${id}`, { approved }, { withCredentials: true });
      
      if (approved) {
        // Project was approved, update the list
        setProjects(projects.map(p => (p._id === id ? res.data : p)));
      } else {
        // Project was rejected and deleted, remove from list
        setProjects(projects.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error("Error handling project approval:", err);
    }
  };

  const handleFeedback = async (id) => {
    try {
      const res = await axios.put(`/api/projects/feedback/${id}`, { feedback: feedback[id], marks: marks[id] }, { withCredentials: true });
      setProjects(projects.map(p => (p._id === id ? res.data : p)));
      // Clear the form after successful submission
      setFeedback(prev => ({ ...prev, [id]: "" }));
      setMarks(prev => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error("Error submitting feedback:", err);
    }
  };

  const calculateProgress = (features) => {
    if (!features || features.length === 0) return 0;
    const completed = features.filter(f => f.completed).length;
    return Math.round((completed / features.length) * 100);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4" style={{ color: "var(--color-ink)" }}>Faculty Dashboard</h1>
      
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by student name, ID, project title, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-lg"
          style={{ border: "1px solid var(--color-surface)", background: "var(--color-bg)", color: "var(--color-ink)" }}
        />
      </div>

      {/* Results Count */}
      <div className="mb-4" style={{ color: "var(--color-ink-muted)" }}>
        Showing {filteredProjects.length} of {projects.length} projects
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-8" style={{ color: "var(--color-ink-muted)" }}>
          {searchQuery ? "No projects match your search." : "No projects found."}
        </div>
      ) : (
        filteredProjects.map(p => (
          <div key={p._id} className="border p-6 mb-6 rounded-lg app-surface shadow-sm">
            {/* Project Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "var(--color-ink)" }}>{p.title}</h2>
                <p className="mt-1" style={{ color: "var(--color-ink-muted)" }}>
                  <strong>Student:</strong> {p.student.name} ({p.student.studentID})
                </p>
                <p style={{ color: "var(--color-ink-muted)" }}>
                  <strong>Email:</strong> {p.student.email}
                </p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: "var(--color-surface)", color: "var(--color-ink)" }}>
                  {p.approved ? "Approved" : "Pending Approval"}
                </span>
                <p className="text-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>
                  Submitted: {new Date(p.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Project Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--color-ink)" }}>Project Description</h3>
              <p className="p-3 rounded" style={{ background: "var(--color-surface)", color: "var(--color-ink)" }}>
                {p.description}
              </p>
            </div>

            {/* Project Features & Progress */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--color-ink)" }}>Project Features & Progress</h3>
              {p.features && p.features.length > 0 ? (
                <div>
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Progress</span>
                      <span className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
                        {calculateProgress(p.features)}%
                      </span>
                    </div>
                    <div className="w-full rounded-full h-2.5" style={{ background: "var(--color-surface)" }}>
                      <div 
                        className="h-2.5 rounded-full transition-all duration-300" 
                        style={{ background: "var(--color-primary)", width: `${calculateProgress(p.features)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2">
                    {p.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded" style={{ background: "var(--color-surface)" }}>
                        <input
                          type="checkbox"
                          checked={feature.completed}
                          disabled
                          className="w-4 h-4 rounded"
                        />
                        <span className={`flex-1 ${feature.completed ? 'line-through' : ''}`} style={{ color: "var(--color-ink)" }}>
                          {feature.name}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: "var(--color-bg)", color: "var(--color-ink)" }}>
                          {feature.completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="italic" style={{ color: "var(--color-ink-muted)" }}>No features defined for this project.</p>
              )}
            </div>

            {/* Final Submission Link */}
            {p.finalLink && (
              <div className="mb-6 p-4 rounded-lg border app-surface">
                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--color-ink)" }}>Final Submission</h3>
                <a 
                  href={p.finalLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline break-all font-medium"
                  style={{ color: "var(--color-primary)" }}
                >
                  {p.finalLink}
                </a>
              </div>
            )}

            {/* Existing Feedback & Marks */}
            {p.facultyFeedback && (
              <div className="mb-4 p-3 rounded-lg border" style={{ background: "#fef9c3", borderColor: "#fde68a" }}>
                <h4 className="font-semibold mb-1" style={{ color: "#713f12" }}>Your Previous Feedback</h4>
                <p style={{ color: "#854d0e" }}>{p.facultyFeedback}</p>
              </div>
            )}

            {p.marks > 0 && (
              <div className="mb-4 p-3 rounded-lg border" style={{ background: "#dcfce7", borderColor: "#86efac" }}>
                <h4 className="font-semibold mb-1" style={{ color: "#065f46" }}>Assigned Marks</h4>
                <p className="text-lg font-bold" style={{ color: "#065f46" }}>{p.marks}/20</p>
              </div>
            )}

            {/* Approval Actions */}
            {!p.approved && (
              <div className="mb-6 p-4 rounded-lg app-surface">
                <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--color-ink)" }}>Project Approval</h3>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleApprove(p._id, true)} 
                    className="btn btn-primary"
                  >
                    ✅ Approve Project
                  </button>
                  <button 
                    onClick={() => handleApprove(p._id, false)} 
                    className="btn btn-outline"
                  >
                    ❌ Reject & Delete
                  </button>
                </div>
              </div>
            )}

            {/* Feedback & Marks Form */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--color-ink)" }}>Add Feedback & Marks</h3>
              <div className="space-y-3">
                <textarea
                  placeholder="Provide detailed feedback on the project..."
                  value={feedback[p._id] || ""}
                  onChange={e => setFeedback({...feedback, [p._id]: e.target.value})}
                  className="w-full p-3 rounded-lg resize-none"
                  style={{ border: "1px solid var(--color-surface)", background: "var(--color-bg)", color: "var(--color-ink)" }}
                  rows="4"
                />
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    placeholder="Marks (0-20)"
                    min="0"
                    max="20"
                    value={marks[p._id] || ""}
                    onChange={e => setMarks({...marks, [p._id]: e.target.value})}
                    className="flex-1 p-3 rounded-lg"
                    style={{ border: "1px solid var(--color-surface)", background: "var(--color-bg)", color: "var(--color-ink)" }}
                  />
                  <button 
                    onClick={() => handleFeedback(p._id)} 
                    className="btn btn-primary font-medium"
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}


