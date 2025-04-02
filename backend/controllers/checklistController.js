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

    const startDate = new Date(checklist.startdate);
    const endDate = new Date(checklist.enddate);
    const today = new Date();

    const getWorkingDays = (start, end) => {
      let count = 0;
      let currentDate = new Date(start);

      while (currentDate <= end) {
        const day = currentDate.getDay();
        if (day !== 0 && day !== 6) count++;
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return count;
    };

    const totalWorkingDays = getWorkingDays(startDate, endDate);

    const currentProgress = checklist.progress ? parseInt(checklist.progress) : 0;

    if (today >= startDate && today <= endDate) {
      const lastCompletedDate = new Date(checklist.lastCompletedDate || 0);
      if (lastCompletedDate.toDateString() === today.toDateString()) {
        return res.status(400).json({ error: "Task already marked for today" });
      }

      const updatedProgress = currentProgress + 1;

      if (updatedProgress >= totalWorkingDays) {
        await checklist.update({ progress: "end", lastCompletedDate: today });
        return res.json({ message: "Checklist completed successfully" });
      } else {
        await checklist.update({ progress: updatedProgress.toString(), lastCompletedDate: today });
        return res.json({ message: "Checklist progress updated", progress: updatedProgress });
      }
    } else {
      return res.status(400).json({ error: "Task is outside the valid date range" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};