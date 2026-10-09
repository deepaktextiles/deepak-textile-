import { Enquiry } from "../models/Enquiry.js";

export const createEnquiry = async (req, res, next) => {
  try {
    const { name, phone, email, companyName, product, quantity, message } = req.body;

    const enquiry = await Enquiry.create({
      customer: req.user ? req.user._id : null,
      name,
      phone,
      email: email.toLowerCase(),
      companyName,
      product: product || null,
      quantity,
      message: message || "",
      status: "new",
    });

    res.status(201).json({
      success: true,
      message: "Your wholesale quote request has been received. Our sales desk will contact you within 24 hours.",
      enquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const getEnquiries = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 15 } = req.query;

    const query = {};

    if (req.user && req.user.role === "customer") {
      query.$or = [{ customer: req.user._id }, { email: req.user.email.toLowerCase() }];
    } else {
      if (status) query.status = status;
      if (search) {
        const regex = new RegExp(String(search), "i");
        query.$or = [{ name: regex }, { companyName: regex }, { email: regex }, { phone: regex }];
      }
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [enquiries, total] = await Promise.all([
      Enquiry.find(query)
        .populate("product", "name sku images wholesalePrice")
        .populate("customer", "name email phone companyName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Enquiry.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      enquiries,
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

export const getEnquiryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const enquiry = await Enquiry.findById(id)
      .populate("product", "name sku images wholesalePrice minimumOrderQuantity fabric")
      .populate("customer", "name email phone companyName GSTNumber");

    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }

    if (
      req.user &&
      req.user.role === "customer" &&
      String(enquiry.customer) !== String(req.user._id) &&
      enquiry.email.toLowerCase() !== req.user.email.toLowerCase()
    ) {
      return res.status(403).json({ success: false, message: "Unauthorized access to enquiry" });
    }

    res.status(200).json({
      success: true,
      enquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, internalNotes } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(status && { status }),
          ...(internalNotes !== undefined && { internalNotes }),
        },
      },
      { new: true }
    )
      .populate("product", "name sku")
      .populate("customer", "name email companyName");

    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry status updated successfully.",
      enquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;

    const enquiry = await Enquiry.findByIdAndDelete(id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry removed successfully.",
    });
  } catch (error) {
    next(error);
  }
};
