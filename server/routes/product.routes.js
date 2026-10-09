import { Router } from "express";
import {
  getProducts,
  getProductBySlug,
  getProductFilters,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { protectAdmin } from "../middleware/auth.js";

const router = Router();

// Public catalog access
router.get("/", getProducts);
router.get("/filters", getProductFilters);
router.get("/:slug", getProductBySlug);

// Admin-only catalog management
router.post("/", protectAdmin, createProduct);
router.put("/:id", protectAdmin, updateProduct);
router.delete("/:id", protectAdmin, deleteProduct);

export default router;
