import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Checklist.css";
import Sidebar from "./Sidebar.js";

const Checklists = () => {
  useEffect(() => {
    document.title = "Checklist";
  }, []);

  const [usernames, setUsernames] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [formRows, setFormRows] = useState([
    {
      empname: "",
      department: "",
      custname: "",
      frequency: "",
      startdate: "",
      enddate: "",
      taskname: ""
    }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState([{}]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usernamesRes, customersRes] = await Promise.all([
        axios.get("http://localhost:5000/auth/usernames"),
        axios.get("http://localhost:5000/api/customers")
      ]);
      
      setUsernames(usernamesRes.data);
      setCustomers(customersRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedRows = [...formRows];
    updatedRows[index] = { ...updatedRows[index], [name]: value };
    setFormRows(updatedRows);

    // Clear error for this field if it exists
    if (formErrors[index] && formErrors[index][name]) {
      const updatedErrors = [...formErrors];
      updatedErrors[index] = { ...updatedErrors[index], [name]: null };
      setFormErrors(updatedErrors);
    }
  };

  const handleEmployeeChange = async (e, index) => {
    const empname = e.target.value;
    
    // Debug logs - you can remove these later
    console.log("Selected employee:", empname);
    
    const updatedRows = [...formRows];
    updatedRows[index] = { ...updatedRows[index], empname };
    setFormRows(updatedRows);

    // Clear error for this field if it exists
    if (formErrors[index] && formErrors[index].empname) {
      const updatedErrors = [...formErrors];
      updatedErrors[index] = { ...updatedErrors[index], empname: null };
      setFormErrors(updatedErrors);
    }

    if (empname) {
      try {
        const response = await axios.get(`http://localhost:5000/auth/users/${empname}/department`);
        const updatedRowsWithDept = [...formRows];
        updatedRowsWithDept[index] = { 
          ...updatedRowsWithDept[index], 
          empname, // Explicitly setting empname again
          department: response.data.department 
        };
        setFormRows(updatedRowsWithDept);
        
        // Debug logs - you can remove these later
        console.log("Department fetched:", response.data.department);
        console.log("Updated row:", updatedRowsWithDept[index]);
      } catch (error) {
        console.error("Error fetching department:", error);
      }
    } else {
      const updatedRowsWithEmptyDept = [...formRows];
      updatedRowsWithEmptyDept[index] = { 
        ...updatedRowsWithEmptyDept[index], 
        empname, // Explicitly setting empname again
        department: "" 
      };
      setFormRows(updatedRowsWithEmptyDept);
    }
  };

  const validateForm = () => {
    const allErrors = formRows.map(row => {
      const errors = {};
      
      if (!row.empname) errors.empname = "Required";
      if (!row.custname) errors.custname = "Required";
      if (!row.frequency) errors.frequency = "Required";
      if (!row.startdate) errors.startdate = "Required";
      if (!row.enddate) errors.enddate = "Required";
      if (!row.taskname) errors.taskname = "Required";
      
      if (row.startdate && row.enddate && new Date(row.startdate) > new Date(row.enddate)) {
        errors.enddate = "Must be after start date";
      }
      
      return errors;
    });
    
    setFormErrors(allErrors);
    
    // Check if any row has errors
    return allErrors.every(rowErrors => Object.keys(rowErrors).length === 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Submit all form rows as separate checklist entries
      await Promise.all(
        formRows.map(rowData => 
          axios.post("http://localhost:5000/api/create-checklist", rowData)
        )
      );
      
      setShowModal(true);
      
      // Reset form after successful submission
      setFormRows([{
        empname: "",
        department: "",
        custname: "",
        frequency: "",
        startdate: "",
        enddate: "",
        taskname: ""
      }]);
      
      setFormErrors([{}]);
      
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting checklists:", error);
    } finally {
      setLoading(false);
    }
  };

  const addFormRow = () => {
    setFormRows([...formRows, {
      empname: "",
      department: "",
      custname: "",
      frequency: "",
      startdate: "",
      enddate: "",
      taskname: ""
    }]);
    
    setFormErrors([...formErrors, {}]);
  };

  const removeFormRow = (index) => {
    if (formRows.length > 1) {
      const updatedRows = [...formRows];
      updatedRows.splice(index, 1);
      setFormRows(updatedRows);
      
      const updatedErrors = [...formErrors];
      updatedErrors.splice(index, 1);
      setFormErrors(updatedErrors);
    }
  };

  const resetForm = () => {
    setFormRows([{
      empname: "",
      department: "",
      custname: "",
      frequency: "",
      startdate: "",
      enddate: "",
      taskname: ""
    }]);
    setFormErrors([{}]);
  };

  // Debug log - you can remove this later
  console.log("Current form rows:", formRows);

  return (
    <div>
      <Sidebar />
      <div className="checklists-container">
        <h1 className="checklists-heading">Create Checklist</h1>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <div className="success-icon">✓</div>
              <p>{formRows.length > 1 ? "Checklists created successfully!" : "Checklist created successfully!"}</p>
            </div>
          </div>
        )}

        <div className="horizontal-form-container">
          <div className="horizontal-form-header">
            <div className="header-cell">EMPLOYEE NAME</div>
            <div className="header-cell">DEPARTMENT</div>
            <div className="header-cell">TASK NAME</div>
            <div className="header-cell">CUSTOMER NAME</div>
            <div className="header-cell">FREQUENCY</div>
            <div className="header-cell date-cell">START DATE</div>
            <div className="header-cell date-cell">END DATE</div>
            <div className="header-cell action-cell">ACTION</div>
          </div>
          
          {formRows.map((row, index) => (
            <div className="horizontal-form-inputs" key={index}>
              <div className="input-cell" data-label="EMPLOYEE NAME">
                <select
                  name="empname"
                  value={row.empname}
                  onChange={(e) => handleEmployeeChange(e, index)}
                  className={formErrors[index]?.empname ? "error" : ""}
                >
                  <option value="">Select...</option>
                  {usernames.map((user, userIndex) => (
                    <option key={userIndex} value={user.userName}>
                      {user.userName}
                    </option>
                  ))}
                </select>
                {formErrors[index]?.empname && <div className="error-tooltip">{formErrors[index].empname}</div>}
              </div>
              
              <div className="input-cell" data-label="DEPARTMENT">
                <input
                  type="text"
                  name="department"
                  value={row.department || ""}
                  placeholder="Department will auto-populate"
                  readOnly
                />
              </div>
              
              <div className="input-cell" data-label="TASK NAME">
                <input
                  type="text"
                  name="taskname"
                  value={row.taskname || ""}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Enter Task Name"
                  className={formErrors[index]?.taskname ? "error" : ""}
                />
                {formErrors[index]?.taskname && <div className="error-tooltip">{formErrors[index].taskname}</div>}
              </div>
              
              <div className="input-cell" data-label="CUSTOMER NAME">
                <select
                  name="custname"
                  value={row.custname || ""}
                  onChange={(e) => handleChange(e, index)}
                  className={formErrors[index]?.custname ? "error" : ""}
                >
                  <option value="">Select...</option>
                  {customers.map((customer, custIndex) => (
                    <option key={custIndex} value={customer.custname}>
                      {customer.custname}
                    </option>
                  ))}
                </select>
                {formErrors[index]?.custname && <div className="error-tooltip">{formErrors[index].custname}</div>}
              </div>
              
              <div className="input-cell" data-label="FREQUENCY">
                <select
                  name="frequency"
                  value={row.frequency || ""}
                  onChange={(e) => handleChange(e, index)}
                  className={formErrors[index]?.frequency ? "error" : ""}
                >
                  <option value="">Select...</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
                {formErrors[index]?.frequency && <div className="error-tooltip">{formErrors[index].frequency}</div>}
              </div>
              
              <div className="input-cell date-cell" data-label="START DATE">
                <input
                  type="date"
                  name="startdate"
                  value={row.startdate || ""}
                  onChange={(e) => handleChange(e, index)}
                  className={formErrors[index]?.startdate ? "error" : ""}
                />
                {formErrors[index]?.startdate && <div className="error-tooltip">{formErrors[index].startdate}</div>}
              </div>
              
              <div className="input-cell date-cell" data-label="END DATE">
                <input
                  type="date"
                  name="enddate"
                  value={row.enddate || ""}
                  onChange={(e) => handleChange(e, index)}
                  className={formErrors[index]?.enddate ? "error" : ""}
                />
                {formErrors[index]?.enddate && <div className="error-tooltip">{formErrors[index].enddate}</div>}
              </div>
              
              <div className="input-cell action-cell" data-label="ACTION">
                {formRows.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-button"
                    onClick={() => removeFormRow(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          
          <div className="horizontal-form-actions">
            <button 
              type="button" 
              className="repeat-button" 
              onClick={addFormRow}
            >
              Repeat
            </button>
            <button 
              type="button" 
              className="add-button" 
              onClick={handleSubmit} 
              disabled={loading}
            >
              {loading ? "Processing..." : "Add New Task" + (formRows.length > 1 ? "s" : "")}
            </button>
            <button 
              type="button" 
              className="submit-button" 
              onClick={resetForm}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checklists;