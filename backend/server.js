require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);

db.sequelize.sync().then(() => {
  app.listen(5000, () => console.log("Server running on port 5000"));
});
