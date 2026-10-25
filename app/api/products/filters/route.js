import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db.js";
import { Category } from "../../../../server/models/Category.js";
import { Product } from "../../../../server/models/Product.js";

export async function GET() {
  try {
    await connectDB();
    const [categories, fabrics, colors, sizes] = await Promise.all([
      Category.find({ active: true })
        .select("name slug")
        .sort({ sortOrder: 1, name: 1 }),
      Product.distinct("fabric", { active: true }),
      Product.distinct("color", { active: true }),
      Product.distinct("size", { active: true }),
    ]);

    return NextResponse.json({
      success: true,
      filters: {
        categories,
        fabrics: fabrics.filter(Boolean),
        colors: colors.filter(Boolean),
        sizes: sizes.filter(Boolean),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
