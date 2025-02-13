import Sidebar from "../components/Sidebar"; // Import Sidebar
import "./Report.css";
import Sidebar from "./Sidebar.js";


const Report = () => {
  return (
    <div>
      <Sidebar /> {/* Use Sidebar */}
      <div className="report-content">
        <h1>Report Page</h1>
        {/* Page content */}
      </div>
    </div>
  );
};

export default Report;
