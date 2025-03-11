import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/Navbar.css";

const Navbar = () => {
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
        {hideHomeLink ? (
          <img src={logo} alt="Logo" className="logo" />
        ) : (
          <a href="/home" className="logo-link">
            <img src={logo} alt="Logo" className="logo" />
          </a>
        )}
      </div>

      {!hideHomeLink && (
        <div className="navbar-right">
          <button className="logout-btn" onClick={handleLogout}>
            <i className="logout-icon"></i>
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;