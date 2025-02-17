import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import Sidebar from "./Sidebar.js";


const Profile = () => {
  const [user, setUser] = useState({
    userName: "",
    userPhone: "",
    roleId: "",
    roleName: "",
    projectStatus: "",
  });
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get("http://localhost:5000/auth/profile", {
          headers: { Authorization: token },
        });
        setUser(response.data.user); 
      } catch (error) {
        setError("Failed to load user profile.");
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put("http://localhost:5000/auth/updateProfile", user, {
        headers: { Authorization: token },
      });

      setShowModal(true); 

      setTimeout(() => {
        setShowModal(false);
        navigate("/home"); 
      }, 2000);
      
    } catch (error) {
      setError("Failed to update profile.");
    }
  };

  return (
    <div>
      <h1>Profile Page</h1>
      <Sidebar/>
      {error && <div style={{ color: "red" }}>{error}</div>}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Profile updated successfully!</p>
          </div>
        </div>
      )}

      <form onSubmit={handleUpdateProfile}>
        <div>
          <label>User Name:</label>
          <input
            type="text"
            value={user.userName}
            onChange={(e) => setUser({ ...user, userName: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            value={user.userPhone}
            onChange={(e) => setUser({ ...user, userPhone: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Role ID:</label>
          <input
            type="text"
            value={user.roleId}
            onChange={(e) => setUser({ ...user, roleId: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Role Name:</label>
          <input
            type="text"
            value={user.roleName}
            onChange={(e) => setUser({ ...user, roleName: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Project Status:</label>
          <input
            type="text"
            value={user.projectStatus}
            onChange={(e) => setUser({ ...user, projectStatus: e.target.value })}
            required
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
