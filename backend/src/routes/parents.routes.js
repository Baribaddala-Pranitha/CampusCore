import { Router } from "express";
import Parent from "../models/Parent.js";
import Student from "../models/Student.js";
import Assignment from "../models/Assignment.js";
import ExamResult from "../models/ExamResult.js";
import Transaction from "../models/Transaction.js";
import Notification from "../models/Notification.js";
import Message from "../models/Message.js";
import Event from "../models/Event.js";

const router = Router();

// List parents (basic filter)
router.get("/", async (req, res) => {
  try {
    const { q } = req.query;
    const filter = {};
    if (q) filter.$or = [{ name: new RegExp(String(q), "i") }, { email: new RegExp(String(q), "i") }];
    const parents = await Parent.find(filter).populate("children").limit(100);
    res.json(parents);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Dashboard summary for parent
router.get("/:id/summary", async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id).populate("children");
    if (!parent) return res.status(404).json({ error: "Not found" });
    const childIds = parent.children.map((c) => c._id);
    const [fees, messages] = await Promise.all([
      Transaction.find({ studentName: { $in: parent.children.map((c) => c.name) } }),
      Message.find({}).limit(100),
    ]);
    const pending = fees.filter((f) => f.status !== "Paid").reduce((s, f) => s + (f.amount || 0), 0);
    res.json({ childrenCount: parent.children.length, pendingFees: pending, unreadMessages: messages.filter((m) => m.unread).length });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Children list
router.get("/:id/children", async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id).populate("children");
    if (!parent) return res.status(404).json({ error: "Not found" });
    res.json(parent.children);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Child assignments
router.get("/:id/children/:childId/assignments", async (req, res) => {
  try {
    const child = await Student.findById(req.params.childId);
    if (!child) return res.status(404).json({ error: "Not found" });
    const items = await Assignment.find({ className: `Class ${child.className}` }).sort({ dueDate: 1 });
    res.json(items);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Child grades
router.get("/:id/children/:childId/grades", async (req, res) => {
  try {
    const items = await ExamResult.find({ studentId: req.params.childId }).sort({ date: -1 });
    res.json(items);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Fees for all children
router.get("/:id/fees", async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id).populate("children");
    if (!parent) return res.status(404).json({ error: "Not found" });
    const items = await Transaction.find({ studentName: { $in: parent.children.map((c) => c.name) } }).sort({ date: -1 });
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

// Messages
router.get("/:id/messages", async (_req, res) => {
  try {
    const items = await Message.find({}).sort({ createdAt: -1 }).limit(50);
    res.json(items);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Events
router.get("/:id/events", async (_req, res) => {
  try {
    const items = await Event.find({}).sort({ date: 1 }).limit(50);
    res.json(items);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Parent profile (for settings)
router.get("/:id/profile", async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id);
    if (!parent) return res.status(404).json({ error: "Not found" });
    res.json(parent);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put("/:id/profile", async (req, res) => {
  try {
    const updated = await Parent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;



