const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const gradesRoutes = require("./routes/grades");

const app = express();

// Security: Disable X-Powered-By header to hide technology stack
app.disable("x-powered-by");
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/grades", gradesRoutes);

module.exports = app;