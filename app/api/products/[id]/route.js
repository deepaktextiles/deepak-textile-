import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../lib/db.js";
import { getAuthenticatedAdmin } from "../../../../lib/auth.js";
import { Product } from "../../../../server/models/Product.js";
import { Category } from "../../../../server/models/Category.js";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };

    const product = await Product.findOne(query)
      .populate("category", "name slug")
      .populate({ path: "categories", select: "name slug", strictPopulate: false });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const catIds = [
      ...(Array.isArray(product.categories)
        ? product.categories.map((c) => c?._id || c)
        : []),
      product.category?._id || product.category,
    ].filter(Boolean);

    const related = await Product.find({
      $or: [{ category: { $in: catIds } }, { categories: { $in: catIds } }],
      _id: { $ne: product._id },
      active: true,
    })
      .populate("category", "name slug")
      .populate({ path: "categories", select: "name slug", strictPopulate: false })
      .limit(4);

    return NextResponse.json({
      success: true,
      product,
      relatedProducts: related,
      canViewWholesalePrice: true,
    });
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
    const body = await request.json().catch(() => ({}));

    if (Array.isArray(body.categories)) {
      const categoryList = [...new Set(body.categories.map(String).filter(Boolean))];
      body.categories = categoryList;
      if (categoryList.length > 0) {
        body.category = categoryList[0];
      }
    } else if (body.category) {
      body.categories = [String(body.category)];
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
      product,
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
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
