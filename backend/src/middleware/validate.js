/**
 * Validation middleware for auth requests
 */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSignup = (req, res, next) => {
  const { schoolName, principalName, name, email, password, role } = req.body;

  const activeRole = role || "admin";
  const allowedRoles = ["admin", "teacher", "student", "parent", "staff", "transport"];

  if (!allowedRoles.includes(activeRole)) {
    return res.status(400).json({ error: "Invalid role specified" });
  }

  // Validate name based on role
  if (activeRole === "admin") {
    const finalSchoolName = schoolName || name;
    if (!finalSchoolName || typeof finalSchoolName !== "string" || finalSchoolName.trim() === "") {
      return res.status(400).json({ error: "School name is required for admin" });
    }
    const finalPrincipalName = principalName || name;
    if (!finalPrincipalName || typeof finalPrincipalName !== "string" || finalPrincipalName.trim() === "") {
      return res.status(400).json({ error: "Principal name is required for admin" });
    }
  } else {
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ error: "Name is required" });
    }
  }

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email address" });
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long" });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email address" });
  }

  if (!password || typeof password !== "string" || password.trim() === "") {
    return res.status(400).json({ error: "Password is required" });
  }

  next();
};

export const validateResendVerification = (req, res, next) => {
  const { email } = req.body;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email address" });
  }

  next();
};
