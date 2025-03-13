const express = require("express");
const { createChecklist, getAllChecklists, getChecklistsByUser } = require("../controllers/checklistController");

const router = express.Router();

router.post("/create-checklist", createChecklist);
router.get("/checklists", getAllChecklists);
router.get("/checklists/:userName", getChecklistsByUser);

module.exports = router;