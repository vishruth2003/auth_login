const Checklist = require("../models/Checklist");
const Delegations = require("../models/Delegations");
const Delegation = require("../models/Delegations");
const Report = require("../models/report");


const getChecklists = async (req, res) => {
  const username = req.headers.username; 
  try {
    const checklists = await Checklist.find({ empname: username }); 
    res.status(200).json(checklists);
  } catch (error) {
    console.error("Error fetching checklist data:", error);
    res.status(500).json({ message: "Failed to fetch checklist data" });
  }
};

const getDelegations = async (req, res) => {
  const username = req.headers.username; 
  try {
    const delegations = await Delegations.find({ empname: username });
    res.status(200).json(delegations);
  } catch (error) {
    console.error("Error fetching delegation data:", error);
    res.status(500).json({ message: "Failed to fetch delegation data" });
  }
};

const getReports = async (req, res) => {
  const username = req.headers.username; 
  try {
    const reports = await Report.find({ name: username }); 
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching report data:", error);
    res.status(500).json({ message: "Failed to fetch report data" });
  }
};

module.exports = { getChecklists, getDelegations, getReports };