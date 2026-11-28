import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db.js";
import { getAuthenticatedAdmin } from "../../../lib/auth.js";
import { Category } from "../../../server/models/Category.js";
import { Product } from "../../../server/models/Product.js";

const defaultSeedCategories = [
  {
    name: "Wholesale Sarees",
    slug: "wholesale-sarees",
    description: "Banarasi, Katan, Tussar, Georgette & Bridal Zari Saree lots from Surat mills",
    image: "/images/selesproductsimages/c99af3a8-4de0-4934-9bd3-6412c605d0ac.avif",
    sortOrder: 1,
    active: true,
  },
  {
    name: "Dress Materials & Suits",
    slug: "dress-materials",
    description: "Cambric Cotton, Chanderi Silk & Party Wear Salwar Suit sets",
    image: "/images/selesproductsimages/869f376e-f235-4b78-824d-6899c1588dd3.avif",
    sortOrder: 2,
    active: true,
  },
  {
    name: "Kurtis & Ethnic Sets",
    slug: "kurti-sets",
    description: "Kurti Pant sets, Anarkali Gowns, Casual and Festive wholesale lots",
    image: "/images/selesproductsimages/1980c85d-cd71-4c64-9f1e-f545a1601d80.avif",
    sortOrder: 3,
    active: true,
  },
  {
    name: "Running Fabrics (Thaan)",
    slug: "fabrics-running-material",
    description: "100% Pure Cambric Cotton, Rayon rolls, Suiting Shirting thaan",
    image: "/images/selesproductsimages/7bc3e582-f0d0-4032-8993-7e3d7b22cfa9.avif",
    sortOrder: 4,
    active: true,
  },
  {
    name: "Ladies Wear",
    slug: "ladies-wear",
    description: "Wholesale Designer Sarees, Salwar Suits, Kurtis, Lehenga Choli & Readymade lots",
    image: "/images/selesproductsimages/a3198247-d1d7-47e6-a99b-1e0d14f3ec33.avif",
    sortOrder: 5,
    active: true,
  },
  {
    name: "Men's Wear",
    slug: "mens-wear",
    description: "Kurta Pajama, Sherwani, Jodhpuri Suit, Jackets & Shirting Suiting materials",
    image: "/images/selesproductsimages/4add71ea-fd79-47b5-8f73-75dd4f6829cd.avif",
    sortOrder: 6,
    active: true,
  },
];

