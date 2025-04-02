import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Delegations.css";
import Sidebar from "./Sidebar.js";

const Delegations = () => {
  const [delegations, setDelegations] = useState([]);
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
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [delegationsRes, employeesRes, customersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/delegations"),
        axios.get("http://localhost:5000/api/delegations/employees"),
        axios.get("http://localhost:5000/api/delegations/customers"),
      ]);

      setDelegations(delegationsRes.data);
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
      fetchData(); 
      setFormData({ empname: "", dept: "", custname: "", task: "", planneddate: "" }); 
      setShowForm(false);
    } catch (error) {
      console.error("Error submitting task:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setShowModal(false), 2000);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div>
      <Sidebar />
      <div className="delegations-container">
        <h1 className="delegations-heading">Delegations</h1>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <p>Delegation created successfully!</p>
            </div>
          </div>
        )}

        <div className="tasks-table-container">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Customer Name</th>
                <th>Task</th>
                <th>Planned Date</th>
              </tr>
            </thead>
            <tbody>
  {delegations.length > 0 ? (
    delegations.map((delegation, index) => (
      <tr key={index}>
        <td>{delegation.empname}</td>
        <td>{delegation.dept}</td>
        <td>{delegation.custname}</td>
        <td>{delegation.task}</td>
        {delegation.planneddate ? (
          <td>{new Date(delegation.planneddate).toLocaleDateString()}</td>
        ) : (
          <td></td>
        )}
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4" style={{ textAlign: "center" }}>No delegations found</td>
    </tr>
  )}
</tbody>
          </table>
        </div>

        <button onClick={() => setShowForm(true)} className="create-task-btn">
          Create Task
        </button>

        {showForm && (
          <div className="task-form-overlay">
            <div className="task-form-container">
              <form className="delegations-form" onSubmit={handleSubmit}>
                <label>Employee Name:</label>
                <select name="empname" value={formData.empname} onChange={handleEmployeeChange} required>
                  <option value="">Select Employee</option>
                  {employees.map((emp, index) => (
                    <option key={index} value={emp.userName}>{emp.userName}</option>
                  ))}
                </select>
                
                <label>Department:</label>
                <input type="text" name="dept" value={formData.dept} readOnly />
                
                <label>Customer Name:</label>
                <select name="custname" value={formData.custname} onChange={handleChange} required>
                  <option value="">Select Customer</option>
                  {customers.map((customer, index) => (
                    <option key={index} value={customer.custname}>{customer.custname}</option>
                  ))}
                </select>
                
                <label>Task:</label>
                <input type="text" name="task" value={formData.task} onChange={handleChange} required />
                
                <label>Planned Date:</label>
                <input type="date" name="planneddate" value={formData.planneddate} onChange={handleChange} required />
                
                <div className="form-buttons">
                  <button type="submit">Submit</button>
                  <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Delegations;