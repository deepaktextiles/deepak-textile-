import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "../../../../../lib/auth.js";
import { Enquiry } from "../../../../../server/models/Enquiry.js";

export async function PUT(request, { params }) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { status, internalNotes } = body;

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
      return NextResponse.json(
        { success: false, message: "Enquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry status updated successfully.",
      enquiry,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
