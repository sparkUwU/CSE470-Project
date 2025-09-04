import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const applyTheme = () => {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };
    applyTheme();
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true });
        setUser(res.data.user);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, [location.pathname]);

  const handleLogout = async () => {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="w-full" style={{ backgroundColor: "var(--color-bg)", color: "var(--color-ink)", borderBottom: "1px solid var(--color-surface)" }}>
      <div className="container" style={{ paddingTop: "0.75rem", paddingBottom: "0.75rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to={user ? "/dashboard" : "/"} className="brand">CSE470</Link>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="theme-toggle"
          >
            <span className="theme-toggle-knob" />
          </button>

          {!user && (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/signup" className="btn btn-primary">Signup</Link>
            </>
          )}

          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Link to="/dashboard" className="btn btn-outline">Dashboard</Link>
              {user.role === "student" && (
                <Link to="/submit" className="btn btn-outline">Submit Idea</Link>
              )}
              {user.role === "student" && (
                <Link to="/final-submit" className="btn btn-outline">Final Submit</Link>
              )}
              <Link to="/final-marks" className="btn btn-outline">Final Marks</Link>
              <Link to="/announcements" className="btn btn-outline">Announcements</Link>
              {user.role === "faculty" && (
                <Link to="/admin" className="btn btn-outline">Faculty</Link>
              )}
              <Link to="/profile" className="btn btn-outline">Profile</Link>
              <button onClick={handleLogout} className="btn btn-outline">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

