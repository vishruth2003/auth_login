import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Checklist.css";
import Sidebar from "./Sidebar.js";

const Checklists = () => {
  useEffect(() => {
    document.title = "Checklist";
  }, []);

  const [checklists, setChecklists] = useState([]);
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
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [checklistsRes, usernamesRes, customersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/checklists"),
        axios.get("http://localhost:5000/auth/usernames"),
        axios.get("http://localhost:5000/api/customers")
      ]);
      
      setChecklists(checklistsRes.data);
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
      errors.empname = "Please select an employee";
      isValid = false;
    }
    if (!formData.custname) {
      errors.custname = "Please select a customer";
      isValid = false;
    }
    if (!formData.frequency) {
      errors.frequency = "Please select a frequency";
      isValid = false;
    }
    if (!formData.startdate) {
      errors.startdate = "Please select a start date";
      isValid = false;
    }
    if (!formData.enddate) {
      errors.enddate = "Please select an end date";
      isValid = false;
    }
    if (!formData.taskname) {
      errors.taskname = "Please enter a task name";
      isValid = false;
    }
    if (formData.startdate && formData.enddate && new Date(formData.startdate) > new Date(formData.enddate)) {
      errors.enddate = "End date must be after start date";
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

        setChecklists([...checklists, formData]);

        setFormData({
          empname: "",
          department: "",
          custname: "",
          frequency: "",
          startdate: "",
          enddate: "",
          taskname: ""
        });

        setShowForm(false);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const closeForm = () => {
    setShowForm(false);
    setFormErrors({});
    setFormData({
      empname: "",
      department: "",
      custname: "",
      frequency: "",
      startdate: "",
      enddate: "",
      taskname: ""
    });
  };

  return (
    <div>
      <Sidebar />
      <div className="checklists-container">
        <h1 className="checklists-heading">Checklists</h1>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <div className="success-icon">✓</div>
              <p>Checklist created successfully!</p>
            </div>
          </div>
        )}

        <div className="checklists-table-container">
          <table className="checklists-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Customer Name</th>
                <th>Frequency</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Task Name</th>
              </tr>
            </thead>
            <tbody>
              {checklists.length > 0 ? (
                checklists.map((checklist, index) => (
                  <tr key={index}>
                    <td>{checklist.empname}</td>
                    <td>{checklist.department}</td>
                    <td>{checklist.custname}</td>
                    <td>{checklist.frequency}</td>
                    <td>{formatDate(checklist.startdate)}</td>
                    <td>{formatDate(checklist.enddate)}</td>
                    <td>{checklist.taskname}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>No checklists found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button onClick={() => setShowForm(true)} className="create-checklist-btn">
          Create Checklist
        </button>

        {showForm && (
          <div className="checklist-form-overlay">
            <div className="checklist-form-container">
              <h2 className="form-title">Create New Checklist</h2>
              <form className="checklists-form" onSubmit={handleSubmit}>
                <div className="form-group form-field-transition">
                  <label>Employee Name:</label>
                  <select
                    name="empname"
                    value={formData.empname}
                    onChange={handleEmployeeChange}
                    className={formErrors.empname ? "error" : ""}
                  >
                    <option value="">Select Employee</option>
                    {usernames.map((user, index) => (
                      <option key={index} value={user.userName}>{user.userName}</option>
                    ))}
                  </select>
                  {formErrors.empname && <div className="error-message">{formErrors.empname}</div>}
                </div>

                <div className="form-group form-field-transition">
                  <label>Department:</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    readOnly
                  />
                </div>

                <div className="form-group form-field-transition">
                  <label>Customer Name:</label>
                  <select
                    name="custname"
                    value={formData.custname}
                    onChange={handleChange}
                    className={formErrors.custname ? "error" : ""}
                  >
                    <option value="">Select Customer</option>
                    {customers.map((customer, index) => (
                      <option key={index} value={customer.custname}>{customer.custname}</option>
                    ))}
                  </select>
                  {formErrors.custname && <div className="error-message">{formErrors.custname}</div>}
                </div>

                <div className="form-group form-field-transition">
                  <label>Frequency:</label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className={formErrors.frequency ? "error" : ""}
                  >
                    <option value="">Select Frequency</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                  {formErrors.frequency && <div className="error-message">{formErrors.frequency}</div>}
                </div>

                <div className="form-row">
                  <div className="form-group form-field-transition">
                    <label>Start Date:</label>
                    <div className="date-input-wrapper">
                      <input
                        type="date"
                        name="startdate"
                        value={formData.startdate}
                        onChange={handleChange}
                        className={formErrors.startdate ? "error" : ""}
                      />
                    </div>
                    {formErrors.startdate && <div className="error-message">{formErrors.startdate}</div>}
                  </div>

                  <div className="form-group form-field-transition">
                    <label>End Date:</label>
                    <div className="date-input-wrapper">
                      <input
                        type="date"
                        name="enddate"
                        value={formData.enddate}
                        onChange={handleChange}
                        className={formErrors.enddate ? "error" : ""}
                      />
                    </div>
                    {formErrors.enddate && <div className="error-message">{formErrors.enddate}</div>}
                  </div>
                </div>

                <div className="form-group form-field-transition">
                  <label>Task Name:</label>
                  <input
                    type="text"
                    name="taskname"
                    value={formData.taskname}
                    onChange={handleChange}
                    placeholder="Enter task name"
                    className={formErrors.taskname ? "error" : ""}
                  />
                  {formErrors.taskname && <div className="error-message">{formErrors.taskname}</div>}
                </div>

                <div className="form-buttons">
                  <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Create Checklist"}
                  </button>
                  <button type="button" onClick={closeForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checklists;