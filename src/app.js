const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const eventRoutes = require("./routes/eventRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

app.use(express.json({ limit: "2mb" }));

app.get("/", (req, res) => {
  res.json({
    message: "HookPilot API is running",
    status: "healthy"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/events", eventRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    message: "Internal server error",
    error: err.message
  });
});

module.exports = app;