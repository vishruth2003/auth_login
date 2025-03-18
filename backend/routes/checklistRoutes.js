const express = require("express");
const { createChecklist, getAllChecklists, getChecklistsByUser, completeChecklist } = require("../controllers/checklistController");

const router = express.Router();

router.post("/create-checklist", createChecklist);
router.get("/checklists", getAllChecklists);
router.get("/checklists/:userName", getChecklistsByUser);
router.put("/checklists/:id/complete", completeChecklist); 

module.exports = router;