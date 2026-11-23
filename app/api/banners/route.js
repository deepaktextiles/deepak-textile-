import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db.js";
import { getAuthenticatedAdmin } from "../../../lib/auth.js";
import { Banner } from "../../../server/models/Banner.js";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const activeOnly = searchParams.get("activeOnly");

    const filter = {};
    if (type) filter.type = type;
    if (activeOnly === "true") filter.active = true;

    const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: banners.length,
      banners,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
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
      type = "hero",
    } = body;

    if (!image) {
      return NextResponse.json(
        { success: false, message: "Banner desktop image is required." },
        { status: 400 }
      );
    }

    const banner = await Banner.create({
      title: title ? title.trim() : "",
      subtitle: subtitle ? subtitle.trim() : "",
      badge: badge ? badge.trim() : "",
      image: image.trim(),
      mobileImage: mobileImage ? mobileImage.trim() : "",
      link: link ? link.trim() : "/products",
      btnText: btnText ? btnText.trim() : "",
      order: Number(order) || 0,
      active: active !== undefined ? Boolean(active) : true,
      type: type === "trending" ? "trending" : "hero",
    });

    return NextResponse.json(
      {
        success: true,
        message: `${
          type === "trending" ? "Trending" : "Hero"
        } Banner created successfully.`,
        banner,
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
