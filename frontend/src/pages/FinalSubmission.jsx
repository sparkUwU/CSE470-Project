import { useState, useEffect } from "react";
import axios from "axios";

export default function FinalSubmission() {
  const [finalLink, setFinalLink] = useState("");
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get("/api/projects", { withCredentials: true });
        const approvedProject = res.data.find(p => p.approved);
        setProject(approvedProject || null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load project");
      }
    };
    fetchProject();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project) return alert("No approved project to submit final link for!");
    try {
      const res = await axios.put("/api/projects/final", { finalLink }, { withCredentials: true });
      setProject(res.data);
      setFinalLink("");
      alert("Final project submitted!");
    } catch (err) {
      setError(err.response?.data?.message || "Final submission failed");
    }
  };

  if (!project) return <div className="p-8">You have no approved project yet.</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Final Project Submission</h1>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Final project link (GitHub/Drive)"
          value={finalLink}
          onChange={e => setFinalLink(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Submit</button>
      </form>
      {project.finalSubmitted && <p className="mt-2 text-green-600">Final link submitted: <a href={project.finalLink} target="_blank">{project.finalLink}</a></p>}
    </div>
  );
}
