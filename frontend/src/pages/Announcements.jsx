import { useEffect, useState } from "react";
import axios from "axios";

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const fetchAll = async () => {
    try {
      const res = await axios.get("/api/announcements", { withCredentials: true });
      setItems(res.data);
    } catch (err) {
      setError("Failed to load announcements");
    }
  };

  useEffect(() => {
    fetchAll();
    // Get current user to check role
    axios.get("/api/auth/me", { withCredentials: true })
      .then(r => setUser(r.data.user))
      .catch(() => setUser(null));
  }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("Title and body are required");
      return;
    }
    
    try {
      await axios.post("/api/announcements", { title, body }, { withCredentials: true });
      setTitle("");
      setBody("");
      setError("");
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create announcement");
    }
  };

  const remove = async (id) => {
    try {
      await axios.delete(`/api/announcements/${id}`, { withCredentials: true });
      fetchAll();
    } catch (err) {
      setError("Failed to delete announcement");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-ink)" }}>Announcements</h1>
      
      {error && (
        <div className="mb-4 p-3 rounded" style={{ background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b" }}>
          {error}
        </div>
      )}

      {user?.role === "faculty" && (
        <form onSubmit={create} className="mb-6 border p-4 rounded app-surface">
          <h2 className="font-semibold mb-3" style={{ color: "var(--color-ink)" }}>Create New Announcement</h2>
          <input 
            className="p-2 w-full mb-2 rounded"
            style={{ border: "1px solid var(--color-surface)", background: "var(--color-bg)", color: "var(--color-ink)" }}
            placeholder="Title" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required
          />
          <textarea 
            className="p-2 w-full mb-2 rounded"
            style={{ border: "1px solid var(--color-surface)", background: "var(--color-bg)", color: "var(--color-ink)" }}
            placeholder="Body" 
            value={body} 
            onChange={e => setBody(e.target.value)} 
            rows="3"
            required
          />
          <button className="btn btn-primary">
            Post Announcement
          </button>
        </form>
      )}

      {items.length === 0 ? (
        <p className="text-center py-8" style={{ color: "var(--color-ink-muted)" }}>No announcements yet.</p>
      ) : (
        items.map(a => (
          <div key={a._id} className="border rounded p-4 mb-3 app-surface">
            <h2 className="font-semibold text-lg">{a.title}</h2>
            <p className="text-sm mb-2" style={{ color: "var(--color-ink-muted)" }}>
              {new Date(a.createdAt).toLocaleString()}
            </p>
            <p className="mt-2 whitespace-pre-wrap">{a.body}</p>
            {user?.role === "faculty" && (
              <button 
                onClick={() => remove(a._id)} 
                className="mt-3 px-2 py-1 rounded"
                style={{ color: "#991b1b", border: "1px solid #fecaca" }}
              >
                Delete
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}


