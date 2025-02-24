import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import Sidebar from "./Sidebar.js";

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
      <Sidebar/>
      <div className="main-content">
        <h1 className="welcome-text">Welcome, {userName}!</h1>
      </div>
    </div>
  );
};

export default Home;
