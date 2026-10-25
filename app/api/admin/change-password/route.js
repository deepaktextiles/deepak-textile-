import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "../../../../lib/auth.js";
import { Admin } from "../../../../server/models/Admin.js";

export async function PUT(request) {
  try {
    const authAdmin = await getAuthenticatedAdmin(request);
    if (!authAdmin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide both your current password and a new password.",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "New password must be at least 6 characters long.",
        },
        { status: 400 }
      );
    }

    const admin = await Admin.findById(authAdmin._id).select("+password");
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found." },
        { status: 404 }
      );
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password does not match database record.",
        },
        { status: 400 }
      );
    }

    admin.password = newPassword;
    await admin.save();

    return NextResponse.json({
      success: true,
      message: "Admin password successfully updated in database.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
