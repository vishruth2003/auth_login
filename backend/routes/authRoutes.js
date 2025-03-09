const express = require("express");
const { updateProfile, login, signup, getProfile, getUserDetails, getAllUsers, getUserDepartment, getAllUsernames } = require("../controllers/authController"); 
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put("/updateProfile", authMiddleware, updateProfile);
router.get("/user", authMiddleware, getUserDetails);
router.get("/users", authMiddleware, getAllUsers);
router.get("/users/:userName/department", getUserDepartment); 
router.get("/usernames", getAllUsernames); 

module.exports = router;