const express = require("express");
const { createChecklist, getAllChecklists } = require("../controllers/checklistController");

const router = express.Router();

router.post("/create-checklist", createChecklist);
router.get("/checklists", getAllChecklists);

module.exports = router;