import { Router } from "express";
import Setting from "../models/Setting.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const items = await Setting.find({});
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { key, value } = req.body;
    const updated = await Setting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Change password placeholder (no auth wiring yet)
router.post("/change-password", async (req, res) => {
  // Normally validate current password and update hashed password in Users collection
  // For now, just acknowledge the request
  res.json({ ok: true });
});

export default router;


