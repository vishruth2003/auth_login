import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import "../styles/Checklist.css";
import "../styles/Dashboard.css"; 
import Sidebar from "./Sidebar";

const Dashboard = () => {
  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  const [checklists, setChecklists] = useState([]);
  const [delegations, setDelegations] = useState([]);
  const [reports, setReports] = useState([]);
  const [loadingChecklists, setLoadingChecklists] = useState(true);
  const [loadingDelegations, setLoadingDelegations] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); 

  const username = localStorage.getItem("username");

  const isCompleted = (progress) => {
    if (!progress) return false;
    
    const progressStr = String(progress).trim().toLowerCase();
    
    return progressStr === "complete" || 
           progressStr === "completed";
  };

  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/checklists", {
          headers: { username },
        });
        setChecklists(response.data);
        console.log("Checklist data:", response.data); 
      } catch (error) {
        console.error("Error fetching checklist data:", error);
      } finally {
        setLoadingChecklists(false);
      }
    };

    const fetchDelegations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/delegations", {
          headers: { username },
        });
        setDelegations(response.data);
        console.log("Delegation data:", response.data); 
      } catch (error) {
        console.error("Error fetching delegation data:", error);
      } finally {
        setLoadingDelegations(false);
      }
    };

    const fetchReports = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/reports", {
          headers: { username },
        });
        setReports(response.data);
        console.log("Report data:", response.data); 
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoadingReports(false);
      }
    };

    fetchChecklists();
    fetchDelegations();
    fetchReports();
  }, [username]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const stats = useMemo(() => {
    const checklistStats = {
      completed: checklists.filter(item => isCompleted(item.progress)).length,
      pending: checklists.filter(item => !isCompleted(item.progress)).length,
      total: checklists.length
    };

    const delegationStats = {
      completed: delegations.filter(item => isCompleted(item.progress)).length,
      pending: delegations.filter(item => !isCompleted(item.progress)).length,
      total: delegations.length
    };

    const reportStats = {
      completed: reports.filter(item => isCompleted(item.progress)).length,
      pending: reports.filter(item => !isCompleted(item.progress)).length,
      total: reports.length
    };

    const progressData = [
      {
        name: "Checklists",
        Completed: checklistStats.completed,
        Pending: checklistStats.pending
      },
      {
        name: "Delegations",
        Completed: delegationStats.completed,
        Pending: delegationStats.pending
      },
      {
        name: "Reports",
        Completed: reportStats.completed,
        Pending: reportStats.pending
      }
    ];

    const pieData = [
      { name: "Checklists", value: checklistStats.total },
      { name: "Delegations", value: delegationStats.total },
      { name: "Reports", value: reportStats.total }
    ];

    const getMonthlyData = () => {
      const monthlyData = {};
      
      checklists.forEach(item => {
        const date = new Date(item.startdate);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = { month: monthYear, checklists: 0, delegations: 0, reports: 0 };
        }
        monthlyData[monthYear].checklists++;
      });
      
      delegations.forEach(item => {
        const date = new Date(item.planneddate);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = { month: monthYear, checklists: 0, delegations: 0, reports: 0 };
        }
        monthlyData[monthYear].delegations++;
      });
      
      reports.forEach(item => {
        const date = new Date(item.startDate);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = { month: monthYear, checklists: 0, delegations: 0, reports: 0 };
        }
        monthlyData[monthYear].reports++;
      });
      
      return Object.values(monthlyData).sort((a, b) => {
        const [aMonth, aYear] = a.month.split('/');
        const [bMonth, bYear] = b.month.split('/');
        return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
      });
    };

    return {
      checklists: checklistStats,
      delegations: delegationStats,
      reports: reportStats,
      progressData,
      pieData,
      monthlyData: getMonthlyData()
    };
  }, [checklists, delegations, reports]);

  const COLORS = ['#4776E6', '#8E54E9', '#2ecc71', '#e74c3c'];

  const isLoading = loadingChecklists || loadingDelegations || loadingReports;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1 className="dashboard-heading">Dashboard</h1>
        
        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'checklists' ? 'active' : ''}`}
            onClick={() => setActiveTab('checklists')}
          >
            Checklists
          </button>
          <button 
            className={`tab-button ${activeTab === 'delegations' ? 'active' : ''}`}
            onClick={() => setActiveTab('delegations')}
          >
            Delegations
          </button>
          <button 
            className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </div>

        {isLoading ? (
          <div className="dashboard-loading">
            <div className="dashboard-spinner"></div>
            <p>Loading data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="dashboard-overview">
                <div className="stats-cards">
                  <div className="stat-card checklist-card">
                    <h3>Checklists</h3>
                    <div className="stat-numbers">
                      <div className="stat-item">
                        <span className="stat-value">{stats.checklists.total}</span>
                        <span className="stat-label">Total</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">{stats.checklists.completed}</span>
                        <span className="stat-label">Completed</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">{stats.checklists.pending}</span>
                        <span className="stat-label">Pending</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="stat-card delegation-card">
                    <h3>Delegations</h3>
                    <div className="stat-numbers">
                      <div className="stat-item">
                        <span className="stat-value">{stats.delegations.total}</span>
                        <span className="stat-label">Total</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">{stats.delegations.completed}</span>
                        <span className="stat-label">Completed</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">{stats.delegations.pending}</span>
                        <span className="stat-label">Pending</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="stat-card report-card">
                    <h3>Reports</h3>
                    <div className="stat-numbers">
                      <div className="stat-item">
                        <span className="stat-value">{stats.reports.total}</span>
                        <span className="stat-label">Total</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">{stats.reports.completed}</span>
                        <span className="stat-label">Completed</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">{stats.reports.pending}</span>
                        <span className="stat-label">Pending</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="chart-container">
                  <h2 className="chart-title">Task Completion Status</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={stats.progressData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Completed" stackId="a" fill="#2ecc71" />
                      <Bar dataKey="Pending" stackId="a" fill="#e74c3c" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-container">
                  <h2 className="chart-title">Task Distribution</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {stats.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-container">
                  <h2 className="chart-title">Monthly Distribution</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={stats.monthlyData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="checklists" stroke="#4776E6" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="delegations" stroke="#8E54E9" />
                      <Line type="monotone" dataKey="reports" stroke="#2ecc71" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === 'checklists' && (
              <div className="dashboard-tab-content">
                <div className="stats-summary">
                  <div className="stat-pill">
                    <span className="stat-title">Total</span>
                    <span className="stat-count">{stats.checklists.total}</span>
                  </div>
                  <div className="stat-pill completed">
                    <span className="stat-title">Completed</span>
                    <span className="stat-count">{stats.checklists.completed}</span>
                  </div>
                  <div className="stat-pill pending">
                    <span className="stat-title">Pending</span>
                    <span className="stat-count">{stats.checklists.pending}</span>
                  </div>
                </div>

                <div className="chart-container">
                  <h2 className="chart-title">Completion Status</h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Completed', value: stats.checklists.completed },
                          { name: 'Pending', value: stats.checklists.pending }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#2ecc71" />
                        <Cell fill="#e74c3c" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="checklists-table-container">
                  <h2 className="checklist-title">Checklist Details</h2>
                  <table className="checklists-table">
                    <thead>
                      <tr>
                        <th>Employee Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Progress</th>
                        <th>Last Completed Date</th>
                        <th>Frequency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {checklists.map((checklist, index) => (
                        <tr key={index}>
                          <td>{checklist.empname}</td>
                          <td>{formatDate(checklist.startdate)}</td>
                          <td>{formatDate(checklist.enddate)}</td>
                          <td className={isCompleted(checklist.progress) ? "completed-progress" : "pending-progress"}>
                            {checklist.progress || "N/A"}
                          </td>
                          <td>{checklist.lastCompletedDate ? formatDate(checklist.lastCompletedDate) : "N/A"}</td>
                          <td>{checklist.frequency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'delegations' && (
              <div className="dashboard-tab-content">
                <div className="stats-summary">
                  <div className="stat-pill">
                    <span className="stat-title">Total</span>
                    <span className="stat-count">{stats.delegations.total}</span>
                  </div>
                  <div className="stat-pill completed">
                    <span className="stat-title">Completed</span>
                    <span className="stat-count">{stats.delegations.completed}</span>
                  </div>
                  <div className="stat-pill pending">
                    <span className="stat-title">Pending</span>
                    <span className="stat-count">{stats.delegations.pending}</span>
                  </div>
                </div>

                <div className="chart-container">
                  <h2 className="chart-title">Completion Status</h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Completed', value: stats.delegations.completed },
                          { name: 'Pending', value: stats.delegations.pending }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#2ecc71" />
                        <Cell fill="#e74c3c" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="delegations-table-container">
                  <h2 className="delegation-title">Delegation Details</h2>
                  <table className="delegations-table">
                    <thead>
                      <tr>
                        <th>Employee Name</th>
                        <th>Task</th>
                        <th>Planned Date</th>
                        <th>Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {delegations.map((delegation, index) => (
                        <tr key={index}>
                          <td>{delegation.empname}</td>
                          <td>{delegation.task}</td>
                          <td>{formatDate(delegation.planneddate)}</td>
                          <td className={isCompleted(delegation.progress) ? "completed-progress" : "pending-progress"}>
                            {delegation.progress || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="dashboard-tab-content">
                <div className="stats-summary">
                  <div className="stat-pill">
                    <span className="stat-title">Total</span>
                    <span className="stat-count">{stats.reports.total}</span>
                  </div>
                  <div className="stat-pill completed">
                    <span className="stat-title">Completed</span>
                    <span className="stat-count">{stats.reports.completed}</span>
                  </div>
                  <div className="stat-pill pending">
                    <span className="stat-title">Pending</span>
                    <span className="stat-count">{stats.reports.pending}</span>
                  </div>
                </div>

                <div className="chart-container">
                  <h2 className="chart-title">Completion Status</h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Completed', value: stats.reports.completed },
                          { name: 'Pending', value: stats.reports.pending }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#2ecc71" />
                        <Cell fill="#e74c3c" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="reports-table-container">
                  <h2 className="report-title">Report Details</h2>
                  <table className="reports-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Progress</th>
                        <th>Completion Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((report, index) => (
                        <tr key={index}>
                          <td>{report.name}</td>
                          <td>{formatDate(report.startDate)}</td>
                          <td>{formatDate(report.endDate)}</td>
                          <td className={isCompleted(report.progress) ? "completed-progress" : "pending-progress"}>
                            {report.progress || "N/A"}
                          </td>
                          <td>{report.completionDate ? formatDate(report.completionDate) : "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;