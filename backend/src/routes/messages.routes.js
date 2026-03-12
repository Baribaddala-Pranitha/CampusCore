import { Router } from "express";
import Message from "../models/Message.js";

const router = Router();

router.get("/stats", async (_req, res) => {
  try {
    const [total, unread] = await Promise.all([
      Message.countDocuments({}),
      Message.countDocuments({ unread: true }),
    ]);
    res.json({ total, unread });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/", async (_req, res) => {
  try {
    const items = await Message.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const created = await Message.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put("/:id/read", async (req, res) => {
  try {
    const updated = await Message.findByIdAndUpdate(req.params.id, { unread: false }, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/all", async (_req, res) => {
  try {
    const items = await Message.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;


