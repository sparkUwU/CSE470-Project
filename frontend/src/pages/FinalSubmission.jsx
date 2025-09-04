import { useState, useEffect } from "react";
import axios from "axios";

export default function FinalSubmission() {
  const [finalLink, setFinalLink] = useState("");
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

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
    if (!/^https?:\/\//i.test(finalLink)) {
      setError("Please provide a valid URL starting with http or https.");
      return;
    }
    try {
      setSaving(true);
      const res = await axios.put("/api/projects/final", { finalLink }, { withCredentials: true });
      setProject(res.data);
      setFinalLink("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Final submission failed");
    } finally {
      setSaving(false);
    }
  };

  if (!project) return <div className="p-8" style={{ color: "var(--color-ink-muted)" }}>You have no approved project yet.</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-ink)" }}>Final Project Submission</h1>

      {/* Status */}
      {project.finalSubmitted && (
        <div className="mb-4 p-3 rounded" style={{ background: "#dcfce7", border: "1px solid #86efac", color: "#166534" }}>
          Final link submitted: {" "}
          <a href={project.finalLink} target="_blank" rel="noreferrer" className="underline" style={{ color: "var(--color-primary)" }}>{project.finalLink}</a>
        </div>
      )}

      {/* Instructions */}
      <div className="mb-6 p-4 border rounded app-surface">
        <h2 className="font-semibold mb-2" style={{ color: "var(--color-ink)" }}>Submission Guidelines</h2>
        <ul style={{ color: "var(--color-ink-muted)", listStyle: "disc", paddingLeft: "1.25rem" }}>
          <li>Provide a public link to your final project.</li>
          <li>Accepted links: GitHub repository, Google Drive, or deployed URL.</li>
          <li>Ensure the link has view access for the faculty.</li>
        </ul>
      </div>

      {error && <div className="mb-4 p-3 rounded" style={{ background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b" }}>{error}</div>}

      <form onSubmit={handleSubmit} className="border p-4 rounded app-surface">
        <label className="block font-medium mb-1" style={{ color: "var(--color-ink)" }}>Final project link</label>
        <input
          type="url"
          placeholder="https://github.com/username/repo or https://drive.google.com/..."
          value={finalLink}
          onChange={e => setFinalLink(e.target.value)}
          className="p-2 w-full mb-3 rounded"
          style={{ border: "1px solid var(--color-surface)", background: "var(--color-bg)", color: "var(--color-ink)" }}
          required
        />
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Submitting..." : "Submit"}</button>
          {project.finalSubmitted && (
            <a href={project.finalLink} target="_blank" rel="noreferrer" className="btn btn-outline">View current link</a>
          )}
        </div>
      </form>
    </div>
  );
}
