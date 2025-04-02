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
    const newReport = await Report.create({ name, startDate, endDate });

    return res.status(201).json({ message: "Report created successfully", report: newReport });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllReportNames = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ["userName"] }); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const completeReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findByPk(id);

    if (!report) return res.status(404).json({ error: "Report not found" });

    const startDate = new Date(report.startDate);
    const endDate = new Date(report.endDate);
    const today = new Date();

    console.log("Report before update:", report);

    let updatedReport;
    if (today >= startDate && today <= endDate) {
      updatedReport = await report.update({
        progress: "completed",
        completionDate: today,
      });
    } else {
      updatedReport = await report.update({
        progress: "pending",
        completionDate: null,
      });
    }

    console.log("Report after update:", updatedReport);
    return res.json({ message: "Report status updated", report: updatedReport });
  } catch (error) {
    console.error("Error in completeReport:", error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getAllReports,
  createOrUpdateReport,
  getAllReportNames,
  completeReport,
};