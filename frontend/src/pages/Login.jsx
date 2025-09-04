// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      console.log(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-20" style={{ background: "var(--color-bg)" }}>
      <form onSubmit={handleSubmit} className="p-8 rounded-lg shadow-lg w-96 app-surface border">
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--color-ink)" }}>Login</h2>
        
        {error && (
          <div className="mb-4 p-3 rounded" style={{ background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b" }}>
            {error}
          </div>
        )}
        
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
        
        <div className="mb-6">
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
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        
        <p className="mt-4 text-center" style={{ color: "var(--color-ink-muted)" }}>
          Don't have an account?{" "}
          <a href="/signup" className="hover:underline" style={{ color: "var(--color-primary)" }}>Sign up</a>
        </p>
      </form>
    </div>
  );
}
