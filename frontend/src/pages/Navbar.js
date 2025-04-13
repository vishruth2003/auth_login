import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/Navbar.css";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const hideHomeLink = location.pathname === "/login" || location.pathname === "/signup";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Always show hamburger menu and logo side by side */}
        {!hideHomeLink && (
          <div className="hamburger-menu" onClick={toggleSidebar}>
            <div className={`hamburger-icon ${isSidebarOpen ? "active" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {/* Logo - always next to hamburger */}
        {hideHomeLink ? (
          <img src={logo} alt="Logo" className="logo" />
        ) : (
          <a href="/tasks" className="logo-link">
            <img src={logo} alt="Logo" className="logo" />
          </a>
        )}
      </div>

      {!hideHomeLink && (
        <div className="navbar-right">
          <button className="logout-btn" onClick={handleLogout} aria-label="Logout">
            <i className="logout-icon"></i>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;