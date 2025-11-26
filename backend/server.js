import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";
import { protect, authorizeRoles } from "./middleware/authMiddleware.js";

// Load environment variables from .env
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Expose auth helpers on the app (optional) so other modules can access them if needed
app.locals.auth = { protect, authorizeRoles };

// Health / root route
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Ecoweave API" });
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin-products", adminProductRoutes);

const PORT = process.env.PORT || 8080;

const start = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error(
        "MONGO_URI is not defined in environment variables. Please set it in your .env file."
      );
      process.exit(1);
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected");

    app.listen(PORT, "0.0.0.0",() => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
