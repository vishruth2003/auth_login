const express = require("express");
const router = express.Router();
const { Delegation, User, Customer } = require("../models");

// Fetch employees with department
router.get("/employees", async (req, res) => {
  try {
    const employees = await User.findAll({ attributes: ["userName", "department"] });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch all delegations
router.get("/", async (req, res) => {
  try {
    const delegations = await Delegation.findAll();
    res.json(delegations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch customers
router.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.findAll({ attributes: ["custname"] });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/create-task", async (req, res) => {
  try {
    const { empname, dept, custname, task, planneddate } = req.body;

    // Validate required fields
    if (!custname || !task || !planneddate) {
      return res.status(400).json({ error: "Customer name, task, and planned date are required" });
    }

    // Create a new delegation entry
    const newDelegation = await Delegation.create({
      empname: empname || null, // Store empname only if provided
      dept: dept || null,       // Store dept only if provided
      custname,
      task,
      planneddate,
    });

    return res.json({ message: "Task created successfully", delegation: newDelegation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;