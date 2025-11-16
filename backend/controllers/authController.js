import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

import { addToBlacklist } from "../middleware/tokenBlacklist.js";

// Optional registration function (commented out). Uncomment to enable registration.

export const registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res
        .status(400)
        .json({ message: "username, password and role are required" });
    }

    const existing = await User.findOne({ username });
    if (existing)
      return res.status(409).json({ message: "Username already exists" });

    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    const user = new User({ username, password: hashed, role });
    await user.save();

    return res
      .status(201)
      .json({ id: user._id, username: user.username, role: user.role });
  } catch (err) {
    console.error("Register error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { id: user._id, role: user.role };
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not set in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    return res.json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Logout: accept token via Authorization header or cookie and blacklist it
export const logoutUser = async (req, res) => {
  try {
    // Try authorization header first
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      // Nothing to do server-side; instruct client to remove token
      res.clearCookie && res.clearCookie("token");
      return res.json({ message: "Logged out" });
    }

    // Try to decode token to extract expiry
    let decoded;
    try {
      decoded = jwt.decode(token);
    } catch (e) {
      decoded = null;
    }

    const exp =
      decoded && decoded.exp ? decoded.exp : Math.floor(Date.now() / 1000) + 60;
    addToBlacklist(token, exp);

    // Clear cookie if present
    res.clearCookie && res.clearCookie("token");

    return res.json({ message: "Logged out" });
  } catch (err) {
    console.error("logout error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export default { loginUser, registerUser };
