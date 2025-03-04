import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Delegations.css";
import Sidebar from "./Sidebar.js";

const Delegations = () => {
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]); 
  const [tasks, setTasks] = useState([]); 
  const [formData, setFormData] = useState({
    empname: "",
    dept: "",
    custname: "",
    task: "",
    planneddate: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false); 
  const [editTaskIndex, setEditTaskIndex] = useState(null); 

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
      setTasks(storedTasks);
    }

    axios.get("http://localhost:5000/api/delegations/employees")
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employee names:", error);
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
        dept: response.data.department,
      }));
    } catch (error) {
      console.error("Error fetching department:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:5000/api/delegations/create-task", formData)
      .then(() => {
        setShowModal(true);

        let updatedTasks;
        if (editTaskIndex !== null) {
          updatedTasks = [...tasks];
          updatedTasks[editTaskIndex] = formData;
        } else {
          updatedTasks = [...tasks, formData];
        }

        localStorage.setItem("tasks", JSON.stringify(updatedTasks));

        setTasks(updatedTasks);

        setFormData({
          empname: "",
          dept: "",
          custname: "",
          task: "",
          planneddate: "",
        });

        setShowForm(false);
        setEditTaskIndex(null); 

        setTimeout(() => {
          setShowModal(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("Error submitting task:", error);
      });
  };

  const handleEdit = (index) => {
    setEditTaskIndex(index); 
    setFormData(tasks[index]); 
    setShowForm(true); 
  };

  return (
    <div>
      <Sidebar />
      <div className="delegations-container">
        <h1 className="delegations-heading">Delegated Tasks</h1>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <p>Task created/updated successfully!</p>
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.empname}</td>
                  <td>{task.dept}</td>
                  <td>{task.custname}</td>
                  <td>{task.task}</td>
                  <td>{task.planneddate}</td>
                  <td>
                    <button onClick={() => handleEdit(index)} className="edit-btn">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
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
                  <option value="" disabled>Select Employee</option>
                  {employees.map((emp, index) => (
                    <option key={index} value={emp.empname}>{emp.empname}</option>
                  ))}
                </select>

                <label>Department:</label>
                <input type="text" name="dept" value={formData.dept} readOnly />

                <label>Customer Name:</label>
                <select name="custname" value={formData.custname} onChange={handleChange} required>
                  <option value="" disabled>Select Customer</option>
                  {customers.map((customer, index) => (
                    <option key={index} value={customer.custname}>{customer.custname}</option>
                  ))}
                </select>

                <label>Task:</label>
                <input type="text" name="task" value={formData.task} onChange={handleChange} required />

                <label>Planned Date:</label>
                <input type="date" name="planneddate" value={formData.planneddate} onChange={handleChange} required />

                <button type="submit">{editTaskIndex !== null ? "Update Task" : "Submit Task"}</button>
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Delegations;