const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Delegation, Report } = require("../models");

exports.signup = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;

    const existingUser = await User.findOne({ where: { userEmail } });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const newUser = await User.create({ userEmail, userPassword: hashedPassword });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;

    const user = await User.findOne({ where: { userEmail } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(userPassword, user.userPassword);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, "your_jwt_secret", { expiresIn: "1h" });
    await user.update({ token });

    const isNewUser = !user.userName || !user.userPhone || !user.roleId || !user.roleName || !user.projectStatus || !user.department;

    res.json({ 
      message: "Login successful", 
      token, 
      isNewUser 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { 
      attributes: ["userName", "userPhone", "roleId", "roleName", "projectStatus", "department"]
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { userName, userPhone, roleId, roleName, projectStatus, department } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.update({ userName, userPhone, roleId, roleName, projectStatus, department });

    
    let existingReport = await Report.findOne({ where: { name: user.userName } });

    if (!existingReport) {
      await Report.create({ name: userName});
    } else {
      await existingReport.update({ name: userName });
    }

    res.json({ message: "Profile updated successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ["userName"] });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ userName: user.userName });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ["id", "userName"] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserDepartment = async (req, res) => {
  try {
    const { userName } = req.params;
    const user = await User.findOne({ where: { userName }, attributes: ["department"] });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ department: user.department });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsernames = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ["userName"] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};