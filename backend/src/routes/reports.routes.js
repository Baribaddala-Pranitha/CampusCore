import { Router } from "express";
import Report from "../models/Report.js";

const router = Router();

router.get("/stats", async (_req, res) => {
  try {
    const [generated, templates] = await Promise.all([
      Report.countDocuments({}),
      Report.distinct("type"),
    ]);
    res.json({ generated, templates: templates.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/", async (_req, res) => {
  try {
    const items = await Report.find({}).sort({ updatedAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/generate", async (req, res) => {
  try {
    const { title, type, data } = req.body;
    const created = await Report.create({ title, type, data, lastGenerated: new Date() });
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;


