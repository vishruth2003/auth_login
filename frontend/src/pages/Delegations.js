import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Delegations.css";
import Sidebar from "./Sidebar.js";

const Delegations = () => {
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    empname: "",
    dept: "",
    custname: "",
    task: "",
    planneddate: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Delegations";
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesRes, customersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/delegations/employees"),
        axios.get("http://localhost:5000/api/delegations/customers"),
      ]);

      setEmployees(employeesRes.data);
      setCustomers(customersRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmployeeChange = (e) => {
    const selectedUser = employees.find(emp => emp.userName === e.target.value);
    setFormData({
      ...formData,
      empname: selectedUser ? selectedUser.userName : "", 
      dept: selectedUser ? selectedUser.department : "", 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/delegations/create-task", formData);
      setShowModal(true);
      setFormData({ empname: "", dept: "", custname: "", task: "", planneddate: "" });
    } catch (error) {
      console.error("Error submitting task:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setShowModal(false), 2000);
    }
  };

  const handleReset = () => {
    setFormData({ 
      empname: "", 
      dept: "", 
      custname: "", 
      task: "", 
      planneddate: "" 
    });
  };

  return (
    <div>
      <Sidebar />
      <div className="delegations-container">
        <h1 className="delegations-heading">Create Delegation</h1>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <p>Delegation created successfully!</p>
            </div>
          </div>
        )}

        <div className="task-form-container">
          <form className="delegations-form" onSubmit={handleSubmit}>
            <label>Employee Name:</label>
            <select 
              name="empname" 
              value={formData.empname} 
              onChange={handleEmployeeChange} 
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp, index) => (
                <option key={index} value={emp.userName}>{emp.userName}</option>
              ))}
            </select>
            
            <label>Department:</label>
            <input type="text" name="dept" value={formData.dept} readOnly />
            
            <label>Customer Name:</label>
            <select 
              name="custname" 
              value={formData.custname} 
              onChange={handleChange} 
              required
            >
              <option value="">Select Customer</option>
              {customers.map((customer, index) => (
                <option key={index} value={customer.custname}>{customer.custname}</option>
              ))}
            </select>
            
            <label>Task:</label>
            <input 
              type="text" 
              name="task" 
              value={formData.task} 
              onChange={handleChange} 
              placeholder="Enter task description"
              required 
            />
            
            <label>Planned Date:</label>
            <input 
              type="date" 
              name="planneddate" 
              value={formData.planneddate} 
              onChange={handleChange} 
              required 
            />
            
            <div className="form-buttons">
              <button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Create Delegation"}
              </button>
              <button type="button" onClick={handleReset}>
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Delegations;