import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/checklist">Checklist</Link></li>
        <li><Link to="/delegation">Delegation</Link></li>
        <li><Link to="/report">Report</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
