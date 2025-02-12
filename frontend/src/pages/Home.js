import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get("http://localhost:5000/auth/user", {
          headers: { Authorization: token },
        });
        setUserName(response.data.userName);
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();
  }, []);

  return (
    <div className="home-container">
      {/* Sidebar */}
      <div className="sidebar">
        <ul>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/checklist">Checklist</Link></li>
          <li><Link to="/delegation">Delegation</Link></li>
          <li><Link to="/report">Report</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1 className="welcome-text">Welcome, {userName}!</h1>
      </div>
    </div>
  );
};

export default Home;
