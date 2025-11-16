import jwt from "jsonwebtoken";
import { isBlacklisted } from "./tokenBlacklist.js";

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization header missing or malformed" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET not set in environment");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const payload = jwt.verify(token, secret);
    // Check if token has been blacklisted (logout)
    if (isBlacklisted(token)) {
      return res.status(401).json({ message: "Token revoked (logged out)" });
    }
    // payload expected to include id and role
    req.user = {
      id: payload.id || payload._id || payload.sub,
      role: payload.role,
    };

    return next();
  } catch (err) {
    console.error("auth protect error", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorizeRoles =
  (...roles) =>
  (req, res, next) => {
    try {
      if (!req.user || !req.user.role)
        return res.status(401).json({ message: "Unauthorized" });
      if (!roles.includes(req.user.role))
        return res
          .status(403)
          .json({ message: "Forbidden: insufficient role" });
      return next();
    } catch (err) {
      console.error("authorizeRoles error", err);
      return res.status(500).json({ message: "Server error" });
    }
  };

export default { protect, authorizeRoles };
