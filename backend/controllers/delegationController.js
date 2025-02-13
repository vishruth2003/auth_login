const { User, Delegation } = require("../models");

const createDelegation = async (req, res) => {
  try {
    const { userName, dept, custName, task, plannedDate } = req.body;

    // Check if the user exists in the Users table
    const user = await User.findOne({ where: { userName } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Store userName instead of userId in Delegations
    const delegation = await Delegation.create({
      userName,  // Store userName instead of userId
      dept,
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
