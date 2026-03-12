import { Router } from "express";
import Teacher from "../models/Teacher.js";
import Assignment from "../models/Assignment.js";
import Exam from "../models/Exam.js";
import Attendance from "../models/Attendance.js";
import Submission from "../models/Submission.js";

const router = Router();

router.get("/stats", async (_req, res) => {
  try {
    const [total, active, onLeave] = await Promise.all([
      Teacher.countDocuments({}),
      Teacher.countDocuments({ status: "Active" }),
      Teacher.countDocuments({ status: "On Leave" }),
    ]);
    res.json({ total, active, onLeave });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { q, status } = req.query;
    const filter = {};
    if (q) filter.$or = [{ name: new RegExp(q, "i") }, { subject: new RegExp(q, "i") }];
    if (status) filter.status = status;
    const teachers = await Teacher.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json(teachers);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const created = await Teacher.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Teacher.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Teacher -> Classes
router.get("/:id/classes", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ error: "Not found" });
    // Classes can be linked either by teacherName or by class name membership
    const Classroom = (await import("../models/Class.js")).default;
    const classes = await Classroom.find({
      $or: [
        { teacherName: teacher.name },
        { name: { $in: (teacher.classes || []).map((c) => (c.startsWith("Class ") ? c : `Class ${c}`)) } },
      ],
    }).sort({ name: 1 });
    res.json(classes);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Teacher -> Assignments
router.get("/:id/assignments", async (req, res) => {
  try {
    const items = await Assignment.find({ teacherId: req.params.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/:id/assignments", async (req, res) => {
  try {
    const created = await Assignment.create({ ...req.body, teacherId: req.params.id });
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put("/:id/assignments/:assignmentId", async (req, res) => {
  try {
    const updated = await Assignment.findByIdAndUpdate(req.params.assignmentId, req.body, { new: true });
    res.json(updated);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// Assignment submissions
router.get("/:id/assignments/:assignmentId/submissions", async (req, res) => {
  try {
    const items = await Submission.find({ assignmentId: req.params.assignmentId }).sort({ submittedAt: -1 });
    res.json(items);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// Teacher -> Exams
router.get("/:id/exams", async (req, res) => {
  try {
    const items = await Exam.find({ teacherId: req.params.id }).sort({ date: 1 });
    res.json(items);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/:id/exams", async (req, res) => {
  try {
    const created = await Exam.create({ ...req.body, teacherId: req.params.id });
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Enter grades for an exam (bulk update or create results)
router.post("/:id/exams/:examId/grades", async (req, res) => {
  try {
    // Accepts array of { studentName, className, score, maxMarks, grade }
    const ExamResult = (await import("../models/ExamResult.js")).default;
    const payload = Array.isArray(req.body) ? req.body : [];
    const inserted = await ExamResult.insertMany(payload.map((p) => ({
      ...p,
      date: new Date(),
    })));
    res.status(201).json(inserted);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// Teacher -> Attendance
router.get("/:id/attendance", async (req, res) => {
  try {
    const { className, date } = req.query;
    const filter = { teacherId: req.params.id };
    if (className) filter.className = className;
    if (date) filter.date = new Date(date);
    const records = await Attendance.find(filter).sort({ date: -1 }).limit(31);
    res.json(records);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/:id/attendance", async (req, res) => {
  try {
    const created = await Attendance.create({ ...req.body, teacherId: req.params.id });
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Teacher -> Timetable (aggregated from classes)
router.get("/:id/timetable", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ error: "Not found" });
    const Classroom = (await import("../models/Class.js")).default;
    const classes = await Classroom.find({
      $or: [
        { teacherName: teacher.name },
        { name: { $in: (teacher.classes || []).map((c) => (c.startsWith("Class ") ? c : `Class ${c}`)) } },
      ],
    });
    const timetable = classes.flatMap((c) => (c.timetable || []).map((t) => ({ ...t, className: c.name })));
    res.json(timetable);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;


