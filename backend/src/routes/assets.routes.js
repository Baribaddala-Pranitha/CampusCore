import { Router } from "express";
import Asset from "../models/Asset.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const items = await Asset.find({}).sort({ name: 1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const created = await Asset.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;


