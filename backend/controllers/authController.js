const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Delegation } = require("../models");

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

        // Check if the user has filled profile details
        const isNewUser = !user.userName || !user.userPhone || !user.roleId || !user.roleName || !user.projectStatus;

        res.json({ 
            message: "Login successful", 
            token, 
            isNewUser  // Send this flag to frontend
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { 
      attributes: ["userName", "userPhone", "roleId", "roleName", "projectStatus"]
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  

exports.updateProfile = async (req, res) => {
  try {
      const { userName, userPhone, roleId, roleName, projectStatus } = req.body;

      const user = await User.findByPk(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      // ✅ Log user details before update
      console.log("Updating User:", user.id, userName, userPhone, roleId, roleName, projectStatus);

      await user.update({ userName, userPhone, roleId, roleName, projectStatus });

      // ✅ Check if Delegation entry exists
      let existingDelegation = await Delegation.findOne({ where: { empname: user.userName } });

      if (!existingDelegation) {
          console.log("Creating new delegation for:", userName);
          existingDelegation = await Delegation.create({ empname: userName });
      } else {
          console.log("Updating delegation for:", userName);
          await existingDelegation.update({ empname: userName });
      }

      res.json({ message: "Profile updated successfully", success: true });

  } catch (error) {
      console.error("Profile update error:", error);  // ✅ Log full error
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


  
