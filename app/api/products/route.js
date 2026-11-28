import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../lib/db.js";
import { getAuthenticatedAdmin } from "../../../lib/auth.js";
import { Product } from "../../../server/models/Product.js";
import { Category } from "../../../server/models/Category.js";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.max(1, Number(searchParams.get("limit") || 12));
    const category = searchParams.get("category");
    const subCategory = searchParams.get("subCategory");
    const fabric = searchParams.get("fabric");
    const color = searchParams.get("color");
    const size = searchParams.get("size");
    const pattern = searchParams.get("pattern");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const inStock = searchParams.get("inStock");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    const adminAll = searchParams.get("adminAll");

    const query = {};
    if (!adminAll) {
      query.active = true;
    }

    if (category) {
      const isObjectId = mongoose.Types.ObjectId.isValid(category);
      let catDoc = null;

      if (isObjectId) {
        catDoc = await Category.findOne({
          $or: [{ _id: category }, { slug: category }],
        }).catch(() => null);
      } else {
        let cleanSlug = String(category).trim().toLowerCase();
        // Common alias mapping to ensure legacy and variant queries resolve
        const slugAliases = {
          "kurta-sets": "kurti-sets",
          "kurtas": "kurti-sets",
          "kurtis": "kurti-sets",
          "sarees": "wholesale-sarees",
          "saree": "wholesale-sarees",
          "fabrics": "fabrics-running-material",
          "fabric": "fabrics-running-material",
          "thaan": "fabrics-running-material",
          "suits": "dress-materials",
          "dress-material": "dress-materials",
          "mans-were": "mens-wear",
          "mans-wear": "mens-wear",
          "mens": "mens-wear",
        };
        if (slugAliases[cleanSlug]) {
          cleanSlug = slugAliases[cleanSlug];
        }
        const cleanName = cleanSlug.replace(/[-_]/g, " ");
        catDoc = await Category.findOne({
          $or: [
            { slug: cleanSlug },
            { slug: category.trim() },
            { name: new RegExp(`^${cleanName}$`, "i") },
            { name: new RegExp(`^${category.trim()}$`, "i") },
          ],
        }).catch(() => null);
      }

      if (catDoc) {
        // Also check if this category has child categories
        const childCats = await Category.find({ parentCategory: catDoc._id })
          .select("_id")
          .catch(() => []);
        const targetIds =
          childCats && childCats.length > 0
            ? [catDoc._id, ...childCats.map((c) => c._id)]
            : [catDoc._id];
        query.$and = query.$and || [];
        query.$and.push({
          $or: [
            { category: { $in: targetIds } },
            { categories: { $in: targetIds } },
          ],
        });
      } else if (isObjectId) {
        query.$and = query.$and || [];
        query.$and.push({
          $or: [{ category: category }, { categories: category }],
        });
      } else {
        // No Category document found matching this slug or name.
        // Check if products have this slug in their subCategory field
        const subCatRegex = new RegExp(String(category).replace(/[-_]/g, " ").trim(), "i");
        const hasSubCat = await Product.exists({ subCategory: subCatRegex }).catch(() => null);
        if (hasSubCat) {
          query.subCategory = subCatRegex;
        } else {
          // No matching category or subcategory exists — safely query a non-existent ObjectId
          // so it returns 0 products without throwing a Mongoose CastError on ObjectId!
          query.category = new mongoose.Types.ObjectId();
        }
      }
    }

    if (subCategory) {
      query.subCategory = subCategory;
    }

    if (fabric) {
      const fabrics = fabric.split(",");
      query.fabric = {
        $in: fabrics.map((f) => new RegExp(`^${f.trim()}$`, "i")),
      };
    }

    if (color) {
      const colors = color.split(",");
      query.color = {
        $in: colors.map((c) => new RegExp(`^${c.trim()}$`, "i")),
      };
    }

    if (size) {
      const sizes = size.split(",");
      query.size = { $in: sizes.map((s) => s.trim()) };
    }

    if (pattern) {
      const patterns = pattern.split(",");
      query.pattern = {
        $in: patterns.map((p) => new RegExp(`^${p.trim()}$`, "i")),
      };
    }

    if (inStock === "true") {
      query.stock = { $gt: 0 };
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (minPrice || maxPrice) {
      query.wholesalePrice = {};
      if (minPrice) query.wholesalePrice.$gte = Number(minPrice);
      if (maxPrice) query.wholesalePrice.$lte = Number(maxPrice);
    }

    if (search) {
      const searchRegex = new RegExp(String(search).trim(), "i");
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { name: searchRegex },
          { sku: searchRegex },
          { fabric: searchRegex },
          { color: searchRegex },
          { tags: searchRegex },
          { description: searchRegex },
        ],
      });
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { wholesalePrice: 1 };
    else if (sort === "price_desc") sortOption = { wholesalePrice: -1 };
    else if (sort === "popular") sortOption = { stock: -1 };
    else if (sort === "featured") sortOption = { featured: -1, createdAt: -1 };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name slug")
        .populate({ path: "categories", select: "name slug", strictPopulate: false })
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      canViewWholesalePrice: true,
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

    let uniqueSlug = data.slug;
    let counter = 1;
    while (await Product.exists({ slug: uniqueSlug })) {
      uniqueSlug = `${data.slug}-${counter++}`;
    }
    data.slug = uniqueSlug;

    const categoryList = Array.isArray(data.categories)
      ? [...new Set(data.categories.map(String).filter(Boolean))]
      : [];
    if (categoryList.length > 0) {
      data.categories = categoryList;
      data.category = data.category || categoryList[0];
    } else if (data.category) {
      data.categories = [String(data.category)];
    }

    const product = await Product.create(data);
    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully.",
        product,
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
