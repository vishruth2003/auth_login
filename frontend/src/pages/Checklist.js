import Sidebar from "../components/Sidebar"; 
import "../styles/Checklist.css";
import Sidebar from "../styles/Sidebar.js";

const Checklist = () => {
  return (
    <div>
      <Sidebar /> 
      <div className="checklist-content">
        <h1>Checklist Page</h1>
      </div>
    </div>
  );
};

export default Checklist;
