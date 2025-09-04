import { useState, useEffect } from "react";
import axios from "axios";

export default function ProjectSubmission() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState([{ name: "", completed: false }]);
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({ title: "", description: "", features: [] });
  const [error, setError] = useState("");

  // Fetch current projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/api/projects", { withCredentials: true });
        setProjects(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load projects");
      }
    };
    fetchProjects();
  }, []);

  const addFeature = () => setFeatures([...features, { name: "", completed: false }]);
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index].name = value;
    setFeatures(newFeatures);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/api/projects", { title, description, features }, { withCredentials: true });
      setProjects([...projects, res.data]);
      setTitle("");
      setDescription("");
      setFeatures([{ name: "", completed: false }]);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    }
  };

  const calculateProgress = (project) => {
    if (!project.features.length) return 0;
    const done = project.features.filter(f => f.completed).length;
    return Math.round((done / project.features.length) * 100);
  };

  const toggleFeature = async (projectId, index, completed) => {
    const res = await axios.put(`/api/projects/${projectId}/features/${index}`, { completed }, { withCredentials: true });
    setProjects(projects.map(p => (p._id === projectId ? res.data : p)));
  };

  const startEdit = (project) => {
    setEditingId(project._id);
    setEditFields({ title: project.title, description: project.description, features: project.features.map(f => ({ ...f })) });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFields({ title: "", description: "", features: [] });
  };

  const addEditFeature = () => setEditFields({ ...editFields, features: [...editFields.features, { name: "", completed: false }] });
  const updateEditFeature = (idx, value) => {
    const list = [...editFields.features];
    list[idx].name = value;
    setEditFields({ ...editFields, features: list });
  };

  const saveEdit = async () => {
    const res = await axios.put(`/api/projects/${editingId}`, {
      title: editFields.title,
      description: editFields.description,
      features: editFields.features
    }, { withCredentials: true });
    setProjects(projects.map(p => (p._id === editingId ? res.data : p)));
    cancelEdit();
  };

  const removeProject = async (projectId) => {
    await axios.delete(`/api/projects/${projectId}`, { withCredentials: true });
    setProjects(projects.filter(p => p._id !== projectId));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Submit Project Idea</h1>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="mb-6">
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="border p-2 mb-2 w-full" />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="border p-2 mb-2 w-full" />
        {features.map((f, idx) => (
          <input key={idx} placeholder="Feature" value={f.name} onChange={e => handleFeatureChange(idx, e.target.value)} className="border p-2 mb-2 w-full" />
        ))}
        <button type="button" onClick={addFeature} className="bg-gray-300 p-2 rounded mb-2">Add Feature</button>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Submit Project</button>
      </form>

      <h2 className="text-xl font-bold mb-2">Your Projects</h2>
      {projects.map(p => (
        <div key={p._id} className="border p-2 mb-2 rounded">
          {editingId === p._id ? (
            <div className="mb-2">
              <input className="border p-2 w-full mb-2" value={editFields.title} onChange={e => setEditFields({ ...editFields, title: e.target.value })} />
              <textarea className="border p-2 w-full mb-2" value={editFields.description} onChange={e => setEditFields({ ...editFields, description: e.target.value })} />
              {editFields.features.map((f, idx) => (
                <input key={idx} className="border p-2 w-full mb-2" value={f.name} onChange={e => updateEditFeature(idx, e.target.value)} />
              ))}
              <button type="button" onClick={addEditFeature} className="bg-gray-300 p-1 rounded mr-2">Add Feature</button>
              <button type="button" onClick={saveEdit} className="bg-blue-600 text-white p-1 rounded mr-2">Save</button>
              <button type="button" onClick={cancelEdit} className="bg-gray-500 text-white p-1 rounded">Cancel</button>
            </div>
          ) : (
            <>
              <h3 className="font-bold">{p.title}</h3>
              <p>{p.description}</p>
              <ul className="mt-2">
                {p.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <input type="checkbox" checked={!!f.completed} onChange={e => toggleFeature(p._id, idx, e.target.checked)} />
                    <span>{f.name}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-gray-200 h-4 w-full rounded mt-2">
                <div className="bg-green-500 h-4 rounded" style={{ width: calculateProgress(p) + "%" }}></div>
              </div>
              <p>{calculateProgress(p)}% completed</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => startEdit(p)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => removeProject(p._id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
