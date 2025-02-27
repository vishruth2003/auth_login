const express = require("express");
const router = express.Router();
const { getCustomers } = require("../controllers/customerController");

router.get("/customers", getCustomers);

module.exports = router;