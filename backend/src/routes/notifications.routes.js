import { Router } from "express";
import Notification from "../models/Notification.js";

const router = Router();

router.get("/stats", async (_req, res) => {
  try {
    const [total, unread] = await Promise.all([
      Notification.countDocuments({}),
      Notification.countDocuments({ unread: true }),
    ]);
    res.json({ total, unread });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/", async (_req, res) => {
  try {
    const items = await Notification.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const created = await Notification.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put("/:id/read", async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(req.params.id, { unread: false }, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/mark-all-read", async (_req, res) => {
  try {
    await Notification.updateMany({ unread: true }, { $set: { unread: false } });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;


