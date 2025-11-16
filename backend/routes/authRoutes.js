import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", authController.loginUser);

// POST /api/auth/logout
router.post("/logout", authController.logoutUser);

// Optional registration route. If the controller doesn't export registerUser,
// this will respond with 501 Not Implemented so the server doesn't crash.
if (typeof authController.registerUser === "function") {
  router.post("/register", authController.registerUser);
} else {
  router.post("/register", (req, res) =>
    res.status(501).json({ message: "Registration disabled on server" })
  );
}

export default router;
