const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

router.get("/", reportController.getAllReports);
router.post("/create-report", reportController.createOrUpdateReport);
router.get("/names", reportController.getAllReportNames);
router.put("/:id/complete", reportController.completeReport); // Add this route

module.exports = router;