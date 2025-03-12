import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import Sidebar from "./Sidebar.js";

const Profile = () => {
  const [user, setUser] = useState({
    userName: "",
    userPhone: "",
    roleId: "",
    roleName: "",
    projectStatus: "",
    department: "",
  });
  const [originalUser, setOriginalUser] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get("http://localhost:5000/auth/profile", {
          headers: { Authorization: token },
        });
        
        const userData = response.data.user;
        setUser(userData);
        setOriginalUser(userData);

        if (userData.userName && userData.userPhone && userData.roleId && userData.roleName && userData.projectStatus && userData.department) {
          setIsEditing(false);
        }
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
      setOriginalUser(user);
      setTimeout(() => {
        setShowModal(false);
        setIsEditing(false);
        navigate("/home");
      }, 2000);
      
    } catch (error) {
      setError("Failed to update profile.");
    }
  };

  const handleCancelEdit = () => {
    setUser(originalUser);
    setIsEditing(false);
  };

  return (
    <div>
      <Sidebar />
      <div className="profile-container">
        <h1 className="profile-title">Profile Page</h1>
        {error && <div className="profile-error">{error}</div>}

        {showModal && (
          <div className="profile-modal">
            <div className="profile-modal-content">
              <p>Profile updated successfully!</p>
            </div>
          </div>
        )}

        {!isEditing ? (
          <div className="profile-card">
            <h2>{user.userName}</h2>
            <p><strong>Phone:</strong> {user.userPhone}</p>
            <p><strong>Role ID:</strong> {user.roleId}</p>
            <p><strong>Role Name:</strong> {user.roleName}</p>
            <p><strong>Project Status:</strong> {user.projectStatus}</p>
            <p><strong>Department:</strong> {user.department}</p>
            <button className="profile-edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="profile-form">
            <div className="profile-form-group">
              <label>User Name:</label>
              <input type="text" className="profile-input" value={user.userName} onChange={(e) => setUser({ ...user, userName: e.target.value })} required />
            </div>
            <div className="profile-form-group">
              <label>Phone:</label>
              <input type="text" className="profile-input" value={user.userPhone} onChange={(e) => setUser({ ...user, userPhone: e.target.value })} required />
            </div>
            <div className="profile-form-group">
              <label>Role ID:</label>
              <input type="text" className="profile-input" value={user.roleId} onChange={(e) => setUser({ ...user, roleId: e.target.value })} required />
            </div>
            <div className="profile-form-group">
              <label>Role Name:</label>
              <input type="text" className="profile-input" value={user.roleName} onChange={(e) => setUser({ ...user, roleName: e.target.value })} required />
            </div>
            <div className="profile-form-group">
              <label>Project Status:</label>
              <input type="text" className="profile-input" value={user.projectStatus} onChange={(e) => setUser({ ...user, projectStatus: e.target.value })} required />
            </div>
            <div className="profile-form-group">
              <label>Department:</label>
              <input type="text" className="profile-input" value={user.department} onChange={(e) => setUser({ ...user, department: e.target.value })} required />
            </div>
            <div className="profile-button-group">
              <button type="submit" className="profile-submit-btn">Update Profile</button>
              <button type="button" className="profile-cancel-btn" onClick={handleCancelEdit}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
