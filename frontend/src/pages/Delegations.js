import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Delegations.css";
import Sidebar from "./Sidebar.js";

const Delegations = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    empname: "",
    dept: "",
    custname: "",
    task: "",
    planneddate: "",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/delegations/employees")
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employee names:", error);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/delegations/create-task", formData)
      .then((response) => {
        alert(response.data.message);
      })
      .catch((error) => {
        console.error("Error submitting task:", error);
      });
  };

  return (
    <div className="delegations-container">
      <Sidebar/>
      <h1 className="delegations-heading">Create Task</h1>
      <form className="delegations-form" onSubmit={handleSubmit}>
        <label>Employee Name:</label>
        <select name="empname" value={formData.empname} onChange={handleChange} required>
          <option value="" disabled>
            Select Employee
          </option>
          {employees.map((emp, index) => (
            <option key={index} value={emp.empname}>{emp.empname}</option>
          ))}
        </select>

        <label>Department:</label>
        <input type="text" name="dept" value={formData.dept} onChange={handleChange} required />

        <label>Customer Name:</label>
        <input type="text" name="custname" value={formData.custname} onChange={handleChange} required />

        <label>Task:</label>
        <input type="text" name="task" value={formData.task} onChange={handleChange} required />

        <label>Planned Date:</label>
        <input type="date" name="planneddate" value={formData.planneddate} onChange={handleChange} required />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Delegations;
