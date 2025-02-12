const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token, "your_jwt_secret");
    req.user = verified;  
    next();  
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};
