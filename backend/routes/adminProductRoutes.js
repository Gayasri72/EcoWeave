import express from "express";
import * as adminProductController from "../controllers/adminProductController.js";

const router = express.Router();

// Public list of admin products (created automatically from staff submissions)
router.get("/", adminProductController.listAdminProducts);

// Get single admin product by productId
router.get("/:productId", adminProductController.getAdminProduct);

export default router;
