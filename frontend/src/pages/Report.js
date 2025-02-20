import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar.js";
import "./Report.css";

const Report = () => {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editReportIndex, setEditReportIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users when component mounts
  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5000/api/reports/names")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again.");
        setLoading(false);
      });
  }, []);

  // Fetch existing reports when component mounts
  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5000/api/reports")
      .then((response) => {
        setReports(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
        setError("Failed to load reports. Please try again.");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.startDate || !formData.endDate) {
      console.error("All fields are required.");
      return;
    }

    // Check if a report with this name already exists
    const existingReportIndex = reports.findIndex(
      (report) => report.name === formData.name
    );

    // If it exists, set editReportIndex to update that report
    if (existingReportIndex !== -1 && editReportIndex === null) {
      setEditReportIndex(existingReportIndex);
    }

    axios.post("http://localhost:5000/api/reports/create-report", formData)
      .then((response) => {
        setShowModal(true);

        let updatedReports;
        if (editReportIndex !== null) {
          updatedReports = [...reports];
          updatedReports[editReportIndex] = response.data;
        } else if (existingReportIndex !== -1) {
          // Update existing report if name already exists
          updatedReports = [...reports];
          updatedReports[existingReportIndex] = response.data;
        } else {
          updatedReports = [...reports, response.data];
        }

        setReports(updatedReports);

        // Clear form fields
        setFormData({
          name: "",
          startDate: "",
          endDate: "",
        });

        setTimeout(() => {
          setShowModal(false);
        }, 2000);

        setShowForm(false);
        setEditReportIndex(null);
      })
      .catch((error) => {
        console.error("Error submitting report:", error);
      });
  };

  const handleEdit = (index) => {
    setEditReportIndex(index);
    setFormData(reports[index]);
    setShowForm(true);
  };

  // Function to extract the appropriate field from user objects
  const getUserDisplayName = (user) => {
    if (user.name) return user.name;
    if (user.userName) return user.userName;
    if (user.fullName) return user.fullName;
    if (user.username) return user.username;
    return JSON.stringify(user);
  };

  // Function to format dates (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Return original if invalid
      
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return original on error
    }
  };

  return (
    <div className="report-container">
      <Sidebar />
      <div className="report-content">
        <h1>Report Page</h1>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <p>Report created/updated successfully!</p>
            </div>
          </div>
        )}

        {/* Report Table - Only shown if reports exist */}
        {reports.length > 0 && (
          <table className="report-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={index}>
                  <td>{report.name}</td>
                  <td>{formatDate(report.startDate)}</td>
                  <td>{formatDate(report.endDate)}</td>
                  <td>
                    <button onClick={() => handleEdit(index)} className="edit-btn">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button onClick={() => setShowForm(true)} className="create-report-btn">
          Create Report
        </button>

        {/* Form for creating or editing a report */}
        {showForm && (
          <div className="form-modal">
            <div className="form-modal-content">
              <form className="report-form" onSubmit={handleSubmit}>
                <label>Name:</label>
                <select 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required
                >
                  <option value="" disabled>Select User</option>
                  {loading ? (
                    <option disabled>Loading users...</option>
                  ) : error ? (
                    <option disabled>{error}</option>
                  ) : users.length > 0 ? (
                    users.map((user, index) => {
                      const displayName = getUserDisplayName(user);
                      return (
                        <option key={index} value={displayName}>
                          {displayName}
                        </option>
                      );
                    })
                  ) : (
                    <option disabled>No users found</option>
                  )}
                </select>

                <label>Start Date:</label>
                <input 
                  type="date" 
                  name="startDate" 
                  value={formData.startDate} 
                  onChange={handleChange} 
                  required 
                />

                <label>End Date:</label>
                <input 
                  type="date" 
                  name="endDate" 
                  value={formData.endDate} 
                  onChange={handleChange} 
                  required 
                />

                <button type="submit">{editReportIndex !== null ? "Update Report" : "Submit Report"}</button>
                <button type="button" onClick={() => setShowForm(false)}>Close</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;