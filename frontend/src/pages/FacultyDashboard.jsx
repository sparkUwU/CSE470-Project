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
      <h1 className="text-3xl font-bold mb-4">Faculty Dashboard</h1>
      
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by student name, ID, project title, or description..."
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
          <div key={p._id} className="border p-6 mb-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            {/* Project Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{p.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  <strong>Student:</strong> {p.student.name} ({p.student.studentID})
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Email:</strong> {p.student.email}
                </p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  p.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {p.approved ? "Approved" : "Pending Approval"}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  Submitted: {new Date(p.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Project Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Project Description</h3>
              <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                {p.description}
              </p>
            </div>

            {/* Project Features & Progress */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Project Features & Progress</h3>
              {p.features && p.features.length > 0 ? (
                <div>
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {calculateProgress(p.features)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${calculateProgress(p.features)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2">
                    {p.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <input
                          type="checkbox"
                          checked={feature.completed}
                          disabled
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className={`flex-1 ${feature.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                          {feature.name}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          feature.completed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {feature.completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">No features defined for this project.</p>
              )}
            </div>

            {/* Final Submission Link */}
            {p.finalLink && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">Final Submission</h3>
                <a 
                  href={p.finalLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all font-medium"
                >
                  {p.finalLink}
                </a>
              </div>
            )}

            {/* Existing Feedback & Marks */}
            {p.facultyFeedback && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">Your Previous Feedback</h4>
                <p className="text-yellow-800 dark:text-yellow-200">{p.facultyFeedback}</p>
              </div>
            )}

            {p.marks > 0 && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">Assigned Marks</h4>
                <p className="text-green-800 dark:text-green-200 text-lg font-bold">{p.marks}/20</p>
              </div>
            )}

            {/* Approval Actions */}
            {!p.approved && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Project Approval</h3>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleApprove(p._id, true)} 
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    ✅ Approve Project
                  </button>
                  <button 
                    onClick={() => handleApprove(p._id, false)} 
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    ❌ Reject & Delete
                  </button>
                </div>
              </div>
            )}

            {/* Feedback & Marks Form */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Add Feedback & Marks</h3>
              <div className="space-y-3">
                <textarea
                  placeholder="Provide detailed feedback on the project..."
                  value={feedback[p._id] || ""}
                  onChange={e => setFeedback({...feedback, [p._id]: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button 
                    onClick={() => handleFeedback(p._id)} 
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
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


