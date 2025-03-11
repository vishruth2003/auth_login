import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <ul>
          <li className={isActive("/home") ? "active" : ""}>
            <Link to="/home">
              <i className="icon home-icon"></i>
              <span>Home</span>
            </Link>
          </li>
          <li className={isActive("/profile") ? "active" : ""}>
            <Link to="/profile">
              <i className="icon profile-icon"></i>
              <span>Profile</span>
            </Link>
          </li>
          <li className={isActive("/checklist") ? "active" : ""}>
            <Link to="/checklist">
              <i className="icon checklist-icon"></i>
              <span>Checklist</span>
            </Link>
          </li>
          <li className={isActive("/delegation") ? "active" : ""}>
            <Link to="/delegation">
              <i className="icon delegation-icon"></i>
              <span>Delegation</span>
            </Link>
          </li>
          <li className={isActive("/report") ? "active" : ""}>
            <Link to="/report">
              <i className="icon report-icon"></i>
              <span>Report</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;