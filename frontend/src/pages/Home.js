import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Home.css";
import Sidebar from "./Sidebar.js";

const Home = () => {
  const [userName, setUserName] = useState("");
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [delegations, setDelegations] = useState([]); // State for delegations
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

        // Fetch delegations for the logged-in user
        const delegationResponse = await axios.get("http://localhost:5000/api/delegations", {
          headers: { Authorization: token },
        });

        setDelegations(delegationResponse.data); // No need to filter here as the backend already filters
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
      await axios.put(`http://localhost:5000/api/delegations/${delegation.id}/complete`, {}, {
        headers: { Authorization: token },
      });

      // Update delegations locally
      setDelegations((prevDelegations) =>
        prevDelegations.map((d) =>
          d.id === delegation.id ? { ...d, progress: "completed" } : d
        )
      );
    } catch (error) {
      console.error("Error completing delegation:", error);
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
          <div className="empty-state">
            <p>Report view is coming soon.</p>
          </div>
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