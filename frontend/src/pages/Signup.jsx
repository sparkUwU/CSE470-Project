// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentID, setStudentID] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await axios.post(
        "/api/auth/signup",
        { name, email, password, studentID },
        { withCredentials: true }
      );
      console.log(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-20" style={{ background: "var(--color-bg)" }}>
      <form onSubmit={handleSubmit} className="p-8 rounded-lg shadow-lg w-96 app-surface border">
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--color-ink)" }}>Sign Up</h2>
        
        {error && (
          <div className="mb-4 p-3 rounded" style={{ background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b" }}>
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="w-full p-3 rounded"
            style={{ border: "1px solid var(--color-surface)", background: "var(--color-bg)", color: "var(--color-ink)" }}
            required
          />
        </div>
        
        <div className="mb-4">
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="w-full p-3 rounded"
            style={{ border: "1px solid var(--color-surface)", background: "var(--color-bg)", color: "var(--color-ink)" }}
            required
          />
        </div>
        
        <div className="mb-4">
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="w-full p-3 rounded"
            style={{ border: "1px solid var(--color-surface)", background: "var(--color-bg)", color: "var(--color-ink)" }}
            required
          />
        </div>
        
        <div className="mb-6">
          <input 
            type="text" 
            placeholder="Student ID" 
            value={studentID} 
            onChange={e => setStudentID(e.target.value)} 
            className="w-full p-3 rounded"
            style={{ border: "1px solid var(--color-surface)", background: "var(--color-bg)", color: "var(--color-ink)" }}
            required
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
        
        <p className="mt-4 text-center" style={{ color: "var(--color-ink-muted)" }}>
          Already have an account?{" "}
          <a href="/login" className="hover:underline" style={{ color: "var(--color-primary)" }}>Login</a>
        </p>
      </form>
    </div>
  );
}
