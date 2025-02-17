import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar.js";
import "./Report.css";

const Report = () => {
  const [reports, setReports] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/reports/names")
      .then((response) => {
        setReports(response.data);
      })
      .catch((error) => {
        console.error("Error fetching report names:", error);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/reports/create-report", formData)
      .then((response) => {
        alert(response.data.message);
      })
      .catch((error) => {
        console.error("Error submitting report:", error);
      });
  };

  return (
    <div className="report-container">
      <Sidebar />
      <div className="report-content">
        <h1>Report Page</h1>
        <form className="report-form" onSubmit={handleSubmit}>
          <label>Name:</label>
          <select name="name" value={formData.name} onChange={handleChange} required>
            <option value="" disabled>Select Name</option>
            {reports.length > 0 ? (
              reports.map((report, index) => (
                <option key={index} value={report.name}>{report.name}</option>
              ))
            ) : (
              <option disabled>No reports found</option>
            )}
          </select>

          <label>Start Date:</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />

          <label>End Date:</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Report;