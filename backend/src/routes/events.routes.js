import { Router } from "express";
import Event from "../models/Event.js";

const router = Router();

router.get("/stats", async (_req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const [total, thisMonth, upcoming] = await Promise.all([
      Event.countDocuments({}),
      Event.countDocuments({ date: { $gte: monthStart } }),
      Event.countDocuments({ date: { $gte: now } }),
    ]);
    res.json({ total, thisMonth, upcoming });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/", async (_req, res) => {
  try {
    const items = await Event.find({}).sort({ date: 1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const created = await Event.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;


