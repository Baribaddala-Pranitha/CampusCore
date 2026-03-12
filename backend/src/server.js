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
app.use("/api/admin/students", studentRoutes);
app.use("/api/admin/teachers", teacherRoutes);
app.use("/api/admin/classes", classRoutes);
app.use("/api/admin/transport", transportRoutes);
app.use("/api/admin/finance", financeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/events", eventRoutes);
app.use("/api/admin/notifications", notificationRoutes);
app.use("/api/admin/assets", assetRoutes);
app.use("/api/admin/settings", settingRoutes);
app.use("/api/admin/reports", reportRoutes);
app.use("/api/admin/messages", messageRoutes);
app.use("/api/admin/maintenance", maintenanceRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/staff", staffRoutes);
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


