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
      
      // Process customer data
      let processedCustomers = customersRes.data;
      
      // If data is wrapped in another object (common API pattern)
      if (customersRes.data && !Array.isArray(customersRes.data) && customersRes.data.customers) {
        processedCustomers = customersRes.data.customers;
      }
      
      // If data is nested differently
      if (customersRes.data && customersRes.data.data && Array.isArray(customersRes.data.data)) {
        processedCustomers = customersRes.data.data;
      }
      
      setCustomers(processedCustomers);
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

    // Clear error for this field if it exists
    if (formErrors[index] && formErrors[index][e.target.name]) {
      const updatedErrors = [...formErrors];
      updatedErrors[index] = { ...updatedErrors[index], [e.target.name]: null };
      setFormErrors(updatedErrors);
    }
  };

  const handleEmployeeChange = (index, e) => {
    const selectedUser = employees.find(emp => emp.userName === e.target.value);
    const updatedRows = [...formRows];
    updatedRows[index] = {
      ...updatedRows[index],
      empname: selectedUser ? selectedUser.userName : "",
      dept: selectedUser ? selectedUser.department : "",
    };
    setFormRows(updatedRows);
    
    // Clear error for empname if it exists
    if (formErrors[index] && formErrors[index].empname) {
      const updatedErrors = [...formErrors];
      updatedErrors[index] = { ...updatedErrors[index], empname: null };
      setFormErrors(updatedErrors);
    }
  };

  const handleCustomerChange = (index, e) => {
    const updatedRows = [...formRows];
    updatedRows[index] = {
      ...updatedRows[index],
      custname: e.target.value
    };
    setFormRows(updatedRows);
    
    // Clear error for custname if it exists
    if (formErrors[index] && formErrors[index].custname) {
      const updatedErrors = [...formErrors];
      updatedErrors[index] = { ...updatedErrors[index], custname: null };
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
    return allErrors.every(errors => Object.keys(errors).length === 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      // Add startdate to each row and send all tasks to the backend
      const dataToSend = formRows.map(row => ({
        ...row,
        startdate: new Date().toISOString(),
      }));

      await axios.post("http://localhost:5000/api/delegations/create-multiple-tasks", dataToSend);
      setShowModal(true);
      resetForm();
      setTimeout(() => setShowModal(false), 2000);
    } catch (error) {
      console.error("Error submitting tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormRows([{ 
      empname: "", 
      dept: "", 
      custname: "", 
      task: "", 
      planneddate: "" 
    }]);
    setFormErrors([{}]);
  };

  const addNewRow = () => {
    setFormRows([...formRows, { 
      empname: "", 
      dept: "", 
      custname: "", 
      task: "", 
      planneddate: "" 
    }]);
    setFormErrors([...formErrors, {}]);
  };

  const removeRow = (index) => {
    if (formRows.length === 1) {
      resetForm();
      return;
    }
    
    const updatedRows = formRows.filter((_, i) => i !== index);
    const updatedErrors = formErrors.filter((_, i) => i !== index);
    
    setFormRows(updatedRows);
    setFormErrors(updatedErrors);
  };

  // Helper function to safely access customer name property
  const getCustomerDisplayName = (customer) => {
    if (!customer) return "";
    
    // Try all possible property names one by one
    if (customer.customerName) return customer.customerName;
    if (customer.name) return customer.name;
    if (customer.customer_name) return customer.customer_name;
    if (customer.fullName) return customer.fullName;
    if (customer.full_name) return customer.full_name;
    if (customer.title) return customer.title;
    
    // If we have a customer ID and no name, show a placeholder
    if (customer.id || customer.customerId || customer.customer_id) {
      return `Customer #${customer.id || customer.customerId || customer.customer_id}`;
    }
    
    // Last resort: stringify the first property we can find
    const firstKey = Object.keys(customer)[0];
    if (firstKey) return String(customer[firstKey]);
    
    return "Unnamed Customer";
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
            <div className="header-cell action-cell">ACTION</div>
          </div>
          
          {formRows.map((row, index) => (
            <div className="horizontal-form-inputs" key={index}>
              <div className="input-cell" data-label="EMPLOYEE NAME">
                <select
                  name="empname"
                  value={row.empname}
                  onChange={(e) => handleEmployeeChange(index, e)}
                  className={formErrors[index]?.empname ? "error" : ""}
                >
                  <option value="">Select...</option>
                  {employees.map((emp, empIndex) => (
                    <option key={empIndex} value={emp.userName}>{emp.userName}</option>
                  ))}
                </select>
                {formErrors[index]?.empname && <div className="error-tooltip">{formErrors[index].empname}</div>}
              </div>
              
              <div className="input-cell" data-label="DEPARTMENT">
                <input
                  type="text"
                  name="dept"
                  value={row.dept}
                  placeholder="Department will auto-populate"
                  readOnly
                />
              </div>
              
              <div className="input-cell" data-label="CUSTOMER NAME">
                <select
                  name="custname"
                  value={row.custname}
                  onChange={(e) => handleCustomerChange(index, e)}
                  className={formErrors[index]?.custname ? "error" : ""}
                >
                  <option value="">Select...</option>
                  {customers && customers.length > 0 ? (
                    customers.map((cust, custIndex) => (
                      <option key={custIndex} value={getCustomerDisplayName(cust)}>
                        {getCustomerDisplayName(cust)}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No customers found</option>
                  )}
                </select>
                {formErrors[index]?.custname && <div className="error-tooltip">{formErrors[index].custname}</div>}
              </div>
              
              <div className="input-cell" data-label="TASK">
                <input
                  type="text"
                  name="task"
                  value={row.task}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="Enter task description"
                  className={formErrors[index]?.task ? "error" : ""}
                />
                {formErrors[index]?.task && <div className="error-tooltip">{formErrors[index].task}</div>}
              </div>
              
              <div className="input-cell date-cell" data-label="PLANNED DATE">
                <input
                  type="date"
                  name="planneddate"
                  value={row.planneddate}
                  onChange={(e) => handleChange(index, e)}
                  className={formErrors[index]?.planneddate ? "error" : ""}
                />
                {formErrors[index]?.planneddate && <div className="error-tooltip">{formErrors[index].planneddate}</div>}
              </div>
              
              <div className="input-cell action-cell">
                {formRows.length > 1 && (
                  <button className="remove-button" onClick={() => removeRow(index)}>
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="horizontal-form-actions">
            <button className="reset-button" onClick={resetForm}>
              Reset
            </button>
            <button className="repeat-button" onClick={addNewRow}>
              Repeat
            </button>
            <button className="add-button" onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "New Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delegations;