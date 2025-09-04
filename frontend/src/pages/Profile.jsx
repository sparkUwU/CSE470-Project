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
            <div className="text-red-600">{error}</div>
          ) : (
            <div>Loading profile...</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      
      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={updateProfile} className="border p-4 rounded mb-6 bg-white dark:bg-gray-800">
        <h2 className="font-semibold mb-3">Personal Information</h2>
        <input 
          className="border p-2 w-full mb-3 rounded" 
          placeholder="Name" 
          value={name} 
          onChange={e => setName(e.target.value)}
          required
        />
        <input 
          className="border p-2 w-full mb-3 rounded" 
          placeholder="Email" 
          type="email"
          value={email} 
          onChange={e => setEmail(e.target.value)}
          required
        />
        {user.role === "student" && (
          <input 
            className="border p-2 w-full mb-3 rounded" 
            placeholder="Student ID" 
            value={studentID} 
            onChange={e => setStudentID(e.target.value)}
            required
          />
        )}
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <form onSubmit={changePassword} className="border p-4 rounded bg-white dark:bg-gray-800">
        <h2 className="font-semibold mb-3">Change Password</h2>
        <input 
          className="border p-2 w-full mb-3 rounded" 
          type="password" 
          placeholder="Current password" 
          value={currentPassword} 
          onChange={e => setCurrentPassword(e.target.value)}
          required
        />
        <input 
          className="border p-2 w-full mb-3 rounded" 
          type="password" 
          placeholder="New password" 
          value={newPassword} 
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 disabled:opacity-50"
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>

      <div className="mt-6 p-4 border rounded bg-gray-50 dark:bg-gray-700">
        <h3 className="font-semibold mb-2">Account Information</h3>
        <p><strong>Role:</strong> {user.role === "faculty" ? "Faculty" : "Student"}</p>
        <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}


