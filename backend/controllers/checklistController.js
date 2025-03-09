const { Checklist } = require("../models");

exports.createChecklist = async (req, res) => {
  try {
    const { empname, department, custname, frequency, startdate, enddate, taskname } = req.body;
    const newChecklist = await Checklist.create({ empname, department, custname, frequency, startdate, enddate, taskname });
    res.status(201).json({ message: "Checklist created successfully", checklist: newChecklist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllChecklists = async (req, res) => {
  try {
    const checklists = await Checklist.findAll();
    res.json(checklists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};