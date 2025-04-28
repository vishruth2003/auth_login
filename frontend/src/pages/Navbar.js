import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/Navbar.css";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const dropdownRef = useRef(null);

  const hideHomeLink = location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    const fetchUserData = () => {
      const userName = localStorage.getItem("userName");
      const userEmail = localStorage.getItem("userEmail");

      if (userName || userEmail) {
        setUserData({
          name: userName || "User",
          email: userEmail || "No email available",
        });
      } else {
        setUserData({ name: "User", email: "" });
      }
    };

    fetchUserData();
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.removeItem("appSession");
    setIsDropdownOpen(false);
    navigate("/login", { replace: true });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const navigateTo = (path) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  const userInitial = userData.name ? userData.name.charAt(0).toUpperCase() : "U";

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {!hideHomeLink && (
          <div className="hamburger-menu" onClick={toggleSidebar}>
            <div className={`hamburger-icon ${isSidebarOpen ? "active" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {hideHomeLink ? (
          <img src={logo} alt="Logo" className="logo" />
        ) : (
          <a href="/tasks" className="logo-link">
            <img src={logo} alt="Logo" className="logo" />
          </a>
        )}
      </div>

      {!hideHomeLink && (
        <div className="navbar-right" ref={dropdownRef}>
          <button 
            className={`user-avatar-btn ${isDropdownOpen ? "active" : ""}`}
            onClick={toggleDropdown}
            aria-label="User profile"
            aria-expanded={isDropdownOpen}
          >
            <span className="user-initial">{userInitial}</span>
            <span className="user-status"></span>
          </button>
          
          {isDropdownOpen && (
            <div className="user-dropdown">
              <div className="dropdown-header"></div>
              <div className="user-info">
                <div className="user-avatar-large">
                  <span>{userInitial}</span>
                </div>
                <div className="greeting">Welcome</div>
                <div className="user-name">{userData.name || "User"}</div>
                <div className="user-email">{userData.email || "No email available"}</div>
              </div>
              
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={() => navigateTo('/profile')}>
                  <i className="icon-profile"></i>
                  <span>My Profile</span>
                </div>
                <div className="dropdown-item" onClick={() => navigateTo('/settings')}>
                  <i className="icon-settings"></i>
                  <span>Settings</span>
                </div>
                <div className="dropdown-item" onClick={() => navigateTo('/help')}>
                  <i className="icon-help"></i>
                  <span>Help & Support</span>
                </div>
              </div>
              
              <button className="logout-btn-dropdown" onClick={handleLogout}>
                <i className="logout-icon"></i>
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;