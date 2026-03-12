import { Router } from "express";
import Classroom from "../models/Class.js";

const router = Router();

router.get("/stats", async (_req, res) => {
  try {
    const [totalClasses, totalSubjects, avgStudents] = await Promise.all([
      Classroom.countDocuments({}),
      Classroom.aggregate([{ $group: { _id: null, total: { $sum: "$subjectsCount" } } }]),
      Classroom.aggregate([{ $group: { _id: null, avg: { $avg: "$studentsCount" } } }]),
    ]);
    res.json({
      totalClasses,
      totalSubjects: totalSubjects[0]?.total || 0,
      avgStudents: Math.round(avgStudents[0]?.avg || 0),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/", async (_req, res) => {
  try {
    const classes = await Classroom.find({}).sort({ name: 1 });
    res.json(classes);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const created = await Classroom.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/:id/syllabus", async (req, res) => {
  try {
    const cls = await Classroom.findById(req.params.id);
    if (!cls) return res.status(404).json({ error: "Not found" });
    res.json(cls.syllabus || []);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/:id/syllabus", async (req, res) => {
  try {
    const { syllabus } = req.body;
    const updated = await Classroom.findByIdAndUpdate(req.params.id, { syllabus }, { new: true });
    res.json(updated.syllabus || []);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/:id/timetable", async (req, res) => {
  try {
    const cls = await Classroom.findById(req.params.id);
    if (!cls) return res.status(404).json({ error: "Not found" });
    res.json(cls.timetable || []);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/:id/timetable", async (req, res) => {
  try {
    const { timetable } = req.body;
    const updated = await Classroom.findByIdAndUpdate(req.params.id, { timetable }, { new: true });
    res.json(updated.timetable || []);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Classroom.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Classroom.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;


