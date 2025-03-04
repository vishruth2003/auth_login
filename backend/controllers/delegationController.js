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

module.exports = { createDelegation };