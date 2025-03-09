import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Checklist.css";
import Sidebar from "./Sidebar.js";

const Checklists = () => {
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

  useEffect(() => {
    axios.get("http://localhost:5000/api/checklists")
      .then((response) => {
        setChecklists(response.data);
      })
      .catch((error) => {
        console.error("Error fetching checklists:", error);
      });

    axios.get("http://localhost:5000/auth/usernames")
      .then((response) => {
        setUsernames(response.data);
      })
      .catch((error) => {
        console.error("Error fetching usernames:", error);
      });

    axios.get("http://localhost:5000/api/customers")
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmployeeChange = async (e) => {
    const empname = e.target.value;
    setFormData({ ...formData, empname });

    try {
      const response = await axios.get(`http://localhost:5000/auth/users/${empname}/department`);
      setFormData((prevFormData) => ({
        ...prevFormData,
        department: response.data.department,
      }));
    } catch (error) {
      console.error("Error fetching department:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
      });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div>
      <Sidebar />
      <div className="checklists-container">
        <h1 className="checklists-heading">Checklists</h1>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
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
              {checklists.map((checklist, index) => (
                <tr key={index}>
                  <td>{checklist.empname}</td>
                  <td>{checklist.department}</td>
                  <td>{checklist.custname}</td>
                  <td>{checklist.frequency}</td>
                  <td>{formatDate(checklist.startdate)}</td>
                  <td>{formatDate(checklist.enddate)}</td>
                  <td>{checklist.taskname}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button onClick={() => setShowForm(true)} className="create-checklist-btn">
          Create Checklist
        </button>

        {showForm && (
          <div className="checklist-form-overlay">
            <div className="checklist-form-container">
              <form className="checklists-form" onSubmit={handleSubmit}>
                <label>Employee Name:</label>
                <select name="empname" value={formData.empname} onChange={handleEmployeeChange} required>
                  <option value="">Select Employee</option>
                  {usernames.map((user, index) => (
                    <option key={index} value={user.userName}>{user.userName}</option>
                  ))}
                </select>

                <label>Department:</label>
                <input type="text" name="department" value={formData.department} readOnly />

                <label>Customer Name:</label>
                <select name="custname" value={formData.custname} onChange={handleChange} required>
                  <option value="">Select Customer</option>
                  {customers.map((customer, index) => (
                    <option key={index} value={customer.custname}>{customer.custname}</option>
                  ))}
                </select>

                <label>Frequency:</label>
                <select name="frequency" value={formData.frequency} onChange={handleChange} required>
                  <option value="">Select Frequency</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>

                <label>Start Date:</label>
                <input type="date" name="startdate" value={formData.startdate} onChange={handleChange} required />

                <label>End Date:</label>
                <input type="date" name="enddate" value={formData.enddate} onChange={handleChange} required />

                <label>Task Name:</label>
                <input type="text" name="taskname" value={formData.taskname} onChange={handleChange} required />

                <button type="submit">Submit Checklist</button>
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checklists;