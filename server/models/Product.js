import mongoose from "mongoose";

const ProductVariantSchema = new mongoose.Schema(
  {
    size: { type: String, default: "" },
    color: { type: String, default: "" },
    sku: { type: String, default: "" },
    stock: { type: Number, default: 0 },
    wholesalePrice: { type: Number, default: 0 },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    subCategory: { type: String, default: "" },
    images: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
    wholesalePrice: { type: Number, required: true, min: 0 },
    minimumOrderQuantity: { type: Number, required: true, min: 1, default: 10 },
    stock: { type: Number, required: true, default: 100 },
    unit: { type: String, default: "pieces", trim: true },
    fabric: { type: String, required: true, trim: true, index: true },
    color: { type: String, required: true, trim: true, index: true },
    pattern: { type: String, default: "", trim: true },
    size: { type: [String], default: [] },
    variants: { type: [ProductVariantSchema], default: [] },
    tags: { type: [String], default: [], index: true },
    featured: { type: Boolean, default: false, index: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1, active: 1 });
ProductSchema.index({ featured: 1, active: 1 });
ProductSchema.index({ createdAt: -1 });

export const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
