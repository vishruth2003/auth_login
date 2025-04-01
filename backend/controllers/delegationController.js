const { User, Delegation } = require("../models");

const createDelegation = async (req, res) => {
  try {
    const { userName, custName, task, plannedDate } = req.body;

    const user = await User.findOne({ where: { userName } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const delegation = await Delegation.create({
      userName,
      dept: user.department, 
      custName,
      task,
      plannedDate
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

    // Check if the task is being completed before or on the planned date
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

module.exports = { createDelegation, completeDelegation };