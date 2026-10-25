import { Router } from "express";
import {
  loginAdmin,
  getAdminMe,
  updateAdminProfile,
  changeAdminPassword,
} from "../controllers/admin.controller.js";
import { protectAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/login", loginAdmin);
router.get("/me", protectAdmin, getAdminMe);
router.put("/profile", protectAdmin, updateAdminProfile);
router.put("/change-password", protectAdmin, changeAdminPassword);

export default router;
