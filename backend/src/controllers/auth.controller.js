import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { sendVerificationEmail } from "../services/email.service.js";

/**
 * Register a new User with role selection
 * POST /api/auth/signup
 */
export const signup = async (req, res, next) => {
  try {
    const { schoolName, principalName, name, email, phone, address, password, role } = req.body;

    const activeRole = role || "admin";

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate secure random verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Resolve name
    let finalName = name;
    if (activeRole === "admin") {
      finalName = principalName || schoolName || name || "Admin User";
    }

    // Create and save unverified user
    const user = await User.create({
      name: finalName,
      email,
      password: hashedPassword,
      role: activeRole,
      schoolName: activeRole === "admin" ? schoolName : undefined,
      principalName: activeRole === "admin" ? principalName : undefined,
      phone,
      address,
      verified: false,
      verificationToken,
      verificationTokenExpiry,
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, finalName, verificationToken);
    } catch (emailError) {
      console.error("❌ Failed to send registration email:", emailError);
    }

    res.status(201).json({
      message: "User registered successfully. Please verify your email to activate your account.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify email address
 * GET /api/auth/verify/:token
 */
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    const clientUrl = process.env.CLIENT_URL || "http://localhost:8080";

    if (!user) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Verification Failed | EduManage</title>
          <style>
            body { font-family: sans-serif; background-color: #f3f4f6; text-align: center; padding: 50px; }
            .card { background: white; padding: 40px; border-radius: 12px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1 { color: #dc2626; }
            p { color: #4b5563; line-height: 1.6; }
            .btn { display: inline-block; background-color: #7c3aed; color: white !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Verification Failed</h1>
            <p>The verification link is invalid or has expired (links are valid for 24 hours).</p>
            <p>Please request a new verification link from the login page.</p>
            <a href="${clientUrl}/login?verified=false" class="btn">Go to Login</a>
          </div>
        </body>
        </html>
      `);
    }

    user.verified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();

    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Email Verified | EduManage</title>
        <meta http-equiv="refresh" content="3;url=${clientUrl}/login?verified=true" />
        <style>
          body { font-family: sans-serif; background-color: #f3f4f6; text-align: center; padding: 50px; }
          .card { background: white; padding: 40px; border-radius: 12px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          h1 { color: #16a34a; }
          p { color: #4b5563; line-height: 1.6; }
          .btn { display: inline-block; background-color: #7c3aed; color: white !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; margin-top: 20px; }
          .spinner { border: 4px solid rgba(0, 0, 0, 0.1); width: 36px; height: 36px; border-radius: 50%; border-left-color: #7c3aed; animation: spin 1s linear infinite; margin: 20px auto 0 auto; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Email Verified Successfully!</h1>
          <p>Thank you for verifying your email address. Your account is now active.</p>
          <p>Redirecting you to the login screen in 3 seconds...</p>
          <div class="spinner"></div>
          <a href="${clientUrl}/login?verified=true" class="btn">Proceed to Login</a>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Enforce email verification check
    if (!user.verified) {
      return res.status(403).json({ error: "Please verify your email before logging in." });
    }

    // Generate JWT including userId, email, and role
    const jwtSecret = process.env.JWT_SECRET || "default_super_secret_jwt_key";
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Resend verification token
 * POST /api/auth/resend-verification
 */
export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found with this email" });
    }

    if (user.verified) {
      return res.status(400).json({ error: "Email already verified." });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    await sendVerificationEmail(user.email, user.name, verificationToken);

    res.json({
      message: "Verification email resent successfully. Please check your inbox.",
    });
  } catch (error) {
    next(error);
  }
};
