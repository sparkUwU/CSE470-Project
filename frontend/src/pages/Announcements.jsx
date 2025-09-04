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
      <h1 className="text-2xl font-bold mb-4">Announcements</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {user?.role === "faculty" && (
        <form onSubmit={create} className="mb-6 border p-4 rounded bg-gray-50 dark:bg-gray-800">
          <h2 className="font-semibold mb-3">Create New Announcement</h2>
          <input 
            className="border p-2 w-full mb-2" 
            placeholder="Title" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required
          />
          <textarea 
            className="border p-2 w-full mb-2" 
            placeholder="Body" 
            value={body} 
            onChange={e => setBody(e.target.value)} 
            rows="3"
            required
          />
          <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
            Post Announcement
          </button>
        </form>
      )}

      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No announcements yet.</p>
      ) : (
        items.map(a => (
          <div key={a._id} className="border rounded p-4 mb-3 bg-white dark:bg-gray-800">
            <h2 className="font-semibold text-lg">{a.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {new Date(a.createdAt).toLocaleString()}
            </p>
            <p className="mt-2 whitespace-pre-wrap">{a.body}</p>
            {user?.role === "faculty" && (
              <button 
                onClick={() => remove(a._id)} 
                className="mt-3 text-red-600 hover:text-red-800 px-2 py-1 rounded border border-red-300 hover:border-red-500"
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


