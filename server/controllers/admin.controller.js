import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";

const generateToken = (admin) => {
  const secret = process.env.JWT_SECRET || "deepak_textiles_secret_jwt_key_2026";
  return jwt.sign({ id: admin._id, role: admin.role }, secret, { expiresIn: "7d" });
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password." });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+password");
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid administrator credentials." });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid administrator credentials." });
    }

    const token = generateToken(admin);

    res.status(200).json({
      success: true,
      message: "Admin sign in successful.",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found." });
    }
    res.status(200).json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
