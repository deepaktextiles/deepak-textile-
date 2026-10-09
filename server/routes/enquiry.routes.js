import { Router } from "express";
import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  deleteEnquiry,
} from "../controllers/enquiry.controller.js";
import { protectAdmin } from "../middleware/auth.js";

const router = Router();

// Public wholesale quote submission
router.post("/", createEnquiry);

// Admin-only lead tracking
router.get("/", protectAdmin, getEnquiries);
router.get("/:id", protectAdmin, getEnquiryById);
router.put("/:id/status", protectAdmin, updateEnquiryStatus);
router.delete("/:id", protectAdmin, deleteEnquiry);

export default router;
