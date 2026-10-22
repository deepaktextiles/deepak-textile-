import { Router } from "express";
import {
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../controllers/banner.controller.js";
import { protectAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", getAllBanners);
router.get("/:id", getBannerById);

// Admin Protected CRUD
router.post("/", protectAdmin, createBanner);
router.put("/:id", protectAdmin, updateBanner);
router.delete("/:id", protectAdmin, deleteBanner);

export default router;
