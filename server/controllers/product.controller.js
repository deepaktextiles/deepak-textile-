import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";
import { Setting } from "../models/Setting.js";

const shouldExposeWholesalePrice = async (user) => {
  if (user && (user.role === "admin" || user.role === "staff")) {
    return true;
  }

  const setting = await Setting.findOne();
  const visibility = setting?.wholesalePriceVisibility || "login_required";

  if (visibility === "public") {
    return true;
  }

  if (visibility === "login_required") {
    return !!user;
  }

  if (visibility === "verified_only") {
    return !!user && !!user.isVerified;
  }

  return false;
};

const sanitizeProduct = (doc, allowWholesale) => {
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  if (!allowWholesale) {
    obj.wholesalePrice = null;
    obj.requiresLoginForWholesalePrice = true;
    if (obj.variants && Array.isArray(obj.variants)) {
      obj.variants = obj.variants.map((v) => ({
        ...v,
        wholesalePrice: null,
      }));
    }
  } else {
    obj.requiresLoginForWholesalePrice = false;
  }
  return obj;
};

export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      subCategory,
      fabric,
      color,
      size,
      minPrice,
      maxPrice,
      inStock,
      featured,
      search,
      sort = "newest",
      adminAll,
    } = req.query;

    const query = {};

    if (!adminAll || !req.user || req.user.role === "customer") {
      query.active = true;
    }

    if (category) {
      const catDoc = await Category.findOne({
        $or: [{ _id: category }, { slug: category }],
      });
      if (catDoc) {
        query.category = catDoc._id;
      } else {
        query.category = category;
      }
    }

    if (subCategory) {
      query.subCategory = subCategory;
    }

    if (fabric) {
      const fabrics = Array.isArray(fabric) ? fabric : String(fabric).split(",");
      query.fabric = { $in: fabrics.map((f) => new RegExp(`^${f.trim()}$`, "i")) };
    }

    if (color) {
      const colors = Array.isArray(color) ? color : String(color).split(",");
      query.color = { $in: colors.map((c) => new RegExp(`^${c.trim()}$`, "i")) };
    }

    if (size) {
      const sizes = Array.isArray(size) ? size : String(size).split(",");
      query.size = { $in: sizes.map((s) => s.trim()) };
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
      query.$or = [
        { name: searchRegex },
        { sku: searchRegex },
        { fabric: searchRegex },
        { color: searchRegex },
        { tags: searchRegex },
        { description: searchRegex },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { wholesalePrice: 1 };
    else if (sort === "price_desc") sortOption = { wholesalePrice: -1 };
    else if (sort === "popular") sortOption = { stock: -1 };
    else if (sort === "featured") sortOption = { featured: -1, createdAt: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name slug")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query),
    ]);

    const allowWholesale = await shouldExposeWholesalePrice(req.user);
    const sanitizedProducts = products.map((p) => sanitizeProduct(p, allowWholesale));

    res.status(200).json({
      success: true,
      products: sanitizedProducts,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
      canViewWholesalePrice: allowWholesale,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug }).populate("category", "name slug");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const allowWholesale = await shouldExposeWholesalePrice(req.user);
    const sanitized = sanitizeProduct(product, allowWholesale);

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      active: true,
    })
      .populate("category", "name slug")
      .limit(4);

    const sanitizedRelated = related.map((r) => sanitizeProduct(r, allowWholesale));

    res.status(200).json({
      success: true,
      product: sanitized,
      relatedProducts: sanitizedRelated,
      canViewWholesalePrice: allowWholesale,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductFilters = async (req, res, next) => {
  try {
    const [categories, fabrics, colors, sizes] = await Promise.all([
      Category.find({ active: true }).select("name slug").sort({ sortOrder: 1, name: 1 }),
      Product.distinct("fabric", { active: true }),
      Product.distinct("color", { active: true }),
      Product.distinct("size", { active: true }),
    ]);

    res.status(200).json({
      success: true,
      filters: {
        categories,
        fabrics: fabrics.filter(Boolean),
        colors: colors.filter(Boolean),
        sizes: sizes.filter(Boolean),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const data = req.body;

    if (!data.slug) {
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

    const product = await Product.create(data);
    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
