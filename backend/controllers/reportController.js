const { Report } = require("../models");

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

    const existingReport = await Report.findOne({ where: { name } });

    if (existingReport) {
      await existingReport.update({ startDate, endDate });
      return res.json(existingReport);
    } else {
      const newReport = await Report.create({ name, startDate, endDate });
      return res.json(newReport);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllReportNames = async (req, res) => {
  try {
    const reports = await Report.findAll({ attributes: ["name"] });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllReports,
  createOrUpdateReport,
  getAllReportNames 
};