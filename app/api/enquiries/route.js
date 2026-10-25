import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db.js";
import { getAuthenticatedAdmin } from "../../../lib/auth.js";
import { Enquiry } from "../../../server/models/Enquiry.js";
import "../../../server/models/Product.js";
import "../../../server/models/User.js";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json().catch(() => ({}));
    const { name, phone, email, companyName, product, quantity, message } = body;

    if (!name || !phone || !email || !companyName) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all required contact details.",
        },
        { status: 400 }
      );
    }

    const enquiry = await Enquiry.create({
      name,
      phone,
      email: email.toLowerCase(),
      companyName,
      product: product || null,
      quantity: Number(quantity) || 1,
      message: message || "",
      status: "new",
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Your wholesale quote request has been received. Our sales desk will contact you within 24 hours.",
        enquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.max(1, Number(searchParams.get("limit") || 15));
    const skip = (page - 1) * limit;

    const query = {};
    if (status) query.status = status;
    if (search) {
      const regex = new RegExp(String(search), "i");
      query.$or = [
        { name: regex },
        { companyName: regex },
        { email: regex },
        { phone: regex },
      ];
    }

    const [enquiries, total] = await Promise.all([
      Enquiry.find(query)
        .populate("product", "name sku images wholesalePrice")
        .populate("customer", "name email phone companyName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Enquiry.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      enquiries,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
