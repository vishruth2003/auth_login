const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

router.get("/", reportController.getAllReports);

router.post("/create-report", reportController.createOrUpdateReport);

router.get("/names", reportController.getAllReportNames);

module.exports = router;