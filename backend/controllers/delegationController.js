const { User, Delegation } = require("../models");

const createDelegation = async (req, res) => {
  try {
    const { userName, custName, task, plannedDate, startdate } = req.body;

    const user = await User.findOne({ where: { userName } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const delegation = await Delegation.create({
      userName,
      dept: user.department,
      custName,
      task,
      planneddate: plannedDate,
      startdate: startdate || new Date(), 
    });

    res.status(201).json({ message: "Delegation created successfully", delegation });
  } catch (error) {
    res.status(500).json({ message: "Error creating delegation", error: error.message });
  }
};

const completeDelegation = async (req, res) => {
  try {
    const { id } = req.params;
    const delegation = await Delegation.findByPk(id);

    if (!delegation) return res.status(404).json({ error: "Delegation not found" });

    const plannedDate = new Date(delegation.planneddate);
    const today = new Date();

    if (today <= plannedDate) {
      await delegation.update({ progress: "completed" });
      return res.json({ message: "Delegation marked as completed successfully" });
    } else {
      await delegation.update({ progress: "pending" });
      return res.json({ message: "Delegation is pending as it was not completed on time" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDelegationsByUser = async (req, res) => {
  try {
    const { userName } = req.params;
    const delegations = await Delegation.findAll({ where: { empname: userName.trim() } });
    res.json(delegations);
  } catch (error) {
    console.error("Error fetching delegations:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateDelegationProgress = async (req, res) => {
  try {
    const { id } = req.params;

    const delegation = await Delegation.findByPk(id);
    if (!delegation) return res.status(404).json({ error: "Delegation not found" });

    const startDate = new Date(delegation.startdate);
    const endDate = new Date(delegation.planneddate);
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

    // Prevent updates on weekends
    const isWeekend = (date) => {
      const day = date.getDay();
      return day === 0 || day === 6; 
    };

    if (isWeekend(today)) {
      return res.status(400).json({ error: "Cannot update progress on weekends" });
    }

    if (today < startDate || today > endDate) {
      return res.status(400).json({ error: "Task is outside the valid date range" });
    }

    const lastCompletedDate = new Date(delegation.lastcompleteddate || 0);
    if (lastCompletedDate.toDateString() === today.toDateString()) {
      return res.status(400).json({ error: "Task already marked for today" });
    }

    const currentProgress = delegation.progress ? parseInt(delegation.progress) : 0;
    const updatedProgress = currentProgress + 1;

    if (updatedProgress >= totalWorkingDays) {
      await delegation.update({ progress: "completed", lastcompleteddate: today });
      return res.json({ message: "Delegation completed successfully" });
    } else {
      await delegation.update({ progress: updatedProgress.toString(), lastcompleteddate: today });
      return res.json({ message: "Delegation progress updated", progress: updatedProgress });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRemarks = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    const delegation = await Delegation.findByPk(id);
    if (!delegation) return res.status(404).json({ error: "Delegation not found" });

    await delegation.update({ remarks });

    res.json({ message: "Remarks updated successfully", delegation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createDelegation, completeDelegation, getDelegationsByUser, updateDelegationProgress, updateRemarks };