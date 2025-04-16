import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Delegations.css";
import Sidebar from "./Sidebar.js";

const Delegations = () => {
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [formRows, setFormRows] = useState([
    {
      empname: "",
      dept: "",
      custname: "",
      task: "",
      planneddate: "",
    }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState([{}]);

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

  const handleChange = (index, e) => {
    const updatedRows = [...formRows];
    updatedRows[index] = { ...updatedRows[index], [e.target.name]: e.target.value };
    setFormRows(updatedRows);

    if (formErrors[index] && formErrors[index][e.target.name]) {
      const updatedErrors = [...formErrors];
      updatedErrors[index] = {...updatedErrors[index], [e.target.name]: null};
      setFormErrors(updatedErrors);
    }
  };

  const handleEmployeeChange = (index, e) => {
    const selectedUser = employees.find(emp => emp.userName === e.target.value);
    
    const updatedRows = [...formRows];
    updatedRows[index] = { 
      ...updatedRows[index], 
      empname: selectedUser ? selectedUser.userName : "", 
      dept: selectedUser ? selectedUser.department : ""
    };
    setFormRows(updatedRows);
    
    if (formErrors[index] && formErrors[index].empname) {
      const updatedErrors = [...formErrors];
      updatedErrors[index] = {...updatedErrors[index], empname: null};
      setFormErrors(updatedErrors);
    }
  };

  const validateForm = () => {
    const allErrors = formRows.map(row => {
      const errors = {};
      
      if (!row.empname) errors.empname = "Required";
      if (!row.custname) errors.custname = "Required";
      if (!row.task) errors.task = "Required";
      if (!row.planneddate) errors.planneddate = "Required";
      
      return errors;
    });
    
    setFormErrors(allErrors);
    
    // Check if any row has errors
    return allErrors.every(errors => Object.keys(errors).length === 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      // Add current date as start date for all rows
      const currentDate = new Date().toISOString();
      const dataToSend = formRows.map(row => ({
        ...row,
        startdate: currentDate,
      }));

      await axios.post("http://localhost:5000/api/delegations/create-multiple-tasks", { tasks: dataToSend });
      setShowModal(true);
      
      // Reset form after successful submission
      setFormRows([{ 
        empname: "", 
        dept: "", 
        custname: "", 
        task: "", 
        planneddate: "" 
      }]);
      setFormErrors([{}]);
      
      setTimeout(() => setShowModal(false), 2000);
    } catch (error) {
      console.error("Error submitting tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormRows([{ 
      empname: "", 
      dept: "", 
      custname: "", 
      task: "", 
      planneddate: "" 
    }]);
    setFormErrors([{}]);
  };

  const handleRepeat = () => {
    setFormRows([...formRows, {
      empname: "",
      dept: "",
      custname: "",
      task: "",
      planneddate: "",
    }]);
    setFormErrors([...formErrors, {}]);
  };

  const removeRow = (index) => {
    if (formRows.length > 1) {
      const updatedRows = formRows.filter((_, i) => i !== index);
      const updatedErrors = formErrors.filter((_, i) => i !== index);
      setFormRows(updatedRows);
      setFormErrors(updatedErrors);
    }
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
              <p>Delegations created successfully!</p>
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
            {formRows.length > 1 && <div className="header-cell action-cell">ACTION</div>}
          </div>
          
          {formRows.map((formData, rowIndex) => (
            <div className="horizontal-form-inputs" key={rowIndex}>
              <div className="input-cell" data-label="EMPLOYEE NAME">
                <select
                  name="empname"
                  value={formData.empname}
                  onChange={(e) => handleEmployeeChange(rowIndex, e)}
                  className={formErrors[rowIndex]?.empname ? "error" : ""}
                >
                  <option value="">Select...</option>
                  {employees.map((emp, index) => (
                    <option key={index} value={emp.userName}>{emp.userName}</option>
                  ))}
                </select>
                {formErrors[rowIndex]?.empname && <div className="error-tooltip">{formErrors[rowIndex].empname}</div>}
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
                  onChange={(e) => handleChange(rowIndex, e)}
                  className={formErrors[rowIndex]?.custname ? "error" : ""}
                >
                  <option value="">Select...</option>
                  {customers.map((customer, index) => (
                    <option key={index} value={customer.custname}>{customer.custname}</option>
                  ))}
                </select>
                {formErrors[rowIndex]?.custname && <div className="error-tooltip">{formErrors[rowIndex].custname}</div>}
              </div>
              
              <div className="input-cell" data-label="TASK">
                <input
                  type="text"
                  name="task"
                  value={formData.task}
                  onChange={(e) => handleChange(rowIndex, e)}
                  placeholder="Enter task description"
                  className={formErrors[rowIndex]?.task ? "error" : ""}
                />
                {formErrors[rowIndex]?.task && <div className="error-tooltip">{formErrors[rowIndex].task}</div>}
              </div>
              
              <div className="input-cell date-cell" data-label="PLANNED DATE">
                <input
                  type="date"
                  name="planneddate"
                  value={formData.planneddate}
                  onChange={(e) => handleChange(rowIndex, e)}
                  className={formErrors[rowIndex]?.planneddate ? "error" : ""}
                />
                {formErrors[rowIndex]?.planneddate && <div className="error-tooltip">{formErrors[rowIndex].planneddate}</div>}
              </div>
              
              {formRows.length > 1 && (
                <div className="input-cell action-cell" data-label="ACTION">
                  <button type="button" className="remove-button" onClick={() => removeRow(rowIndex)}>
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
          
          <div className="horizontal-form-actions">
            <button type="button" className="repeat-button" onClick={handleRepeat}>
              Repeat
            </button>
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