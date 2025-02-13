import Sidebar from "../components/Sidebar"; // Import Sidebar
import "./Checklist.css";

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
