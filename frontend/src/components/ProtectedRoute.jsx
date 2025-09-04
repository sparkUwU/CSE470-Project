import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children, adminOnly, studentOnly }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true });
        setUser(res.data.user);
        setLoading(false);
      } catch (err) {
        setUser(null);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />; // Not logged in

  if (adminOnly && user.role !== "faculty") return <Navigate to="/dashboard" />; // Not faculty
  
  if (studentOnly && user.role !== "student") return <Navigate to="/admin" />; // Not student

  return children;
}
