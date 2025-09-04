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
      <h1 className="text-2xl font-bold mb-4">Final Marks</h1>
      
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by student name, ID, or project title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        Showing {filteredProjects.length} of {projects.length} projects
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchQuery ? "No projects match your search." : "No projects found."}
        </div>
      ) : (
        filteredProjects.map(p => (
          <div key={p._id} className="border p-4 mb-3 rounded bg-white dark:bg-gray-800">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{p.title}</h3>
              <span className={`px-3 py-1 rounded text-sm ${
                p.marks >= 16 ? 'bg-green-100 text-green-800' :
                p.marks >= 12 ? 'bg-yellow-100 text-yellow-800' :
                p.marks >= 8 ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }`}>
                {p.marks}/20
              </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              <strong>Student:</strong> {p.student?.name} ({p.student?.studentID})
            </p>
            
            {p.finalLink && (
              <p className="mb-2">
                <strong>Final Submission:</strong>{" "}
                <a 
                  href={p.finalLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all"
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

            <p className="text-sm text-gray-500">
              <strong>Status:</strong> {p.approved ? "Approved" : "Pending Approval"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
