import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db.js";
import { getAuthenticatedAdmin } from "../../../lib/auth.js";
import { Category } from "../../../server/models/Category.js";
import { Product } from "../../../server/models/Product.js";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive");
    const filter = includeInactive === "true" ? {} : { active: true };

    const categories = await Category.find(filter)
      .populate("parentCategory", "name slug")
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({
          category: cat._id,
          active: true,
        });
        return {
          ...cat,
          productCount,
        };
      })
    );

    return NextResponse.json({
      success: true,
      categories: categoriesWithCount,
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

    const data = await request.json().catch(() => ({}));
    if (!data.slug && data.name) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const existing = await Category.findOne({ slug: data.slug });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "A category with this slug already exists.",
        },
        { status: 409 }
      );
    }

    const category = await Category.create(data);
    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully.",
        category,
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
