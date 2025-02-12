const express = require("express");
const { updateProfile, login, signup, getProfile, getUserDetails } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put("/updateProfile", authMiddleware, updateProfile);  
router.get("/user", authMiddleware, getUserDetails);

module.exports = router;
