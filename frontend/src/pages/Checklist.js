import Sidebar from "../components/Sidebar"; // Import Sidebar
import "./Checklist.css";
import Sidebar from "./Sidebar.js";

const Checklist = () => {
  return (
    <div>
      <Sidebar /> {/* Use Sidebar */}
      <div className="checklist-content">
        <h1>Checklist Page</h1>
        {/* Page content */}
      </div>
    </div>
  );
};

export default Checklist;
