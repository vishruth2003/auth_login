require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./models");
const authRoutes = require("./routes/authRoutes");
const delegationRoutes = require("./routes/delegationRoutes"); 
const reportRoutes = require("./routes/reportRoutes");
const customerRoutes = require("./routes/customerRoutes");
const checklistRoutes = require("./routes/checklistRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/api/delegations", delegationRoutes); 
app.use("/api/reports", reportRoutes);
app.use("/api", customerRoutes);
app.use("/api", checklistRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
