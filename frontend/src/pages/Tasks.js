import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Tasks.css";
import Sidebar from "./Sidebar.js";
import React from "react";

const Home = () => {
  useEffect(() => {
    document.title = "Tasks";
  }, []);

  const [userName, setUserName] = useState("");
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [delegations, setDelegations] = useState([]); 
  const [reports, setReports] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("checklist");
  const [activeSubTab, setActiveSubTab] = useState("today");

  const isTaskCompletedToday = (task) => {
    if (!task.lastCompletedDate) return false;
    const lastCompletedDate = new Date(task.lastCompletedDate);
    const today = new Date();
    return (
      lastCompletedDate.toDateString() === today.toDateString() &&
      task.completedToday
    );
  };

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

        const allTasks = checklistResponse.data;
        const today = new Date();

        // Filter tasks for different categories
        const todaysTasks = allTasks.filter((task) => {
          const startDate = new Date(task.startdate);
          const endDate = new Date(task.enddate);
          return (
            today >= startDate &&
            today <= endDate &&
            today.toDateString() === startDate.toDateString() &&
            !isTaskCompletedToday(task)
          );
        });

        const upcomingTasks = allTasks.filter((task) => {
          const startDate = new Date(task.startdate);
          const endDate = new Date(task.enddate);
          return (
            (startDate > today || (startDate <= today && endDate >= today)) &&
            task.progress !== "end"
          );
        });

        const completedTasks = allTasks.filter((task) => {
          return task.progress === "end" || task.progress === "completed"; // Only include tasks explicitly marked as completed
        });

        const pendingTasks = allTasks.filter((task) => {
          const endDate = new Date(task.enddate);
          const today = new Date();
          return (
            today > endDate && // Task is past its end date
            task.progress !== "end" && // Task is not completed
            task.progress !== "completed" // Task is not explicitly marked as completed
          );
        });

        setTodaysTasks(todaysTasks);
        setUpcomingTasks(upcomingTasks);
        setCompletedTasks(completedTasks);
        setPendingTasks(pendingTasks);

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
        console.log("Fetched delegations:", response.data); 
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

      const today = new Date().toISOString();

      // Update today's tasks
      setTodaysTasks((prevTasks) =>
        prevTasks.filter((t) => t.id !== task.id)
      );

      // Update the task's progress locally
      setCompletedTasks((prevTasks) => [
        ...prevTasks,
        { ...task, lastCompletedDate: today, completedToday: true }
      ]);
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleCompleteDelegation = async (delegation) => {
    const token = localStorage.getItem("token");
    try {
      const today = new Date();
      const plannedDate = new Date(delegation.planneddate);
  
      const progress = today <= plannedDate ? "completed" : "pending";
  
      await axios.put(
        `http://localhost:5000/api/delegations/${delegation.id}/complete`,
        { progress },
        { headers: { Authorization: token } }
      );
  
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

  const handleUpdateRemarks = async (taskId, remarks) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/checklists/${taskId}/remarks`,
        { remarks },
        { headers: { Authorization: token } }
      );

      // Update the pendingTasks state with the new remarks
      setPendingTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, remarks } : task
        )
      );
    } catch (error) {
      console.error("Error updating remarks:", error);
    }
  };
  
  const filterDelegations = () => {
    const today = new Date();
    switch (activeSubTab) {
      case "today":
        return delegations.filter(del => {
          const plannedDate = new Date(del.planneddate);
          return plannedDate.toDateString() === today.toDateString() && del.progress !== "completed";
        });
      case "upcoming":
        return delegations.filter(del => {
          const plannedDate = new Date(del.planneddate);
          return plannedDate > today;
        });
      case "completed":
        return delegations.filter(del => del.progress === "completed");
      case "pending":
        return delegations.filter(del => {
          const plannedDate = new Date(del.planneddate);
          return plannedDate < today && del.progress !== "completed";
        });
      default:
        return delegations.filter(del => {
          const plannedDate = new Date(del.planneddate);
          return plannedDate.toDateString() === today.toDateString() && del.progress !== "completed";
        });
    }
  };

  const renderSubTabs = () => {
    return (
      <div className="subtabs-container">
        <div
          className={`subtab ${activeSubTab === "today" ? "active" : ""}`}
          onClick={() => setActiveSubTab("today")}
        >
          Today's
        </div>
        <div
          className={`subtab ${activeSubTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveSubTab("upcoming")}
        >
          Upcoming
        </div>
        <div
          className={`subtab ${activeSubTab === "completed" ? "active" : ""}`}
          onClick={() => setActiveSubTab("completed")}
        >
          Completed
        </div>
        <div
          className={`subtab ${activeSubTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveSubTab("pending")}
        >
          Pending
        </div>
      </div>
    );
  };

  const renderChecklistContent = () => {
    let tasksToShow = [];
    let title = "";

    switch (activeSubTab) {
      case "today":
        tasksToShow = todaysTasks;
        title = "Today's Tasks";
        break;
      case "upcoming":
        tasksToShow = upcomingTasks;
        title = "Upcoming & Ongoing Tasks";
        break;
      case "completed":
        tasksToShow = completedTasks;
        title = "Completed Tasks";
        break;
      case "pending":
        tasksToShow = pendingTasks;
        title = "Pending Tasks";
        break;
      default:
        tasksToShow = todaysTasks;
        title = "Today's Tasks";
    }

    return (
      <>
        <div className="tasks-header">
          <h2>{title}</h2>
        </div>

        {isLoading ? (
          <div className="loading-state">
            <p>Loading your tasks...</p>
          </div>
        ) : (
          <>
            {tasksToShow.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Customer</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      {activeSubTab === "pending" && <th>Remarks</th>}
                      {activeSubTab !== "upcoming" && activeSubTab !== "completed" && <th>Action</th>}
                      {activeSubTab === "completed" && <th>Completion Date</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {tasksToShow.map((task, index) => (
                      <tr key={index}>
                        <td>{task.taskname}</td>
                        <td>{task.custname}</td>
                        <td>{new Date(task.startdate).toLocaleDateString()}</td>
                        <td>{new Date(task.enddate).toLocaleDateString()}</td>
                        {activeSubTab === "pending" && (
                          <td>
                            <input
                              type="text"
                              placeholder="Enter remarks"
                              value={task.remarks || ""}
                              onChange={(e) =>
                                handleUpdateRemarks(task.id, e.target.value)
                              }
                            />
                          </td>
                        )}
                        {activeSubTab !== "upcoming" && activeSubTab !== "completed" && (
                          <td>
                            <button
                              onClick={() => handleCompleteTask(task)}
                              disabled={isTaskCompletedToday(task)}
                            >
                              ✔️
                            </button>
                          </td>
                        )}
                        {activeSubTab === "completed" && (
                          <td>
                            {task.lastCompletedDate
                              ? new Date(task.lastCompletedDate).toLocaleDateString()
                              : "N/A"}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No {title.toLowerCase()} found.</p>
              </div>
            )}
          </>
        )}
      </>
    );
  };

  const renderDelegationContent = () => {
    const filteredDelegations = filterDelegations();
    let title = "";

    switch (activeSubTab) {
      case "today":
        title = "Today's Delegations";
        break;
      case "upcoming":
        title = "Upcoming & Ongoing Delegations";
        break;
      case "completed":
        title = "Completed Delegations";
        break;
      case "pending":
        title = "Pending Delegations";
        break;
      default:
        title = "Today's Delegations";
    }

    return (
      <>
        <div className="tasks-header">
          <h2>{title}</h2>
        </div>

        {isLoading ? (
          <div className="loading-state">
            <p>Loading delegations...</p>
          </div>
        ) : (
          <>
            {filteredDelegations.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Employee Name</th>
                      <th>Customer Name</th>
                      <th>Task</th>
                      <th>Planned Date</th>
                      <th>Progress</th>
                      {activeSubTab !== "upcoming" && activeSubTab !== "completed" && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDelegations.map((delegation, index) => (
                      <tr key={index}>
                        <td>{delegation.empname}</td>
                        <td>{delegation.custname}</td>
                        <td>{delegation.task}</td>
                        <td>{new Date(delegation.planneddate).toLocaleDateString()}</td>
                        <td>{delegation.progress || "pending"}</td>
                        {activeSubTab !== "upcoming" && activeSubTab !== "completed" && (
                          <td>
                            <button
                              onClick={() => handleCompleteDelegation(delegation)}
                              disabled={delegation.progress === "completed"}
                            >
                              ✔️
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No {title.toLowerCase()} found.</p>
              </div>
            )}
          </>
        )}
      </>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "checklist":
        return (
          <>
            {renderSubTabs()}
            {renderChecklistContent()}
          </>
        );
      case "delegation":
        return (
          <>
            {renderSubTabs()}
            {renderDelegationContent()}
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
            onClick={() => {
              setActiveTab("checklist");
              setActiveSubTab("today");
            }}
          >
            Checklist
          </div>
          <div
            className={`tab ${activeTab === "delegation" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("delegation");
              setActiveSubTab("today");
            }}
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