import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db.js";
import { Category } from "../../../../server/models/Category.js";
import { Product } from "../../../../server/models/Product.js";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "Free Size"];

export async function GET() {
  try {
    await connectDB();

    const [categories, sizeAgg, fabricAgg, colorAgg, patternAgg, priceAgg] =
      await Promise.all([
        Category.find({ active: true })
          .select("name slug")
          .sort({ sortOrder: 1, name: 1 })
          .lean(),
        Product.aggregate([
          { $match: { active: true } },
          { $unwind: "$size" },
          { $match: { size: { $nin: [null, ""] } } },
          { $group: { _id: "$size", count: { $sum: 1 } } },
        ]),
        Product.aggregate([
          { $match: { active: true, fabric: { $nin: [null, ""] } } },
          { $group: { _id: "$fabric", count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } },
        ]),
        Product.aggregate([
          { $match: { active: true, color: { $nin: [null, ""] } } },
          { $group: { _id: "$color", count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } },
        ]),
        Product.aggregate([
          { $match: { active: true, pattern: { $nin: [null, ""] } } },
          { $group: { _id: "$pattern", count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } },
        ]),
        Product.aggregate([
          { $match: { active: true } },
          {
            $facet: {
              all: [{ $count: "count" }],
              under500: [
                { $match: { wholesalePrice: { $lt: 500 } } },
                { $count: "count" },
              ],
              from500to1000: [
                { $match: { wholesalePrice: { $gte: 500, $lte: 1000 } } },
                { $count: "count" },
              ],
              from1000to2500: [
                { $match: { wholesalePrice: { $gt: 1000, $lte: 2500 } } },
                { $count: "count" },
              ],
              above2500: [
                { $match: { wholesalePrice: { $gt: 2500 } } },
                { $count: "count" },
              ],
            },
          },
        ]),
      ]);

    const sizes = sizeAgg
      .map((s) => ({ label: String(s._id).trim(), count: s.count }))
      .filter((s) => s.label)
      .sort((a, b) => {
        const idxA = SIZE_ORDER.indexOf(a.label);
        const idxB = SIZE_ORDER.indexOf(b.label);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.label.localeCompare(b.label);
      });

    const fabrics = fabricAgg
      .map((f) => ({ label: String(f._id).trim(), count: f.count }))
      .filter((f) => f.label);

    const colors = colorAgg
      .map((c) => ({ label: String(c._id).trim(), count: c.count }))
      .filter((c) => c.label);

    const patterns = patternAgg
      .map((p) => ({ label: String(p._id).trim(), count: p.count }))
      .filter((p) => p.label);

    const pFacet = priceAgg?.[0] || {};
    const priceCounts = {
      all: pFacet.all?.[0]?.count || 0,
      "under-500": pFacet.under500?.[0]?.count || 0,
      "500-1000": pFacet.from500to1000?.[0]?.count || 0,
      "1000-2500": pFacet.from1000to2500?.[0]?.count || 0,
      "above-2500": pFacet.above2500?.[0]?.count || 0,
    };

    return NextResponse.json({
      success: true,
      filters: {
        categories,
        fabrics,
        colors,
        sizes,
        patterns,
        priceCounts,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
