const express = require("express");
const router = express.Router();
const { Delegation, User, Customer } = require("../models");
const delegationController = require("../controllers/delegationController");

router.get("/employees", async (req, res) => {
  try {
    const employees = await User.findAll({ attributes: ["userName", "department"] });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const delegations = await Delegation.findAll();
    res.json(delegations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
    const { empname, dept, custname, task, planneddate, startdate } = req.body;

    if (!custname || !task || !planneddate || !startdate) {
      return res.status(400).json({ error: "Customer name, task, planned date, and start date are required" });
    }

    const newDelegation = await Delegation.create({
      empname: empname || null,
      dept: dept || null,
      custname,
      task,
      planneddate,
      startdate,
    });

    return res.json({ message: "Task created successfully", delegation: newDelegation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id/complete", async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body; 

    const delegation = await Delegation.findByPk(id);
    if (!delegation) return res.status(404).json({ error: "Delegation not found" });

    await delegation.update({ progress });

    res.json({ message: "Delegation updated successfully", delegation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:userName", delegationController.getDelegationsByUser);

router.put("/:id/progress", delegationController.updateDelegationProgress);

router.put("/:id/remarks", delegationController.updateRemarks);

router.post('/create-multiple-tasks', delegationController.createMultipleDelegations);


module.exports = router;