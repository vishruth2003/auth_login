const express = require("express");
const router = express.Router();
const { Delegation } = require("../models");

router.get("/employees", async (req, res) => {
  try {
    const employees = await Delegation.findAll({ attributes: ["empname"] });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/create-task", async (req, res) => {
  try {
    const { empname, dept, custname, task, planneddate } = req.body;
    const existingDelegation = await Delegation.findOne({ where: { empname } });

    if (existingDelegation) {
      await existingDelegation.update({ dept, custname, task, planneddate });
      return res.json({ message: "Task updated successfully" });
    } else {
      await Delegation.create({ empname, dept, custname, task, planneddate });
      return res.json({ message: "Task created successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
