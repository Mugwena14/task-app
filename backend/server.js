const path = require("path");
const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve uploaded images statically 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Set CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

// API routes
app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/voice", require("./routes/voiceRoutes"));
app.use("/api/notes", require("./routes/noteRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/build");
  app.use(express.static(frontendPath));

  // Return index.html for unknown routes
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(frontendPath, "index.html"))
  );
} else {
  app.get("/", (req, res) => res.send("API running (development mode)"));
}

// Error handler middleware
app.use(errorHandler);

// Start server
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`.cyan.bold)
);
