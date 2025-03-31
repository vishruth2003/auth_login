const { Report, User } = require("../models");

const getAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createOrUpdateReport = async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;

    // Always create a new report entry
    const newReport = await Report.create({ name, startDate, endDate });

    return res.status(201).json({ message: "Report created successfully", report: newReport });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllReportNames = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ["userName"] }); // Fetch usernames from Users table
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllReports,
  createOrUpdateReport,
  getAllReportNames 
};