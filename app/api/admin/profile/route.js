import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "../../../../lib/auth.js";
import { Admin } from "../../../../server/models/Admin.js";

export async function PUT(request) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Name and email are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await Admin.findOne({
      email: cleanEmail,
      _id: { $ne: admin._id },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "This email address is already in use by another admin.",
        },
        { status: 400 }
      );
    }

    admin.name = name.trim();
    admin.email = cleanEmail;
    await admin.save();

    return NextResponse.json({
      success: true,
      message: "Admin profile updated successfully.",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
