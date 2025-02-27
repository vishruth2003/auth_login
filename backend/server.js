require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models");
const authRoutes = require("./routes/authRoutes");
const delegationRoutes = require("./routes/delegationRoutes"); 
const reportRoutes = require("./routes/reportRoutes");
const customerRoutes = require("./routes/customerRoutes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/api/delegations", delegationRoutes); 
app.use("/api/reports", reportRoutes);
app.use("/api", customerRoutes);

db.sequelize.sync().then(() => {
  app.listen(5000, () => console.log("Server running on port 5000"));
});
