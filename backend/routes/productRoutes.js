import express from "express";
import Product from "../models/Product.js";
import * as productController from "../controllers/productController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin creates a new product
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  productController.createProduct
);

// List all products (public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    return res.json(products);
  } catch (err) {
    console.error("list products error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get product by productId (public)
router.get("/:productId", productController.getProductById);

// Compare product metrics to standard values (public)
router.get("/:productId/compare", productController.compareToStandard);

// Delete product (Admin only)
router.delete(
  "/:productId",
  protect,
  authorizeRoles("admin"),
  productController.deleteProduct
);

// Get monthly report (Admin only)
router.get(
  "/report/monthly",
  protect,
  authorizeRoles("admin"),
  productController.getMonthlyReport
);

// Update stage (knitting/finishing/sewing) - protected with role checks
router.put("/:productId/stage/:stage", protect, (req, res, next) => {
  const { stage } = req.params;
  const allowed = ["knitting", "finishing", "sewing"];
  if (!allowed.includes(stage))
    return res.status(400).json({ message: "Invalid stage" });

  const role = req.user && req.user.role;
  if (!role) return res.status(401).json({ message: "Unauthorized" });

  const stageAllowedRoles = {
    knitting: ["knitting", "admin"],
    finishing: ["finishing", "admin"],
    sewing: ["sewing", "admin"],
  };

  if (!stageAllowedRoles[stage].includes(role)) {
    return res
      .status(403)
      .json({ message: "Forbidden: insufficient role for this stage" });
  }

  return productController.updateStage(req, res, next);
});

// Reviews removed; no review routes

export default router;
