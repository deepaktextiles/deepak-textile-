import jwt from "jsonwebtoken";
import { Admin } from "../server/models/Admin.js";
import { connectDB } from "./db.js";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "deepak_textiles_super_secret_jwt_key_2026_b2b_wholesale_token";

export function generateAdminToken(admin) {
  return jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export async function getAuthenticatedAdmin(req) {
  try {
    await connectDB();
    const authHeader = req.headers.get("authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return null;
    }
    const token = authHeader.split(" ")[1];
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) return null;

    const admin = await Admin.findById(decoded.id).select("-password");
    return admin;
  } catch {
    return null;
  }
}
