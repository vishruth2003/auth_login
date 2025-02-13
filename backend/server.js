require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models");
const authRoutes = require("./routes/authRoutes");
const delegationRoutes = require("./routes/delegationRoutes"); // Import delegation routes

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/api/delegations", delegationRoutes); // Add delegation API routes

db.sequelize.sync().then(() => {
  app.listen(5000, () => console.log("Server running on port 5000"));
});
