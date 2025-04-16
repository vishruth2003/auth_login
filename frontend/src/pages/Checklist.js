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

  const handleEmployeeChange = async (index, e) => {
    const empname = e.target.value;
    const updatedRows = [...formRows];
    updatedRows[index] = { ...updatedRows[index], empname };
    setFormRows(updatedRows);

    if (formErrors[index] && formErrors[index].empname) {
      const updatedErrors = [...formErrors];
      updatedErrors[index] = {...updatedErrors[index], empname: null};
      setFormErrors(updatedErrors);
    }

    if (empname) {
      try {
        const response = await axios.get(`http://localhost:5000/auth/users/${empname}/department`);
        const updatedRowsWithDept = [...formRows];
        updatedRowsWithDept[index] = {
          ...updatedRowsWithDept[index],
          department: response.data.department,
        };
        setFormRows(updatedRowsWithDept);
      } catch (error) {
        console.error("Error fetching department:", error);
      }
    } else {
      const updatedRowsNoDept = [...formRows];
      updatedRowsNoDept[index] = {
        ...updatedRowsNoDept[index],
        department: "",
      };
      setFormRows(updatedRowsNoDept);
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
    return allErrors.every(errors => Object.keys(errors).length === 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    // Submit all form rows at once
    axios.post("http://localhost:5000/api/create-multiple-checklists", { checklists: formRows })
      .then(() => {
        setShowModal(true);

        // Reset form with a single empty row
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
      })
      .catch((error) => {
        console.error("Error submitting checklists:", error);
      })
      .finally(() => {
        setLoading(false);
      });
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

  const handleRepeat = () => {
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
      <div className="checklists-container">
        <h1 className="checklists-heading">Create Checklist</h1>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <div className="success-icon">✓</div>
              <p>Checklists created successfully!</p>
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
                  {usernames.map((user, index) => (
                    <option key={index} value={user.userName}>{user.userName}</option>
                  ))}
                </select>
                {formErrors[rowIndex]?.empname && <div className="error-tooltip">{formErrors[rowIndex].empname}</div>}
              </div>
              
              <div className="input-cell" data-label="DEPARTMENT">
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  placeholder="Department will auto-populate"
                  readOnly
                />
              </div>
              
              <div className="input-cell" data-label="TASK NAME">
                <input
                  type="text"
                  name="taskname"
                  value={formData.taskname}
                  onChange={(e) => handleChange(rowIndex, e)}
                  placeholder="Enter Task Name"
                  className={formErrors[rowIndex]?.taskname ? "error" : ""}
                />
                {formErrors[rowIndex]?.taskname && <div className="error-tooltip">{formErrors[rowIndex].taskname}</div>}
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
              
              <div className="input-cell" data-label="FREQUENCY">
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={(e) => handleChange(rowIndex, e)}
                  className={formErrors[rowIndex]?.frequency ? "error" : ""}
                >
                  <option value="">Select...</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
                {formErrors[rowIndex]?.frequency && <div className="error-tooltip">{formErrors[rowIndex].frequency}</div>}
              </div>
              
              <div className="input-cell date-cell" data-label="START DATE">
                <input
                  type="date"
                  name="startdate"
                  value={formData.startdate}
                  onChange={(e) => handleChange(rowIndex, e)}
                  className={formErrors[rowIndex]?.startdate ? "error" : ""}
                />
                {formErrors[rowIndex]?.startdate && <div className="error-tooltip">{formErrors[rowIndex].startdate}</div>}
              </div>
              
              <div className="input-cell date-cell" data-label="END DATE">
                <input
                  type="date"
                  name="enddate"
                  value={formData.enddate}
                  onChange={(e) => handleChange(rowIndex, e)}
                  className={formErrors[rowIndex]?.enddate ? "error" : ""}
                />
                {formErrors[rowIndex]?.enddate && <div className="error-tooltip">{formErrors[rowIndex].enddate}</div>}
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
            <button type="button" className="submit-button" onClick={resetForm}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checklists;