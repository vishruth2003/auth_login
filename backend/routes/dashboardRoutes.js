const express = require("express");
const router = express.Router();
const { getChecklists, getDelegations, getReports } = require("../controllers/dashboardController");

router.get("/checklists", getChecklists);
router.get("/delegations", getDelegations);
router.get("/reports", getReports);

module.exports = router;