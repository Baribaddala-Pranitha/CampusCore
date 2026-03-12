import { Router } from "express";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Classroom from "../models/Class.js";
import Bus from "../models/Bus.js";
import Transaction from "../models/Transaction.js";
import School from "../models/School.js";
import bcrypt from "bcryptjs";

const router = Router();

router.get("/dashboard/summary", async (_req, res) => {
  try {
    const [studentsCount, teachersCount, busesActive, pendingFees] = await Promise.all([
      Student.countDocuments({ status: "Active" }),
      Teacher.countDocuments({ status: { $in: ["Active", "On Leave"] } }),
      Bus.countDocuments({ status: "Active" }),
      Transaction.aggregate([
        { $match: { status: "Pending" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
    ]);

    const pendingTotal = pendingFees[0]?.total || 0;

    res.json({
      studentsCount,
      teachersCount,
      busesActive,
      pendingFees: pendingTotal,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/classes/overview", async (_req, res) => {
  try {
    const classes = await Classroom.find({}).sort({ name: 1 });
    res.json(classes);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Change password route
router.post("/change-password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long" });
    }

    // For demo purposes, we'll use a default admin school
    // In a real app, you'd get the school ID from the authenticated user
    const school = await School.findOne({ email: "admin@school.com" });
    
    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    // Verify current password
    const isMatch = await school.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Update password
    school.password = newPassword;
    await school.save();

    res.json({ message: "Password changed successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;


