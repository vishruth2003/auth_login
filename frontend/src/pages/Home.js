import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Home.css";
import Sidebar from "./Sidebar.js";

const Home = () => {
  const [userName, setUserName] = useState("");
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
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

        const checklistResponse = await axios.get(`http://localhost:5000/api/checklists/${username}`, {
          headers: { Authorization: token },
        });

        const { todaysTasks, upcomingTasks } = separateTasks(checklistResponse.data, username);
        setTodaysTasks(todaysTasks);
        setUpcomingTasks(upcomingTasks);
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

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };

  const separateTasks = (checklists, username) => {
    const today = new Date();
    const todaysTasks = [];
    const upcomingTasks = [];
  
    checklists.forEach((checklist) => {
      if (checklist.empname !== username) return; // Filter tasks for the logged-in user
  
      const startDate = new Date(checklist.startdate);
      const endDate = new Date(checklist.enddate);
  
      // Check if the task is within the valid date range
      if (startDate <= today && endDate >= today) {
        // Add to "Today's Tasks" based on frequency
        if (checklist.frequency === "Daily") {
          todaysTasks.push(checklist);
        } else if (checklist.frequency === "Weekly") {
          const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
          if (daysSinceStart % 7 === 0) {
            todaysTasks.push(checklist);
          }
        } else if (checklist.frequency === "Monthly") {
          if (today.getDate() === startDate.getDate()) {
            todaysTasks.push(checklist);
          }
        }
      }
  
      // Add to "Upcoming Tasks" if the task is within the date range
      if (startDate <= today && endDate >= today) {
        upcomingTasks.push(checklist);
      }
    });
  
    return { todaysTasks, upcomingTasks };
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
          <div className="empty-state">
            <p>Delegation view is coming soon.</p>
          </div>
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