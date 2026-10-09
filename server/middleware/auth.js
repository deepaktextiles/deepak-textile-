import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";

export const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Admin authorization token missing.",
    });
  }

  try {
    const secret = process.env.JWT_SECRET || "deepak_textiles_secret_jwt_key_2026";
    const decoded = jwt.verify(token, secret);

    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin account not found.",
      });
    }

    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Session expired or invalid token. Please sign in again.",
    });
  }
};
