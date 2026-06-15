const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const gradesRoutes = require("./routes/grades");
const scheduleRoutes = require("./routes/schedule");
const certificateRoutes = require("./routes/certificates");

const app = express();

// Security: Disable X-Powered-By header to hide technology stack
app.disable("x-powered-by");
const allowedOrigins = [process.env.FRONTEND_ORIGIN || "http://localhost:5173"];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/grades", gradesRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/tramites", certificateRoutes);

module.exports = app;
