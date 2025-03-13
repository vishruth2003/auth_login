import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Home.css";
import Sidebar from "./Sidebar.js";

const Home = () => {
  const [userName, setUserName] = useState("");
  const [checklists, setChecklists] = useState([]);
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
        setChecklists(checklistResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="home-container">
      <Sidebar />
      <h1 className="welcome-text">Hello, {userName}!</h1>
      <div className="main-content">
        <div className="tasks-header">
          <h2>Your Tasks</h2>
        </div>
        
        {isLoading ? (
          <div className="loading-state">
            <p>Loading your tasks...</p>
          </div>
        ) : (
          <>
            {checklists.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Customer</th>
                      <th>Frequency</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checklists.map((checklist, index) => (
                      <tr key={index}>
                        <td>{checklist.taskname}</td>
                        <td>{checklist.custname}</td>
                        <td>{checklist.frequency}</td>
                        <td>{new Date(checklist.startdate).toLocaleDateString()}</td>
                        <td>{new Date(checklist.enddate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No tasks found. Create a new task to get started!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;