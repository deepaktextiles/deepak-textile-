import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.js";

const generateToken = (admin) => {
  const secret = process.env.JWT_SECRET || "deepak_textiles_secret_jwt_key_2026";
  return jwt.sign({ id: admin._id, role: admin.role }, secret, { expiresIn: "7d" });
};

// POST /api/admin/login - Dynamic database admin authentication
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both admin email and password.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Dynamic lookup in MongoDB Admin collection
    let admin = await Admin.findOne({ email: cleanEmail }).select("+password");

    // 2. Initial DB bootstrap fallback: if no admin exists in the entire collection
    if (!admin) {
      const adminCount = await Admin.countDocuments();
      const defaultEmail = (process.env.ADMIN_EMAIL || "admin@deepaktextiles.com").toLowerCase().trim();

      // Only auto-create if zero admins in database or if matching the default seed email on initial setup
      if (adminCount === 0 || cleanEmail === defaultEmail) {
        const defaultPassword = process.env.ADMIN_PASSWORD || "Admin@123";
        const defaultName = process.env.ADMIN_NAME || "Deepak Agarwal (Owner)";

        admin = await Admin.create({
          name: defaultName,
          email: defaultEmail,
          password: defaultPassword,
          role: "admin",
        });

        admin = await Admin.findById(admin._id).select("+password");
      }
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid administrator credentials. Email not registered.",
      });
    }

    // 3. Dynamic password comparison from MongoDB record
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid administrator credentials. Incorrect password.",
      });
    }

    // 4. If password in DB was stored as plaintext, upgrade it to bcrypt
    if (
      admin.password &&
      !admin.password.startsWith("$2a$") &&
      !admin.password.startsWith("$2b$") &&
      !admin.password.startsWith("$2y$")
    ) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
      await admin.save();
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
    console.error("[Admin Login Error]", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/me - Retrieve current authenticated admin profile
export const getAdminMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin account not found in database." });
    }
    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/admin/profile - Update admin profile (name, email) in database
export const updateAdminProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required." });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if new email is taken by another admin
    const existing = await Admin.findOne({ email: cleanEmail, _id: { $ne: req.admin.id } });
    if (existing) {
      return res.status(400).json({ success: false, message: "This email address is already in use by another admin." });
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found." });
    }

    admin.name = name.trim();
    admin.email = cleanEmail;
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Admin profile updated successfully in database.",
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

// PUT /api/admin/change-password - Change admin password dynamically in database
export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide both your current password and a new password.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long.",
      });
    }

    const admin = await Admin.findById(req.admin.id).select("+password");
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found." });
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password does not match database record.",
      });
    }

    // Assign new password; AdminSchema.pre('save') handles bcrypt hashing
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Admin password successfully updated in database.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

