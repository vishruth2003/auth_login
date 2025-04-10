const express = require("express");
const { createChecklist, getAllChecklists, getChecklistsByUser, completeChecklist, updateRemarks } = require("../controllers/checklistController");

const router = express.Router();

router.post("/create-checklist", createChecklist);
router.get("/checklists", getAllChecklists);
router.get("/checklists/:userName", getChecklistsByUser);
router.put("/checklists/:id/complete", completeChecklist);
router.put("/:id/remarks", updateRemarks);

module.exports = router;