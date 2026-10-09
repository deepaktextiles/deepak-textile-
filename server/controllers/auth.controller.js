import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || "deepak_textiles_super_secret_jwt_key_2026";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, companyName, businessType, GSTNumber, address, city, state, pincode } =
      req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email address already exists.",
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      companyName,
      businessType: businessType || "Retailer",
      GSTNumber: GSTNumber || "",
      address: address || "",
      city: city || "",
      state: state || "",
      pincode: pincode || "",
      role: "customer",
      isVerified: false,
      isActive: true,
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Wholesale account created successfully. Welcome to Deepak Textiles!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        companyName: user.companyName,
        businessType: user.businessType,
        GSTNumber: user.GSTNumber,
        role: user.role,
        isVerified: user.isVerified,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please reach out to customer care.",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Sign in successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        companyName: user.companyName,
        businessType: user.businessType,
        GSTNumber: user.GSTNumber,
        role: user.role,
        isVerified: user.isVerified,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const { name, phone, companyName, businessType, GSTNumber, address, city, state, pincode } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          ...(name && { name }),
          ...(phone && { phone }),
          ...(companyName && { companyName }),
          ...(businessType && { businessType }),
          ...(GSTNumber !== undefined && { GSTNumber }),
          ...(address !== undefined && { address }),
          ...(city !== undefined && { city }),
          ...(state !== undefined && { state }),
          ...(pincode !== undefined && { pincode }),
        },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};
