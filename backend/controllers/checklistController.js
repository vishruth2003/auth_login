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

exports.getChecklistsByUser = async (req, res) => {
  try {
    const { userName } = req.params;
    const checklists = await Checklist.findAll({ where: { empname: userName.trim() } });
    res.json(checklists);
  } catch (error) {
    console.error("Error fetching checklists:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.completeChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    const checklist = await Checklist.findByPk(id);
    if (!checklist) return res.status(404).json({ error: "Checklist not found" });

    await checklist.update({ progress: 'end' });
    res.json({ message: "Checklist completed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};