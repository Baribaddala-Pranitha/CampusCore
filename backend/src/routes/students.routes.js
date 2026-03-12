import { Router } from "express";
import Student from "../models/Student.js";
import Assignment from "../models/Assignment.js";
import Exam from "../models/Exam.js";
import Classroom from "../models/Class.js";
import Transaction from "../models/Transaction.js";
import ExamResult from "../models/ExamResult.js";
import Notification from "../models/Notification.js";
import Message from "../models/Message.js";
import Bus from "../models/Bus.js";
import Submission from "../models/Submission.js";
import Attendance from "../models/Attendance.js";

const router = Router();

// Stats
router.get("/stats", async (_req, res) => {
  try {
    const [total, active, inactive, last30] = await Promise.all([
      Student.countDocuments({}),
      Student.countDocuments({ status: "Active" }),
      Student.countDocuments({ status: "Inactive" }),
      Student.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
    ]);
    res.json({ total, active, inactive, newAdmissions30d: last30 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET / - list with basic filters
router.get("/", async (req, res) => {
  try {
    const { q, className, status } = req.query;
    const filter = {};
    if (q) filter.$or = [{ name: new RegExp(q, "i") }, { studentId: new RegExp(q, "i") }];
    if (className) filter.className = className;
    if (status) filter.status = status;
    const students = await Student.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json(students);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST / - create
router.post("/", async (req, res) => {
  try {
    const created = await Student.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// GET /:id
router.get("/:id", async (req, res) => {
  try {
    const item = await Student.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PUT /:id
router.put("/:id", async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PUT /:id/transport - update transport-related fields like onBoard
router.put("/:id/transport", async (req, res) => {
  try {
    const allowed = {};
    if (typeof req.body.onBoard === 'boolean') allowed.onBoard = req.body.onBoard;
    const updated = await Student.findByIdAndUpdate(req.params.id, allowed, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Accept POST as well to be tolerant of clients sending POST with override
router.post("/:id/transport", async (req, res) => {
  try {
    const allowed = {};
    if (typeof req.body.onBoard === 'boolean') allowed.onBoard = req.body.onBoard;
    const updated = await Student.findByIdAndUpdate(req.params.id, allowed, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE /:id
router.delete("/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Student Portal: assignments for the student's class
router.get("/:id/assignments", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Not found" });
    const items = await Assignment.find({ className: `Class ${student.className}` }).sort({ dueDate: 1 });
    res.json(items);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Student Portal: exams for the student's class
router.get("/:id/exams", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Not found" });
    const items = await Exam.find({ className: `Class ${student.className}` }).sort({ date: 1 });
    res.json(items);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Student Portal: timetable derived from classroom
router.get("/:id/timetable", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Not found" });
    const cls = await Classroom.findOne({ name: `Class ${student.className}` });
    res.json(cls?.timetable || []);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Student Portal: simple attendance summary (last 30 days presence percentage)
router.get("/:id/attendance-summary", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Not found" });
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const records = await Attendance.find({
      className: `Class ${student.className}`,
      date: { $gte: since },
      "entries.rollNo": `${student.className}-${student.rollNo}`,
    });
    const total = records.length;
    let present = 0;
    for (const r of records) {
      const entry = (r.entries || []).find((e) => e.rollNo === `${student.className}-${student.rollNo}`);
      if (entry?.present) present++;
    }
    const percentage = total ? Math.round((present / total) * 100) : 0;
    res.json({ last30d: { total, present, percentage } });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Student Portal: fees (transactions)
router.get("/:id/fees", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Not found" });
    const items = await Transaction.find({ studentName: student.name }).sort({ date: -1 });
    res.json(items);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Student Portal: submit an assignment
router.post("/:id/assignments/:assignmentId/submit", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Not found" });
    const created = await Submission.create({
      assignmentId: req.params.assignmentId,
      studentName: student.name,
      className: `Class ${student.className}`,
      status: "Submitted",
    });
    res.status(201).json(created);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// Student Portal: get submitted assignments for student
router.get("/:id/assignments/submitted", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Not found" });
    const items = await Submission.find({ studentName: student.name }).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// Student Portal: pay a fee transaction
router.put("/:id/fees/:transactionId/pay", async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(req.params.transactionId, { status: "Paid" }, { new: true });
    res.json(updated);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// Student Portal: grades/results
router.get("/:id/grades", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Not found" });
    const items = await ExamResult.find({ studentId: student._id }).sort({ date: -1 });
    res.json(items);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Student Portal: notifications (simple global list filtered)
router.get("/:id/notifications", async (_req, res) => {
  try {
    const items = await Notification.find({}).sort({ createdAt: -1 }).limit(50);
    res.json(items);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Student Portal: messages (sample global inbox)
router.get("/:id/messages", async (_req, res) => {
  try {
    const items = await Message.find({}).sort({ createdAt: -1 }).limit(50);
    res.json(items);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Student Portal: transport (show buses; could filter by route later)
router.get("/:id/transport", async (_req, res) => {
  try {
    const items = await Bus.find({}).sort({ number: 1 });
    res.json(items);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;