const defaultSeedSubCategories = [
  // Wholesale Sarees
  { name: "Royal Banarasi Silk Sarees", slug: "banarasi-silk-sarees", parentSlug: "wholesale-sarees", sortOrder: 1 },
  { name: "Katan & Tussar Silk Lots", slug: "katan-tussar-silk-sarees", parentSlug: "wholesale-sarees", sortOrder: 2 },
  { name: "Georgette & Organza Sarees", slug: "georgette-organza-sarees", parentSlug: "wholesale-sarees", sortOrder: 3 },
  { name: "Bandhani & Traditional Patola", slug: "bandhani-patola-sarees", parentSlug: "wholesale-sarees", sortOrder: 4 },
  { name: "Cotton & Daily Wear Sarees", slug: "cotton-daily-wear-sarees", parentSlug: "wholesale-sarees", sortOrder: 5 },
  { name: "Bridal Heavy Zari Sarees", slug: "bridal-heavy-zari-sarees", parentSlug: "wholesale-sarees", sortOrder: 6 },

  // Dress Materials & Suits
  { name: "Cambric Cotton 3-Piece Sets", slug: "cambric-cotton-suits", parentSlug: "dress-materials", sortOrder: 1 },
  { name: "Chanderi Silk Unstitched Suits", slug: "chanderi-silk-suits", parentSlug: "dress-materials", sortOrder: 2 },
  { name: "Party Wear Heavy Dupatta Sets", slug: "party-wear-dupatta-sets", parentSlug: "dress-materials", sortOrder: 3 },
  { name: "Rayon & Printed Salwar Suits", slug: "rayon-printed-salwar-suits", parentSlug: "dress-materials", sortOrder: 4 },
  { name: "Jaipuri & Bandhej Dress Lots", slug: "jaipuri-bandhej-dress-lots", parentSlug: "dress-materials", sortOrder: 5 },
  { name: "Semi-Stitched Punjabi Suits", slug: "semi-stitched-punjabi-suits", parentSlug: "dress-materials", sortOrder: 6 },

  // Kurtis & Ethnic Sets
  { name: "Kurti + Pant + Dupatta 3-Piece", slug: "kurti-pant-dupatta-sets", parentSlug: "kurti-sets", sortOrder: 1 },
  { name: "Anarkali Gowns & Festive Kurtis", slug: "anarkali-gowns-festive-kurtis", parentSlug: "kurti-sets", sortOrder: 2 },
  { name: "Straight Cut Daily Wear Kurtis", slug: "straight-cut-daily-kurtis", parentSlug: "kurti-sets", sortOrder: 3 },
  { name: "Bridal & Semi-Stitched Lehengas", slug: "bridal-semi-stitched-lehengas", parentSlug: "kurti-sets", sortOrder: 4 },
  { name: "Rayon & Slub Casual Kurtis", slug: "rayon-slub-casual-kurtis", parentSlug: "kurti-sets", sortOrder: 5 },
  { name: "Crop Top & Skirt Festive Lots", slug: "crop-top-skirt-lots", parentSlug: "kurti-sets", sortOrder: 6 },

  // Running Fabrics (Thaan)
  { name: "100% Pure Cambric Cotton Thaan", slug: "pure-cambric-cotton-thaan", parentSlug: "fabrics-running-material", sortOrder: 1 },
  { name: "Rayon 14Kg / 16Kg Fabric Rolls", slug: "rayon-fabric-rolls-thaan", parentSlug: "fabrics-running-material", sortOrder: 2 },
  { name: "Georgette & Viscose Fabric", slug: "georgette-viscose-fabric-thaan", parentSlug: "fabrics-running-material", sortOrder: 3 },
  { name: "Suiting & Shirting Thaan Lots", slug: "suiting-shirting-thaan-lots", parentSlug: "fabrics-running-material", sortOrder: 4 },
  { name: "Chiffon & Organza Dupatta Rolls", slug: "chiffon-organza-dupatta-rolls", parentSlug: "fabrics-running-material", sortOrder: 5 },
  { name: "Dyeable Pure Fabric Materials", slug: "dyeable-pure-fabric-materials", parentSlug: "fabrics-running-material", sortOrder: 6 },

  // Ladies Wear
  { name: "Designer Sarees Collection", slug: "ladies-designer-sarees", parentSlug: "ladies-wear", sortOrder: 1 },
  { name: "Salwar Suits & Dress Sets", slug: "ladies-salwar-suits-sets", parentSlug: "ladies-wear", sortOrder: 2 },
  { name: "Kurtis & Ethnic Wear", slug: "ladies-kurtis-ethnic-wear", parentSlug: "ladies-wear", sortOrder: 3 },
  { name: "Lehenga Choli & Gowns", slug: "ladies-lehenga-choli-gowns", parentSlug: "ladies-wear", sortOrder: 4 },
  { name: "Dupattas & Bottom Wear", slug: "ladies-dupattas-bottom-wear", parentSlug: "ladies-wear", sortOrder: 5 },
  { name: "Readymade Ladies Garments", slug: "ladies-readymade-garments", parentSlug: "ladies-wear", sortOrder: 6 },

  // Men's Wear
  { name: "Kurta Pajama Wholesale Sets", slug: "mens-kurta-pajama-sets", parentSlug: "mens-wear", sortOrder: 1 },
  { name: "Sherwani & Indo-Western Lots", slug: "mens-sherwani-indo-western", parentSlug: "mens-wear", sortOrder: 2 },
  { name: "Jodhpuri & Modi Jackets", slug: "mens-jodhpuri-modi-jackets", parentSlug: "mens-wear", sortOrder: 3 },
  { name: "Premium Suiting Fabric Lots", slug: "mens-suiting-fabric-lots", parentSlug: "mens-wear", sortOrder: 4 },
  { name: "Pure Cotton Shirting Thaan", slug: "mens-cotton-shirting-thaan", parentSlug: "mens-wear", sortOrder: 5 },
  { name: "Readymade Men's Ethnic Wear", slug: "mens-ethnic-wear-lots", parentSlug: "mens-wear", sortOrder: 6 },
];

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive");
    const filter = includeInactive === "true" ? {} : { active: true };

    // 1. Ensure all 6 core main categories exist in MongoDB
    const parentMap = {};
    for (const seed of defaultSeedCategories) {
      let doc = await Category.findOne({
        $or: [
          { slug: seed.slug },
          { name: new RegExp(`^${seed.name.replace(/['']/g, ".*")}$`, "i") },
        ],
      }).catch(() => null);

      if (!doc) {
        doc = await Category.create({ ...seed, parentCategory: null }).catch(() => null);
      }
      if (doc) {
        parentMap[seed.slug] = doc._id;
      }
    }

    // 2. Ensure default subcategories exist if missing
    for (const sub of defaultSeedSubCategories) {
      const parentId = parentMap[sub.parentSlug];
      if (!parentId) continue;

      const subExists = await Category.findOne({ slug: sub.slug }).catch(() => null);
      if (!subExists) {
        await Category.create({
          name: sub.name,
          slug: sub.slug,
          parentCategory: parentId,
          sortOrder: sub.sortOrder,
          active: true,
        }).catch(() => null);
      }
    }

    const categories = await Category.find(filter)
      .populate("parentCategory", "name slug")
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({
          $or: [{ category: cat._id }, { categories: cat._id }],
          active: true,
        }).catch(() => 0);
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

    // Clean parentCategory if empty string
    if (!data.parentCategory || data.parentCategory === "" || data.parentCategory === "none") {
      data.parentCategory = null;
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
