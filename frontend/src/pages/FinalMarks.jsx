import { useState, useEffect } from "react";
import axios from "axios";

export default function FinalMarks() {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const res = await axios.get("/api/projects/final-marks", { withCredentials: true });
        setProjects(res.data);
        setFilteredProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch final marks:", err);
      }
    };
    fetchMarks();
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
      const query = searchQuery.toLowerCase();

      return studentName.includes(query) || 
             studentID.includes(query) || 
             projectTitle.includes(query);
    });

    setFilteredProjects(filtered);
  }, [searchQuery, projects]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-ink)" }}>Final Marks</h1>
      
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by student name, ID, or project title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-lg"
          style={{
            border: "1px solid var(--color-surface)",
            background: "var(--color-bg)",
            color: "var(--color-ink)",
            outline: "none",
            boxShadow: "0 0 0 0 rgba(0,0,0,0)"
          }}
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
          <div key={p._id} className="border p-4 mb-3 rounded app-surface">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{p.title}</h3>
              <span className="px-3 py-1 rounded text-sm" style={{ background: "var(--color-surface)", color: "var(--color-ink)" }}>
                {p.marks}/20
              </span>
            </div>
            
            <p style={{ color: "var(--color-ink-muted)", marginBottom: "0.5rem" }}>
              <strong>Student:</strong> {p.student?.name} ({p.student?.studentID})
            </p>
            
            {p.finalLink && (
              <p className="mb-2">
                <strong>Final Submission:</strong>{" "}
                <a 
                  href={p.finalLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline break-all"
                  style={{ color: "var(--color-primary)" }}
                >
                  {p.finalLink}
                </a>
              </p>
            )}

            {p.facultyFeedback && (
              <p className="mb-2">
                <strong>Faculty Feedback:</strong> {p.facultyFeedback}
              </p>
            )}

            <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
              <strong>Status:</strong> {p.approved ? "Approved" : "Pending Approval"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
