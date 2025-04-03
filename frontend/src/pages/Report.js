import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar.js";
import "../styles/Report.css";

const Report = () => {
  useEffect(() => {
    document.title = "Report";
  }, []);

  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem("reports")) || [];
    setReports(savedReports);

    axios.get("http://localhost:5000/api/reports")
      .then((response) => {
        setReports(response.data);
        localStorage.setItem("reports", JSON.stringify(response.data)); 
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
      });

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

    window.addEventListener("beforeunload", () => {
      localStorage.removeItem("reports");
    });

    return () => {
      window.removeEventListener("beforeunload", () => {
        localStorage.removeItem("reports");
      });
    };
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

    axios.post("http://localhost:5000/api/reports/create-report", formData)
      .then((response) => {
        setShowModal(true);

        const updatedReports = [...reports, formData];
        setReports(updatedReports);
        localStorage.setItem("reports", JSON.stringify(updatedReports)); 

        setFormData({ name: "", startDate: "", endDate: "" });

        setTimeout(() => {
          setShowModal(false);
        }, 2000);

        setShowForm(false);
      })
      .catch((error) => {
        console.error("Error submitting report:", error);
      });
  };

  const formatDate = (dateString) => {
    if (!dateString) return ""; 
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : date.toLocaleDateString(); 
  };
  

  return (
    <div className="report-container">
      <Sidebar />
      <div className="report-content">
        <h1>Report Page</h1>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <p>Report created successfully!</p>
            </div>
          </div>
        )}

        <table className="report-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
  {reports.length > 0 ? (
    reports.map((report, index) => (
      <tr key={index}>
        <td>{report.name || ""}</td>
        <td>{formatDate(report.startDate)}</td>
        <td>{formatDate(report.endDate)}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="3" style={{ textAlign: "center" }}>No reports created</td>
    </tr>
  )}
</tbody>

        </table>

        <button onClick={() => setShowForm(true)} className="create-report-btn">
          Create Report
        </button>

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
    users.map((user, index) => (
      <option key={index} value={user.userName}>
        {user.userName}
      </option>
    ))
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

                <button type="submit">Submit Report</button>
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
