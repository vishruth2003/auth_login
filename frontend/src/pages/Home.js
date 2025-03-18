import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Home.css";
import Sidebar from "./Sidebar.js";

const Home = () => {
  const [userName, setUserName] = useState("");
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        const { todaysTasks, upcomingTasks } = separateTasks(checklistResponse.data.filter(checklist => checklist.progress !== 'end'));
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

  const handleCompleteTask = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`http://localhost:5000/api/checklists/${id}/complete`, {}, {
        headers: { Authorization: token },
      });
      setTodaysTasks(todaysTasks.filter(task => task.id !== id));
      setUpcomingTasks(upcomingTasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };

  const separateTasks = (checklists) => {
    const today = new Date().toDateString();
    const todaysTasks = [];
    const upcomingTasks = [];

    checklists.forEach((checklist) => {
      const startDate = new Date(checklist.startdate);
      const endDate = new Date(checklist.enddate);
      const todayDate = new Date();

      if (startDate.toDateString() === today && endDate >= todayDate && !isWeekend(todayDate)) {
        todaysTasks.push(checklist);
      }

      if (startDate <= todayDate && endDate >= todayDate) {
        upcomingTasks.push(checklist);
      }
    });

    return { todaysTasks, upcomingTasks };
  };

  return (
    <div className="home-container">
      <Sidebar />
      <h1 className="welcome-text">Hello, {userName}!</h1>
      <div className="main-content">
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
                      <th>Complete</th>
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
                          <button onClick={() => handleCompleteTask(task.id)}>✔️</button>
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
      </div>
    </div>
  );
};

export default Home;