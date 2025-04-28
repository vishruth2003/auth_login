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
  const [todaysDelegations, setTodaysDelegations] = useState([]);
  const [upcomingDelegations, setUpcomingDelegations] = useState([]);
  const [completedDelegations, setCompletedDelegations] = useState([]);
  const [pendingDelegations, setPendingDelegations] = useState([]);

  const shouldShowTaskToday = (task) => {
    if (!task.frequency) return true; 
    
    const today = new Date();
    const startDate = new Date(task.startdate);
    const lastCompletedDate = task.lastCompletedDate ? new Date(task.lastCompletedDate) : null;
    
    if (lastCompletedDate && lastCompletedDate.toDateString() === today.toDateString()) {
      return false;
    }
    
    if (today < startDate || today > new Date(task.enddate)) {
      return false;
    }
    
    switch (task.frequency.toLowerCase()) {
      case "daily":
        return true; 
        
      case "weekly":
        const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
        return daysSinceStart % 7 === 0;
        
      case "monthly":
        return today.getDate() === startDate.getDate();
        
      default:
        return true;
    }
  };

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

        const todaysTasks = allTasks.filter((task) => {
          const startDate = new Date(task.startdate);
          const endDate = new Date(task.enddate);
          
          return (
            today >= startDate &&
            today <= endDate &&
            !isTaskCompletedToday(task) &&
            shouldShowTaskToday(task)
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
          return task.progress === "end" || task.progress === "completed"; 
        });

        const pendingTasks = allTasks.filter((task) => {
          const endDate = new Date(task.enddate);
          const today = new Date();
          return (
            today > endDate && 
            task.progress !== "end" && 
            task.progress !== "completed" 
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
      setIsLoading(true);

      try {
        const userResponse = await axios.get("http://localhost:5000/auth/user", {
          headers: { Authorization: token },
        });
        const username = userResponse.data.userName.trim();

        const delegationsResponse = await axios.get(`http://localhost:5000/api/delegations/${username}`, {
          headers: { Authorization: token },
        });

        const allDelegations = delegationsResponse.data;
        const today = new Date();

        const isWeekend = (date) => {
          const day = date.getDay();
          return day === 0 || day === 6; 
        };

        const todaysDelegations = allDelegations.filter((delegation) => {
          const startDate = new Date(delegation.startdate);
          const endDate = new Date(delegation.planneddate);
          return (
            today >= startDate &&
            today <= endDate &&
            !isWeekend(today) &&
            delegation.progress !== "completed"
          );
        });

        const upcomingDelegations = allDelegations.filter((delegation) => {
          const startDate = new Date(delegation.startdate);
          const endDate = new Date(delegation.planneddate);
          return (
            (startDate > today || (startDate <= today && endDate >= today)) &&
            delegation.progress !== "completed"
          );
        });

        const completedDelegations = allDelegations.filter((delegation) => {
          return delegation.progress === "completed";
        });

        const pendingDelegations = allDelegations.filter((delegation) => {
          const endDate = new Date(delegation.planneddate);
          return today > endDate && delegation.progress !== "completed";
        });

        setTodaysDelegations(todaysDelegations);
        setUpcomingDelegations(upcomingDelegations);
        setCompletedDelegations(completedDelegations);
        setPendingDelegations(pendingDelegations);
      } catch (error) {
        console.error("Error fetching delegations:", error);
      } finally {
        setIsLoading(false);
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

      setTodaysTasks((prevTasks) =>
        prevTasks.filter((t) => t.id !== task.id)
      );

      setCompletedTasks((prevTasks) => [
        ...prevTasks,
        { ...task, lastCompletedDate: today, completedToday: true }
      ]);
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleCompleteChecklist = async (task) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/checklists/${task.id}/complete`,
        {},
        { headers: { Authorization: token } }
      );

      const today = new Date().toISOString();

      setTodaysTasks((prevTasks) =>
        prevTasks.filter((t) => t.id !== task.id)
      );

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
      const response = await axios.put(
        `http://localhost:5000/api/delegations/${delegation.id}/progress`,
        {}, 
        { headers: { Authorization: token } }
      );

      setTodaysDelegations((prev) =>
        prev.map((d) =>
          d.id === delegation.id
            ? { ...d, progress: response.data.progress, lastcompleteddate: new Date().toISOString() }
            : d
        )
      );

      if (response.data.progress === "completed") {
        setCompletedDelegations((prev) => [...prev, delegation]);
      }
    } catch (error) {
      console.error("Error updating delegation progress:", error);
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

      setPendingTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, remarks } : task
        )
      );
    } catch (error) {
      console.error("Error updating remarks:", error);
    }
  };

  const handleUpdateRemarksForDelegation = async (delegationId, remarks) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/delegations/${delegationId}/remarks`,
        { remarks },
        { headers: { Authorization: token } }
      );

      setPendingDelegations((prev) =>
        prev.map((delegation) =>
          delegation.id === delegationId ? { ...delegation, remarks } : delegation
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

  const getCountForSubTab = (tabType, subTabType) => {
    if (tabType === "checklist") {
      switch (subTabType) {
        case "today": return todaysTasks.length;
        case "pending": return pendingTasks.length;
        case "upcoming": return upcomingTasks.length;
        case "completed": return completedTasks.length;
        default: return 0;
      }
    } else if (tabType === "delegation") {
      switch (subTabType) {
        case "today": return todaysDelegations.length;
        case "pending": return pendingDelegations.length;
        case "upcoming": return upcomingDelegations.length;
        case "completed": return completedDelegations.length;
        default: return 0;
      }
    }
    return 0;
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "checklist": return "Checklist";
      case "delegation": return "Delegation";
      case "report": return "Report";
      default: return "Tasks";
    }
  };

  const renderSubTabs = () => {
    const subTabs = [
      { id: "today", label: "Today's" },
      { id: "pending", label: "Delayed" },
      { id: "upcoming", label: "Upcoming" },
      { id: "completed", label: "Completed" }
    ];

    return (
      <div className="subtabs-container">
        {subTabs.map(tab => (
          <div
            key={tab.id}
            className={`subtab ${activeSubTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveSubTab(tab.id)}
          >
            {tab.label}
            <span className="badge">{getCountForSubTab(activeTab, tab.id)}</span>
          </div>
        ))}
      </div>
    );
  };

  const generateUpcomingTasks = (tasks) => {
    const upcomingTasks = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
  
    tasks.forEach((task) => {
      const startDate = new Date(task.startdate);
      const endDate = new Date(task.enddate);
      const frequency = task.frequency.toLowerCase();
  
      let currentDate = new Date(startDate);
  
      while (currentDate <= endDate) {
        const day = currentDate.getDay();
  
        if (currentDate.toDateString() === today.toDateString()) {
          currentDate.setDate(currentDate.getDate() + 1);
          continue;
        }
  
        if (frequency === "daily" && day !== 0 && day !== 6) {
          upcomingTasks.push({ ...task, date: new Date(currentDate) });
        }
  
        if (frequency === "weekly" && currentDate.getDay() === startDate.getDay()) {
          upcomingTasks.push({ ...task, date: new Date(currentDate) });
        }
  
        if (
          frequency === "monthly" &&
          currentDate.getDate() === startDate.getDate()
        ) {
          upcomingTasks.push({ ...task, date: new Date(currentDate) });
        }
  
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
  
    upcomingTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  
    return upcomingTasks;
  };

  const renderChecklistContent = () => {
    let tasksToShow = [];
    let title = "";

    switch (activeSubTab) {
      case "today":
        tasksToShow = todaysTasks;
        title = "Today's Tasks";
        break;
      case "pending":
        tasksToShow = pendingTasks;
        title = "Delayed Tasks";
        break;
      case "upcoming":
        tasksToShow = generateUpcomingTasks(upcomingTasks);
        title = "Upcoming Tasks";
        break;
      case "completed":
        tasksToShow = completedTasks;
        title = "Completed Tasks";
        break;
      default:
        tasksToShow = [];
        title = "Tasks";
    }

    return (
      <>
        <div className="tasks-header">
          <h2>{title}</h2>
        </div>
        {tasksToShow.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Frequency</th>
                  {activeSubTab === "today" && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {tasksToShow.map((task, index) => (
                  <tr key={index}>
                    <td>{task.taskname}</td>
                    <td>{task.custname}</td>
                    <td>
                      {activeSubTab === "today"
                        ? new Date(task.startdate).toLocaleDateString() 
                        : new Date(task.date).toLocaleDateString()} 
                    </td>
                    <td>{task.frequency}</td>
                    {activeSubTab === "today" && (
                      <td>
                        <button
                        className ="task-complete-btn"
                          onClick={() => handleCompleteTask(task)}
                          disabled={
                            new Date(task.lastCompletedDate || 0).toDateString() ===
                            new Date().toDateString()
                          }
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
    );
  };

  const renderDelegationContent = () => {
    let delegationsToShow = [];
    let title = "";

    switch (activeSubTab) {
      case "today":
        delegationsToShow = todaysDelegations;
        title = "Today's Delegations";
        break;
      case "upcoming":
        delegationsToShow = upcomingDelegations;
        title = "Upcoming & Ongoing Delegations";
        break;
      case "completed":
        delegationsToShow = completedDelegations;
        title = "Completed Delegations";
        break;
      case "pending":
        delegationsToShow = pendingDelegations;
        title = "Delayed Delegations";
        break;
      default:
        delegationsToShow = todaysDelegations;
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
            {delegationsToShow.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Customer</th>
                      <th>Planned Date</th>
                      {activeSubTab === "today" && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {delegationsToShow.map((delegation, index) => (
                      <tr key={index}>
                        <td>{delegation.task}</td>
                        <td>{delegation.custname}</td>
                        <td>{new Date(delegation.planneddate).toLocaleDateString()}</td>
                        {activeSubTab === "today" && (
                          <td>
                            <button
                              className ="task-complete-btn"
                              onClick={() => handleCompleteDelegation(delegation)}
                              disabled={
                                new Date(delegation.lastcompleteddate || 0).toDateString() ===
                                new Date().toDateString()
                              }
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
                                  className ="task-complete-btn"
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
      <h1 className="welcome-text">{getHeaderTitle()}</h1>
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