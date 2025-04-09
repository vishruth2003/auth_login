import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../styles/Sidebar.css";

const Sidebar = ({ onStateChange }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onStateChange) {
      onStateChange(newState);
    }
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target) &&
        isOpen
      ) {
        setIsOpen(false);
        if (onStateChange) {
          onStateChange(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onStateChange]);

  return (
    <>
      {/* Hamburger Menu Button - Now integrated with navbar */}
      <div 
        className="hamburger-menu" 
        onClick={toggleSidebar}
        ref={hamburgerRef}
      >
        <div className={`hamburger-icon ${isOpen ? "active" : ""}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* Overlay - closes sidebar when clicked */}
      <div 
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={() => {
          setIsOpen(false);
          if (onStateChange) {
            onStateChange(false);
          }
        }}
      ></div>

      {/* Sidebar */}
      <div 
        className={`sidebar ${isOpen ? "open" : ""}`}
        ref={sidebarRef}
      >
        <div className="sidebar-content">
          <ul>
            <li className={isActive("/dashboard") ? "active" : ""}>
              <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                <i className="icon dashboard-icon"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className={isActive("/tasks") ? "active" : ""}>
              <Link to="/tasks" onClick={() => setIsOpen(false)}>
                <i className="icon tasks-icon"></i>
                <span>Tasks</span>
              </Link>
            </li>
            <li className={isActive("/profile") ? "active" : ""}>
              <Link to="/profile" onClick={() => setIsOpen(false)}>
                <i className="icon profile-icon"></i>
                <span>Profile</span>
              </Link>
            </li>
            <li className={isActive("/checklist") ? "active" : ""}>
              <Link to="/checklist" onClick={() => setIsOpen(false)}>
                <i className="icon checklist-icon"></i>
                <span>Checklist</span>
              </Link>
            </li>
            <li className={isActive("/delegation") ? "active" : ""}>
              <Link to="/delegation" onClick={() => setIsOpen(false)}>
                <i className="icon delegation-icon"></i>
                <span>Delegation</span>
              </Link>
            </li>
            <li className={isActive("/report") ? "active" : ""}>
              <Link to="/report" onClick={() => setIsOpen(false)}>
                <i className="icon report-icon"></i>
                <span>Report</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;