import express from "express";
import { uploadImage } from "../controllers/upload.controller.js";
import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protectAdmin, uploadImage);

export default router;
