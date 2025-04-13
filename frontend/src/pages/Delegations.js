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
  const [formErrors, setFormErrors] = useState({});

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
    if (formErrors[e.target.name]) {
      setFormErrors({...formErrors, [e.target.name]: null});
    }
  };

  const handleEmployeeChange = (e) => {
    const selectedUser = employees.find(emp => emp.userName === e.target.value);
    setFormData({
      ...formData,
      empname: selectedUser ? selectedUser.userName : "", 
      dept: selectedUser ? selectedUser.department : "", 
    });
    
    if (formErrors.empname) {
      setFormErrors({...formErrors, empname: null});
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.empname) {
      errors.empname = "Required";
      isValid = false;
    }
    if (!formData.custname) {
      errors.custname = "Required";
      isValid = false;
    }
    if (!formData.task) {
      errors.task = "Required";
      isValid = false;
    }
    if (!formData.planneddate) {
      errors.planneddate = "Required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        startdate: new Date().toISOString(), 
      };

      await axios.post("http://localhost:5000/api/delegations/create-task", dataToSend);
      setShowModal(true);
      setFormData({ empname: "", dept: "", custname: "", task: "", planneddate: "" });
      setTimeout(() => setShowModal(false), 2000);
    } catch (error) {
      console.error("Error submitting task:", error);
    } finally {
      setLoading(false);
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
    setFormErrors({});
  };

  return (
    <div>
      <Sidebar />
      <div className="delegations-container">
        <h1 className="delegations-heading">Create Delegation</h1>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <div className="success-icon">✓</div>
              <p>Delegation created successfully!</p>
            </div>
          </div>
        )}

        <div className="horizontal-form-container">
          <div className="horizontal-form-header">
            <div className="header-cell">EMPLOYEE NAME</div>
            <div className="header-cell">DEPARTMENT</div>
            <div className="header-cell">CUSTOMER NAME</div>
            <div className="header-cell">TASK</div>
            <div className="header-cell date-cell">PLANNED DATE</div>
          </div>
          
          <div className="horizontal-form-inputs">
            <div className="input-cell" data-label="EMPLOYEE NAME">
              <select
                name="empname"
                value={formData.empname}
                onChange={handleEmployeeChange}
                className={formErrors.empname ? "error" : ""}
              >
                <option value="">Select...</option>
                {employees.map((emp, index) => (
                  <option key={index} value={emp.userName}>{emp.userName}</option>
                ))}
              </select>
              {formErrors.empname && <div className="error-tooltip">{formErrors.empname}</div>}
            </div>
            
            <div className="input-cell" data-label="DEPARTMENT">
              <input
                type="text"
                name="dept"
                value={formData.dept}
                placeholder="Department will auto-populate"
                readOnly
              />
            </div>
            
            <div className="input-cell" data-label="CUSTOMER NAME">
              <select
                name="custname"
                value={formData.custname}
                onChange={handleChange}
                className={formErrors.custname ? "error" : ""}
              >
                <option value="">Select...</option>
                {customers.map((customer, index) => (
                  <option key={index} value={customer.custname}>{customer.custname}</option>
                ))}
              </select>
              {formErrors.custname && <div className="error-tooltip">{formErrors.custname}</div>}
            </div>
            
            <div className="input-cell" data-label="TASK">
              <input
                type="text"
                name="task"
                value={formData.task}
                onChange={handleChange}
                placeholder="Enter task description"
                className={formErrors.task ? "error" : ""}
              />
              {formErrors.task && <div className="error-tooltip">{formErrors.task}</div>}
            </div>
            
            <div className="input-cell date-cell" data-label="PLANNED DATE">
              <input
                type="date"
                name="planneddate"
                value={formData.planneddate}
                onChange={handleChange}
                className={formErrors.planneddate ? "error" : ""}
              />
              {formErrors.planneddate && <div className="error-tooltip">{formErrors.planneddate}</div>}
            </div>
          </div>
          
          <div className="horizontal-form-actions">
            <button type="button" className="add-button" onClick={handleSubmit} disabled={loading}>
              {loading ? "Processing..." : "Add"}
            </button>
            <button type="button" className="reset-button" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delegations;