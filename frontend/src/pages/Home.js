import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Home.css";
import Sidebar from "./Sidebar.js";

const Home = () => {
  const [userName, setUserName] = useState("");
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [delegations, setDelegations] = useState([]); // State for delegations
  const [reports, setReports] = useState([]); // State for reports
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("checklist");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      setIsLoading(true);

      try {
        const userResponse = await axios.get("http://localhost:5000/auth/user", {
          headers: { Authorization: token },
        });
        const username = userResponse.data.userName.trim();
        setUserName(username);

        // Fetch all tasks
        const checklistResponse = await axios.get(`http://localhost:5000/api/checklists/${username}`, {
          headers: { Authorization: token },
        });

        const allTasks = checklistResponse.data;
        const today = new Date();

        // Separate today's tasks and upcoming tasks
        const todaysTasks = allTasks.filter(
          (task) => new Date(task.startdate).toDateString() === today.toDateString()
        );
        const upcomingTasks = allTasks.filter((task) => {
          const startDate = new Date(task.startdate);
          const endDate = new Date(task.enddate);
          return today >= startDate && today <= endDate; // Tasks that are ongoing or upcoming
        });

        setTodaysTasks(todaysTasks);
        setUpcomingTasks(upcomingTasks);

        // Fetch reports
        await fetchReports();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchDelegations = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:5000/api/delegations", {
          headers: { Authorization: token },
        });
        console.log("Fetched delegations:", response.data); // Debugging log
        setDelegations(response.data);
      } catch (error) {
        console.error("Error fetching delegations:", error);
      }
    };

    fetchDelegations();
  }, []);

  const fetchReports = async () => {
    const token = localStorage.getItem("token");

    try {
      const reportResponse = await axios.get("http://localhost:5000/api/reports", {
        headers: { Authorization: token },
      });
      setReports(reportResponse.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const handleCompleteTask = async (task) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`http://localhost:5000/api/checklists/${task.id}/complete`, {}, {
        headers: { Authorization: token },
      });

      // Update today's tasks locally
      setTodaysTasks((prevTasks) =>
        prevTasks.filter((t) => t.id !== task.id)
      );
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const isTaskCompletedToday = (task) => {
    if (!task.lastCompletedDate) return false;
    const lastCompletedDate = new Date(task.lastCompletedDate);
    const today = new Date();
    return lastCompletedDate.toDateString() === today.toDateString();
  };

  const handleCompleteDelegation = async (delegation) => {
    const token = localStorage.getItem("token");
    try {
      const today = new Date();
      const plannedDate = new Date(delegation.planneddate);
  
      // Determine progress based on the planned date
      const progress = today <= plannedDate ? "completed" : "pending";
  
      // Send the update request to the backend
      await axios.put(
        `http://localhost:5000/api/delegations/${delegation.id}/complete`,
        { progress }, // Send the progress in the request body
        { headers: { Authorization: token } }
      );
  
      // Update delegations locally
      setDelegations((prevDelegations) =>
        prevDelegations.map((d) =>
          d.id === delegation.id ? { ...d, progress } : d
        )
      );
    } catch (error) {
      console.error("Error completing delegation:", error);
    }
  };

  const handleCompleteReport = async (report) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `http://localhost:5000/api/reports/${report.id}/complete`,
        {},
        { headers: { Authorization: token } }
      );
  
      console.log("Backend response:", response.data);
      const updatedReport = response.data.report;
  
      // Update state with the new progress and completion date
      setReports((prevReports) =>
        prevReports.map((r) =>
          r.id === report.id
            ? { ...r, progress: updatedReport.progress, completionDate: updatedReport.completionDate }
            : r
        )
      );
    } catch (error) {
      console.error("Error completing report:", error);
    }
  };
  

  const renderTabContent = () => {
    switch (activeTab) {
      case "checklist":
        return (
          <>
            <div className="tasks-header">
              <h2>Today's Tasks</h2>
            </div>

            {isLoading ? (
              <div className="loading-state">
                <p>Loading your tasks...</p>
              </div>
            ) : (
              <>
                {todaysTasks.length > 0 ? (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Task</th>
                          <th>Customer</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Check</th>
                        </tr>
                      </thead>
                      <tbody>
                        {todaysTasks.map((task, index) => (
                          <tr key={index}>
                            <td>{task.taskname}</td>
                            <td>{task.custname}</td>
                            <td>{new Date(task.startdate).toLocaleDateString()}</td>
                            <td>{new Date(task.enddate).toLocaleDateString()}</td>
                            <td>
                              <button
                                onClick={() => handleCompleteTask(task)}
                                disabled={isTaskCompletedToday(task)}
                              >
                                ✔️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No tasks found for today.</p>
                  </div>
                )}
              </>
            )}

            <div className="tasks-header">
              <h2>Upcoming Tasks</h2>
            </div>

            {isLoading ? (
              <div className="loading-state">
                <p>Loading your tasks...</p>
              </div>
            ) : (
              <>
                {upcomingTasks.length > 0 ? (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Task</th>
                          <th>Customer</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {upcomingTasks.map((task, index) => (
                          <tr key={index}>
                            <td>{task.taskname}</td>
                            <td>{task.custname}</td>
                            <td>{new Date(task.startdate).toLocaleDateString()}</td>
                            <td>{new Date(task.enddate).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No upcoming tasks found.</p>
                  </div>
                )}
              </>
            )}
          </>
        );
        case "delegation":
          return (
            <>
              <div className="tasks-header">
                <h2>Delegations</h2>
              </div>
        
              {isLoading ? (
                <div className="loading-state">
                  <p>Loading delegations...</p>
                </div>
              ) : (
                <>
                  {delegations.length > 0 ? (
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>Employee Name</th>
                            <th>Customer Name</th>
                            <th>Task</th>
                            <th>Planned Date</th>
                            <th>Progress</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {delegations.map((delegation, index) => (
                            <tr key={index}>
                              <td>{delegation.empname}</td>
                              <td>{delegation.custname}</td>
                              <td>{delegation.task}</td>
                              <td>{new Date(delegation.planneddate).toLocaleDateString()}</td>
                              <td>{delegation.progress || "pending"}</td>
                              <td>
                                <button
                                  onClick={() => handleCompleteDelegation(delegation)}
                                  disabled={delegation.progress === "completed"}
                                >
                                  ✔️
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>No delegations found.</p>
                    </div>
                  )}
                </>
              )}
            </>
          );
      case "report":
        return (
          <>
            <div className="tasks-header">
              <h2>Reports</h2>
            </div>

            {isLoading ? (
              <div className="loading-state">
                <p>Loading reports...</p>
              </div>
            ) : (
              <>
                {reports.length > 0 ? (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Progress</th>
                          <th>Completion Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map((report, index) => (
                          <tr key={index}>
                            <td>{report.name}</td>
                            <td>{new Date(report.startDate).toLocaleDateString()}</td>
                            <td>{new Date(report.endDate).toLocaleDateString()}</td>
                            <td>{report.progress || "pending"}</td>
                            <td>
                              {report.completionDate
                                ? new Date(report.completionDate).toLocaleDateString()
                                : "N/A"}
                              </td>
                              <td>
                                <button
                                  onClick={() => handleCompleteReport(report)}
                                  disabled={report.progress === "completed"}
                                >
                                  ✔️
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>No reports found.</p>
                    </div>
                  )}
                </>
              )}
            </>
          );
      default:
        return null;
    }
  };

  return (
    <div className="home-container">
      <Sidebar />
      <h1 className="welcome-text">Hello, {userName}!</h1>
      <div className="main-content">
        <div className="tabs-container">
          <div
            className={`tab ${activeTab === "checklist" ? "active" : ""}`}
            onClick={() => setActiveTab("checklist")}
          >
            Checklist
          </div>
          <div
            className={`tab ${activeTab === "delegation" ? "active" : ""}`}
            onClick={() => setActiveTab("delegation")}
          >
            Delegation
          </div>
          <div
            className={`tab ${activeTab === "report" ? "active" : ""}`}
            onClick={() => setActiveTab("report")}
          >
            Report
          </div>
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
};

export default Home;