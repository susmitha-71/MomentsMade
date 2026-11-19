
import { NavLink } from "react-router-dom";

function Navbar({ theme, toggleTheme }) {
  return (
    <nav className="navbar">
      <div className="logo">
        Moments<span>Made.</span>
      </div>

      <div className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/explore">Explore</NavLink>
        <NavLink to="/create">Create Experience</NavLink>
        <NavLink to="/my-bucket">My Bucket</NavLink>

        <button className="theme-btn" onClick={toggleTheme}>
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
