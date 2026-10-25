import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db.js";
import { getAuthenticatedAdmin } from "../../../../lib/auth.js";
import { Banner } from "../../../../server/models/Banner.js";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, banner });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

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
    const banner = await Banner.findById(id);
    if (!banner) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const {
      title,
      subtitle,
      badge,
      image,
      mobileImage,
      link,
      btnText,
      order,
      active,
      type,
    } = body;

    if (title !== undefined) banner.title = title.trim();
    if (subtitle !== undefined) banner.subtitle = subtitle.trim();
    if (badge !== undefined) banner.badge = badge.trim();
    if (image !== undefined) banner.image = image.trim();
    if (mobileImage !== undefined) banner.mobileImage = mobileImage.trim();
    if (link !== undefined) banner.link = link.trim();
    if (btnText !== undefined) banner.btnText = btnText.trim();
    if (order !== undefined) banner.order = Number(order);
    if (active !== undefined) banner.active = Boolean(active);
    if (type !== undefined) banner.type = type;

    await banner.save();

    return NextResponse.json({
      success: true,
      message: "Banner updated successfully.",
      banner,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Banner deleted successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
