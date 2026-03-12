import { Router } from "express";
import MaintenanceRequest from "../models/MaintenanceRequest.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const items = await MaintenanceRequest.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const created = await MaintenanceRequest.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await MaintenanceRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;


