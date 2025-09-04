import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentID, setStudentID] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true });
        const userData = res.data.user;
        setUser(userData);
        setName(userData.name || "");
        setEmail(userData.email || "");
        setStudentID(userData.studentID || "");
      } catch (err) {
        setError("Failed to load profile");
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    
    try {
      await axios.put("/api/users/me", { name, email, studentID }, { withCredentials: true });
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setError("Both current and new password are required");
      return;
    }
    
    setLoading(true);
    setError("");
    setMessage("");
    
    try {
      await axios.post("/api/auth/change-password", { currentPassword, newPassword }, { withCredentials: true });
      setMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <div className="text-center">
          {error ? (
            <div style={{ color: "#991b1b" }}>{error}</div>
          ) : (
            <div>Loading profile...</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-ink)" }}>Profile</h1>
      
      {message && (
        <div className="mb-4 p-3 rounded" style={{ background: "#dcfce7", border: "1px solid #86efac", color: "#166534" }}>
          {message}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 rounded" style={{ background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b" }}>
          {error}
        </div>
      )}

      <form onSubmit={updateProfile} className="border p-4 rounded mb-6 app-surface">
        <h2 className="font-semibold mb-3" style={{ color: "var(--color-ink)" }}>Personal Information</h2>
        <input 
          className="p-2 w-full mb-3 rounded"
          style={{ border: "1px solid var(--color-surface)", background: "var(--color-bg)", color: "var(--color-ink)" }} 
          placeholder="Name" 
          value={name} 
          onChange={e => setName(e.target.value)}
          required
        />
        <input 
          className="p-2 w-full mb-3 rounded"
          style={{ border: "1px solid var(--color-surface)", background: "var(--color-bg)", color: "var(--color-ink)" }} 
          placeholder="Email" 
          type="email"
          value={email} 
          onChange={e => setEmail(e.target.value)}
          required
        />
        {user.role === "student" && (
          <input 
            className="p-2 w-full mb-3 rounded"
            style={{ border: "1px solid var(--color-surface)", background: "var(--color-bg)", color: "var(--color-ink)" }} 
            placeholder="Student ID" 
            value={studentID} 
            onChange={e => setStudentID(e.target.value)}
            required
          />
        )}
        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <form onSubmit={changePassword} className="border p-4 rounded app-surface">
        <h2 className="font-semibold mb-3" style={{ color: "var(--color-ink)" }}>Change Password</h2>
        <input 
          className="p-2 w-full mb-3 rounded"
          style={{ border: "1px solid var(--color-surface)", background: "var(--color-bg)", color: "var(--color-ink)" }} 
          type="password" 
          placeholder="Current password" 
          value={currentPassword} 
          onChange={e => setCurrentPassword(e.target.value)}
          required
        />
        <input 
          className="p-2 w-full mb-3 rounded"
          style={{ border: "1px solid var(--color-surface)", background: "var(--color-bg)", color: "var(--color-ink)" }} 
          type="password" 
          placeholder="New password" 
          value={newPassword} 
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-outline disabled:opacity-50"
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>

      <div className="mt-6 p-4 border rounded app-surface">
        <h3 className="font-semibold mb-2">Account Information</h3>
        <p><strong>Role:</strong> {user.role === "faculty" ? "Faculty" : "Student"}</p>
        <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}


