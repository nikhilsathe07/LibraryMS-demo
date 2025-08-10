import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import errorHandler from "./middleware/errorHandler.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "Library Management API is running!" });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5077;

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Graceful shutdown to prevent EADDRINUSE with nodemon restarts
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
