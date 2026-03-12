import { Router } from "express";
import School from "../models/School.js";
import bcrypt from "bcryptjs";

const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const { schoolName, principalName, email, phone, address, password } = req.body;
    
    // Check if school already exists
    const existingSchool = await School.findOne({ email });
    if (existingSchool) {
      return res.status(400).json({ error: "School with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create school
    const school = await School.create({
      schoolName,
      principalName,
      email,
      phone,
      address,
      password: hashedPassword
    });

    res.status(201).json({
      message: "School registered successfully",
      school: {
        id: school._id,
        schoolName: school.schoolName,
        email: school.email
      }
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const school = await School.findOne({ email });
    if (!school) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, school.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      school: {
        id: school._id,
        schoolName: school.schoolName,
        email: school.email
      }
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
