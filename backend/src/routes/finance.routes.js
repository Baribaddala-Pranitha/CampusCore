import { Router } from "express";
import Transaction from "../models/Transaction.js";

const router = Router();

router.get("/stats", async (_req, res) => {
  try {
    const [paidAgg, pendingAgg] = await Promise.all([
      Transaction.aggregate([{ $match: { status: "Paid" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Transaction.aggregate([{ $match: { status: "Pending" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    ]);
    res.json({ collected: paidAgg[0]?.total || 0, pending: pendingAgg[0]?.total || 0 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    const items = await Transaction.find(filter).sort({ date: -1 }).limit(200);
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/transactions", async (req, res) => {
  try {
    const created = await Transaction.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;


