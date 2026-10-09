import { Router } from "express";
import { loginAdmin, getAdminMe } from "../controllers/admin.controller.js";
import { protectAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/login", loginAdmin);
router.get("/me", protectAdmin, getAdminMe);

export default router;
