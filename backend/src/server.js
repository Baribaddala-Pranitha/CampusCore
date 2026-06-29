import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectToDatabase } from "./utils/db.js";

import studentRoutes from "./routes/students.routes.js";
import teacherRoutes from "./routes/teachers.routes.js";
import classRoutes from "./routes/classes.routes.js";
import transportRoutes from "./routes/transport.routes.js";
import financeRoutes from "./routes/finance.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import eventRoutes from "./routes/events.routes.js";
import notificationRoutes from "./routes/notifications.routes.js";
import assetRoutes from "./routes/assets.routes.js";
import settingRoutes from "./routes/settings.routes.js";
import reportRoutes from "./routes/reports.routes.js";
import messageRoutes from "./routes/messages.routes.js";
import maintenanceRoutes from "./routes/maintenance.routes.js";
import parentRoutes from "./routes/parents.routes.js";
import staffRoutes from "./routes/staff.routes.js";
import testimonialRoutes from "./routes/testimonials.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { verifyToken, authorizeRoles } from "./middleware/auth.js";

dotenv.config();

const app = express();

// CORS: allow local dev frontends with credentials
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow REST clients/no origin and known dev origins
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Health
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV || "development" });
});

// Routes
app.use("/api/admin/students", verifyToken, authorizeRoles("admin", "student"), studentRoutes);
app.use("/api/admin/teachers", verifyToken, authorizeRoles("admin", "teacher"), teacherRoutes);
app.use("/api/admin/classes", verifyToken, authorizeRoles("admin", "teacher"), classRoutes);
app.use("/api/admin/transport", verifyToken, authorizeRoles("admin", "transport"), transportRoutes);
app.use("/api/admin/finance", verifyToken, authorizeRoles("admin"), financeRoutes);
app.use("/api/admin", verifyToken, authorizeRoles("admin"), adminRoutes);
app.use("/api/admin/events", verifyToken, authorizeRoles("admin", "teacher", "student", "parent", "staff", "transport"), eventRoutes);
app.use("/api/admin/notifications", verifyToken, authorizeRoles("admin", "teacher", "student", "parent", "staff", "transport"), notificationRoutes);
app.use("/api/admin/assets", verifyToken, authorizeRoles("admin", "staff"), assetRoutes);
app.use("/api/admin/settings", verifyToken, authorizeRoles("admin"), settingRoutes);
app.use("/api/admin/reports", verifyToken, authorizeRoles("admin"), reportRoutes);
app.use("/api/admin/messages", verifyToken, authorizeRoles("admin", "teacher", "student", "parent", "staff", "transport"), messageRoutes);
app.use("/api/admin/maintenance", verifyToken, authorizeRoles("admin", "staff"), maintenanceRoutes);
app.use("/api/parents", verifyToken, authorizeRoles("admin", "parent"), parentRoutes);
app.use("/api/staff", verifyToken, authorizeRoles("admin", "staff"), staffRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/auth", authRoutes);

// DB check route
app.get("/api/test/db", async (_req, res) => {
  try {
    const state = await connectToDatabase();
    res.json({ connected: true, state });
  } catch (err) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

// Centralized error handling middleware
app.use(errorHandler);

let PORT = Number(process.env.PORT) || 4000;

async function start() {
  await connectToDatabase();
  const server = app
    .listen(PORT)
    .on("listening", () => console.log(`Backend listening on http://localhost:${PORT}`))
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        PORT = PORT + 1;
        console.warn(`Port in use, retrying on ${PORT}...`);
        app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
      } else {
        throw err;
      }
    });
}

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});


