import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT token authenticity.
 * Extracts token from the Authorization header and verifies it.
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_super_secret_jwt_key");
    req.user = decoded; // Contains userId, email, role
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired. Please log in again." });
    }
    return res.status(401).json({ error: "Invalid token." });
  }
};

/**
 * Middleware to authorize access based on user roles.
 * @param {...string} roles - The list of allowed roles.
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: "Authentication context missing." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access Denied. Role '${req.user.role}' is not authorized to access this resource.`,
      });
    }

    next();
  };
};
