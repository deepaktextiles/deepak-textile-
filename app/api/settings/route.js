import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db.js";
import { getAuthenticatedAdmin } from "../../../lib/auth.js";
import { Setting } from "../../../server/models/Setting.js";

export async function GET() {
  try {
    await connectDB();
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

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
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(body);
    } else {
      settings = await Setting.findOneAndUpdate(
        {},
        { $set: body },
        { new: true }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Banner & business details updated successfully.",
      settings,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
