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
  const [formData, setFormData] = useState({
    empname: "",
    department: "",
    custname: "",
    frequency: "",
    startdate: "",
    enddate: "",
    taskname: ""
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({...formErrors, [e.target.name]: null});
    }
  };

  const handleEmployeeChange = async (e) => {
    const empname = e.target.value;
    setFormData({ ...formData, empname });

    if (formErrors.empname) {
      setFormErrors({...formErrors, empname: null});
    }

    if (empname) {
      try {
        const response = await axios.get(`http://localhost:5000/auth/users/${empname}/department`);
        setFormData((prevFormData) => ({
          ...prevFormData,
          department: response.data.department,
        }));
      } catch (error) {
        console.error("Error fetching department:", error);
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        department: "",
      }));
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
    if (!formData.frequency) {
      errors.frequency = "Required";
      isValid = false;
    }
    if (!formData.startdate) {
      errors.startdate = "Required";
      isValid = false;
    }
    if (!formData.enddate) {
      errors.enddate = "Required";
      isValid = false;
    }
    if (!formData.taskname) {
      errors.taskname = "Required";
      isValid = false;
    }
    if (formData.startdate && formData.enddate && new Date(formData.startdate) > new Date(formData.enddate)) {
      errors.enddate = "Must be after start date";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    axios.post("http://localhost:5000/api/create-checklist", formData)
      .then(() => {
        setShowModal(true);

        setFormData({
          empname: "",
          department: "",
          custname: "",
          frequency: "",
          startdate: "",
          enddate: "",
          taskname: ""
        });

        setTimeout(() => {
          setShowModal(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("Error submitting checklist:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const resetForm = () => {
    setFormData({
      empname: "",
      department: "",
      custname: "",
      frequency: "",
      startdate: "",
      enddate: "",
      taskname: ""
    });
    setFormErrors({});
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
              <p>Checklist created successfully!</p>
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
                {usernames.map((user, index) => (
                  <option key={index} value={user.userName}>{user.userName}</option>
                ))}
              </select>
              {formErrors.empname && <div className="error-tooltip">{formErrors.empname}</div>}
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
                onChange={handleChange}
                placeholder="Enter Task Name"
                className={formErrors.taskname ? "error" : ""}
              />
              {formErrors.taskname && <div className="error-tooltip">{formErrors.taskname}</div>}
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
            
            <div className="input-cell" data-label="FREQUENCY">
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className={formErrors.frequency ? "error" : ""}
              >
                <option value="">Select...</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
              {formErrors.frequency && <div className="error-tooltip">{formErrors.frequency}</div>}
            </div>
            
            <div className="input-cell date-cell" data-label="START DATE">
              <input
                type="date"
                name="startdate"
                value={formData.startdate}
                onChange={handleChange}
                className={formErrors.startdate ? "error" : ""}
              />
              {formErrors.startdate && <div className="error-tooltip">{formErrors.startdate}</div>}
            </div>
            
            <div className="input-cell date-cell" data-label="END DATE">
              <input
                type="date"
                name="enddate"
                value={formData.enddate}
                onChange={handleChange}
                className={formErrors.enddate ? "error" : ""}
              />
              {formErrors.enddate && <div className="error-tooltip">{formErrors.enddate}</div>}
            </div>
          </div>
          
          <div className="horizontal-form-actions">
            <button type="button" className="add-button" onClick={handleSubmit} disabled={loading}>
              {loading ? "Processing..." : "Add New Task"}
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