import express from "express";
import {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";
import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllReviews);
router.post("/", protectAdmin, createReview);
router.put("/:id", protectAdmin, updateReview);
router.delete("/:id", protectAdmin, deleteReview);

export default router;
