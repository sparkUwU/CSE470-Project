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
    <nav className="w-full border-b bg-white dark:bg-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to={user ? "/dashboard" : "/"} className="font-bold">CSE470</Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-3 py-1 rounded border dark:border-gray-700"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>

          {!user && (
            <>
              <Link to="/login" className="px-3 py-1 rounded border">Login</Link>
              <Link to="/signup" className="px-3 py-1 rounded bg-blue-600 text-white">Signup</Link>
            </>
          )}

          {user && (
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="px-2">Dashboard</Link>
              {user.role === "student" && (
                <Link to="/submit" className="px-2">Submit Idea</Link>
              )}
              {user.role === "student" && (
                <Link to="/final-submit" className="px-2">Final Submit</Link>
              )}
              <Link to="/final-marks" className="px-2">Final Marks</Link>
              <Link to="/announcements" className="px-2">Announcements</Link>
              {user.role === "faculty" && (
                <Link to="/admin" className="px-2">Faculty</Link>
              )}
              <Link to="/profile" className="px-2">Profile</Link>
              <button onClick={handleLogout} className="px-2 rounded border">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

