import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import Sidebar from "./Sidebar.js";

const Profile = () => {
  useEffect(() => {
    document.title = "Profile";
  }, []);

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
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/auth/profile", {
          headers: { Authorization: token },
        });
        
        const userData = response.data.user;
        setUser(userData);
        setOriginalUser(userData);

        const isProfileIncomplete = !userData.userName || !userData.userPhone || 
                                   !userData.roleId || !userData.roleName || 
                                   !userData.projectStatus || !userData.department;
        
        setIsEditing(isProfileIncomplete);
      } catch (error) {
        setError("Failed to load user profile. Please try again later.");
        console.error("Profile loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      await axios.put("http://localhost:5000/auth/updateProfile", user, {
        headers: { Authorization: token },
      });

      setSuccess("Profile updated successfully!");
      setShowModal(true);
      setOriginalUser(user);
      setTimeout(() => {
        setShowModal(false);
        setIsEditing(false);
        navigate("/tasks");
      }, 2000);
      
    } catch (error) {
      console.error("Update profile error:", error);
      setError(error.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    if (error) setError("");
  };

  const handleCancelEdit = () => {
    setUser(originalUser);
    setIsEditing(false);
    setError("");
  };

  return (
    <div>
      <Sidebar />
      <div className="profile-container">
        <h1 className="profile-title">My Profile</h1>
        
        {error && <div className="profile-error">{error}</div>}
        {success && <div className="profile-success">{success}</div>}

        {showModal && (
          <div className="profile-modal">
            <div className="profile-modal-content">
              <p>Profile updated successfully!</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="profile-loading">
            <div className="profile-spinner"></div>
            <p>Loading your profile...</p>
          </div>
        ) : !isEditing ? (
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {user.userName ? user.userName.charAt(0).toUpperCase() : "U"}
              </div>
              <h2>{user.userName || "Complete Your Profile"}</h2>
            </div>

            <div className="profile-info">
              <p><strong>Name:</strong> {user.userName || "Not set"}</p>
              <p><strong>Phone:</strong> {user.userPhone || "Not set"}</p>
              <p><strong>Role ID:</strong> {user.roleId || "Not set"}</p>
              <p><strong>Role Name:</strong> {user.roleName || "Not set"}</p>
              <p><strong>Department:</strong> {user.department || "Not set"}</p>
              <p><strong>Project Status:</strong> <span className={`status-badge ${user.projectStatus?.toLowerCase()}`}>{user.projectStatus || "Not set"}</span></p>
            </div>
            
            <button className="profile-edit-btn" onClick={() => setIsEditing(true)}>
              <span className="edit-icon">✏️</span> Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="profile-form">
            <div className="profile-form-group">
              <label htmlFor="userName">Full Name:</label>
              <input 
                type="text" 
                id="userName"
                name="userName"
                className="profile-input" 
                value={user.userName} 
                onChange={handleInputChange} 
                placeholder="Enter your full name"
                required 
              />
            </div>
            
            <div className="profile-form-group">
              <label htmlFor="userPhone">Phone Number:</label>
              <input 
                type="tel" 
                id="userPhone"
                name="userPhone"
                className="profile-input" 
                value={user.userPhone} 
                onChange={handleInputChange} 
                placeholder="Enter your phone number"
                required 
              />
            </div>
            
            <div className="profile-form-group">
              <label htmlFor="roleId">Role ID:</label>
              <input 
                type="text" 
                id="roleId"
                name="roleId"
                className="profile-input" 
                value={user.roleId} 
                onChange={handleInputChange} 
                placeholder="Enter your role ID"
                required 
              />
            </div>
            
            <div className="profile-form-group">
              <label htmlFor="roleName">Role Title:</label>
              <input 
                type="text" 
                id="roleName"
                name="roleName"
                className="profile-input" 
                value={user.roleName} 
                onChange={handleInputChange} 
                placeholder="Enter your role title"
                required 
              />
            </div>
            
            <div className="profile-form-group">
              <label htmlFor="department">Department:</label>
              <select 
                id="department"
                name="department"
                className="profile-input" 
                value={user.department} 
                onChange={handleInputChange} 
                required
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Customer Support">Customer Support</option>
              </select>
            </div>
            
            <div className="profile-form-group">
              <label htmlFor="projectStatus">Project Status:</label>
              <select 
                id="projectStatus"
                name="projectStatus"
                className="profile-input" 
                value={user.projectStatus} 
                onChange={handleInputChange} 
                required
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="OnLeave">On Leave</option>
                <option value="Training">Training</option>
              </select>
            </div>
            
            <div className="profile-button-group">
              <button 
                type="submit" 
                className="profile-submit-btn" 
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
              <button 
                type="button" 
                className="profile-cancel-btn" 
                onClick={handleCancelEdit}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;