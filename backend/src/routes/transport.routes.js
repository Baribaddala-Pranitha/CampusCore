import { Router } from "express";
import Bus from "../models/Bus.js";
import BusStop from "../models/BusStop.js";
import BusAttendance from "../models/BusAttendance.js";

const router = Router();

router.get("/stats", async (_req, res) => {
  try {
    const [totalBuses, activeRoutes, maintenanceDue] = await Promise.all([
      Bus.countDocuments({}),
      Bus.countDocuments({ status: "Active" }),
      Bus.countDocuments({ maintenance: { $in: ["Due", "In Progress"] } }),
    ]);
    res.json({ totalBuses, activeRoutes, maintenanceDue });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/buses", async (_req, res) => {
  try {
    const buses = await Bus.find({}).sort({ number: 1 });
    res.json(buses);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/buses", async (req, res) => {
  try {
    const created = await Bus.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put("/buses/:id", async (req, res) => {
  try {
    const updated = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete("/buses/:id", async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Bus stops for a bus
router.get("/buses/:id/stops", async (req, res) => {
  try {
    const stops = await BusStop.find({ busId: req.params.id }).sort({ order: 1 });
    res.json(stops);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Create a stop for a bus
router.post("/buses/:id/stops", async (req, res) => {
  try {
    const created = await BusStop.create({ busId: req.params.id, ...req.body });
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Update a stop
router.put("/stops/:stopId", async (req, res) => {
  try {
    const updated = await BusStop.findByIdAndUpdate(req.params.stopId, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete a stop
router.delete("/stops/:stopId", async (req, res) => {
  try {
    await BusStop.findByIdAndDelete(req.params.stopId);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Attendance for a bus (by date optional)
router.get("/buses/:id/attendance", async (req, res) => {
  try {
    const { date } = req.query;
    const filter = { busId: req.params.id };
    if (date) filter.date = new Date(String(date));
    const items = await BusAttendance.find(filter).sort({ date: -1 }).limit(7);
    res.json(items);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/buses/:id/attendance", async (req, res) => {
  try {
    const created = await BusAttendance.create({ ...req.body, busId: req.params.id });
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;


