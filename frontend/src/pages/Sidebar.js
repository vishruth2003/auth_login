import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../styles/Sidebar.css";

const Sidebar = ({ onStateChange }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);
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

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 992;
      setIsDesktop(desktop);
      
      // If switching to desktop, ensure sidebar state is managed properly
      if (desktop && !isOpen) {
        if (onStateChange) {
          onStateChange(true); // Notify parent that sidebar is effectively "open" on desktop
        }
      }
    };

    // Initial check
    handleResize();
    
    // Add resize event listener
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, onStateChange]);

  // Close sidebar when clicking outside (mobile/tablet only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !isDesktop &&
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
  }, [isOpen, isDesktop, onStateChange]);

  return (
    <>
      {/* Hamburger Menu Button - Only for mobile/tablet */}
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

      {/* Overlay - only used on mobile/tablet */}
      <div 
        className={`sidebar-overlay ${!isDesktop && isOpen ? "active" : ""}`}
        onClick={() => {
          if (!isDesktop) {
            setIsOpen(false);
            if (onStateChange) {
              onStateChange(false);
            }
          }
        }}
      ></div>

      {/* Sidebar - always visible on desktop */}
      <div 
        className={`sidebar ${isOpen || isDesktop ? "open" : ""}`}
        ref={sidebarRef}
      >
        <div className="sidebar-content">
          <ul>
            <li className={isActive("/dashboard") ? "active" : ""}>
              <Link to="/dashboard" onClick={() => !isDesktop && setIsOpen(false)}>
                <i className="icon dashboard-icon"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className={isActive("/tasks") ? "active" : ""}>
              <Link to="/tasks" onClick={() => !isDesktop && setIsOpen(false)}>
                <i className="icon tasks-icon"></i>
                <span>My Tasks</span>
              </Link>
            </li>
            <li className={isActive("/profile") ? "active" : ""}>
              <Link to="/profile" onClick={() => !isDesktop && setIsOpen(false)}>
                <i className="icon profile-icon"></i>
                <span>Profile</span>
              </Link>
            </li>
            <li className={isActive("/checklist") ? "active" : ""}>
              <Link to="/checklist" onClick={() => !isDesktop && setIsOpen(false)}>
                <i className="icon checklist-icon"></i>
                <span>Checklist</span>
              </Link>
            </li>
            <li className={isActive("/delegation") ? "active" : ""}>
              <Link to="/delegation" onClick={() => !isDesktop && setIsOpen(false)}>
                <i className="icon delegation-icon"></i>
                <span>Delegation</span>
              </Link>
            </li>
            <li className={isActive("/report") ? "active" : ""}>
              <Link to="/report" onClick={() => !isDesktop && setIsOpen(false)}>
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