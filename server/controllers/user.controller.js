import { User } from "../models/User.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const { role, isVerified, search, page = 1, limit = 15 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isVerified !== undefined) query.isVerified = isVerified === "true";

    if (search) {
      const regex = new RegExp(String(search), "i");
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }, { companyName: regex }, { GSTNumber: regex }];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isVerified, isActive, role } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(isVerified !== undefined && { isVerified }),
          ...(isActive !== undefined && { isActive }),
          ...(role && { role }),
        },
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Customer status updated successfully.",
      user,
    });
  } catch (error) {
    next(error);
  }
};
