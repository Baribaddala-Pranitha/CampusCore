import { Router } from "express";
import Staff from "../models/Staff.js";
import StaffTask from "../models/StaffTask.js";
import StaffAttendance from "../models/StaffAttendance.js";
import StaffLeave from "../models/StaffLeave.js";
import StaffPayroll from "../models/StaffPayroll.js";
import MaintenanceRequest from "../models/MaintenanceRequest.js";
import Notification from "../models/Notification.js";

const router = Router();

// Stats
router.get("/stats", async (_req, res) => {
  try {
    const [total, active, onLeave] = await Promise.all([
      Staff.countDocuments({}),
      Staff.countDocuments({ status: "Active" }),
      Staff.countDocuments({ status: "On Leave" }),
    ]);
    res.json({ total, active, onLeave });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Basic list
router.get("/", async (req, res) => {
  try {
    const { q, status } = req.query;
    const filter = {};
    if (q) filter.$or = [{ name: new RegExp(String(q), "i") }, { role: new RegExp(String(q), "i") }];
    if (status) filter.status = status;
    const items = await Staff.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Tasks
router.get("/:id/tasks", async (req, res) => {
  try {
    const items = await StaffTask.find({ staffId: req.params.id }).sort({ dueDate: 1 });
    res.json(items);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Update a task (e.g., status)
router.put("/:id/tasks/:taskId", async (req, res) => {
  try {
    const updated = await StaffTask.findByIdAndUpdate(req.params.taskId, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Attendance
router.get("/:id/attendance", async (req, res) => {
  try {
    const items = await StaffAttendance.find({ staffId: req.params.id }).sort({ date: -1 }).limit(60);
    res.json(items);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/:id/attendance", async (req, res) => {
  try {
    const created = await StaffAttendance.create({ staffId: req.params.id, ...req.body });
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Leave
router.get("/:id/leaves", async (req, res) => {
  try {
    const items = await StaffLeave.find({ staffId: req.params.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/:id/leaves", async (req, res) => {
  try {
    const created = await StaffLeave.create({ staffId: req.params.id, ...req.body });
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Payroll
router.get("/:id/payroll", async (req, res) => {
  try {
    const items = await StaffPayroll.find({ staffId: req.params.id }).sort({ createdAt: -1 }).limit(24);
    res.json(items);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Maintenance assignments (by latest requests; could be filtered by department)
router.get("/:id/maintenance", async (_req, res) => {
  try {
    const items = await MaintenanceRequest.find({}).sort({ createdAt: -1 }).limit(50);
    res.json(items);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Notifications
router.get("/:id/notifications", async (_req, res) => {
  try {
    const items = await Notification.find({}).sort({ createdAt: -1 }).limit(50);
    res.json(items);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Update staff profile (basic)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;



