import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db.js";
import { getAuthenticatedAdmin } from "../../../lib/auth.js";
import { Banner } from "../../../server/models/Banner.js";

const DEFAULT_BANNERS = [
  {
    title: "Royal Banarasi & Designer Saree Collection",
    subtitle:
      "Pure Katan Silk, Georgette, Organza & Zari Weave Sarees. Direct wholesale rates for retailers & boutique owners across Bihar & India.",
    badge: "Deepak Textiles • Darbhanga",
    image: "/images/selesproductsimages/7ff997fb-c6a3-4333-84d2-907a30cb30f9.avif",
    link: "/products?category=sarees",
    btnText: "Explore Saree Lots",
    order: 1,
    active: true,
    type: "hero",
  },
  {
    title: "Designer Dress Materials & Unstitched Suits",
    subtitle:
      "Pure Cambric Cotton, Chanderi Silk & Rayon 3-Piece Sets with matching Dupattas. High margin wholesale lots.",
    badge: "Wholesale Suit Pieces",
    image: "/images/selesproductsimages/a3198247-d1d7-47e6-a99b-1e0d14f3ec33.avif",
    link: "/products?category=dress-materials",
    btnText: "View Suit Pieces",
    order: 2,
    active: true,
    type: "hero",
  },
  {
    title: "Heavy Zari & Bridal Saree Collection",
    subtitle:
      "Handpicked bridal and festive collections ready for dispatch. Fast delivery across North Bihar & Pan-India.",
    badge: "Festive & Wedding Special",
    image: "/images/selesproductsimages/869f376e-f235-4b78-824d-6899c1588dd3.avif",
    link: "/products?category=sarees",
    btnText: "View Bridal Lots",
    order: 3,
    active: true,
    type: "hero",
  },
  {
    title: "Shirting & Suiting, Kurtis, Lehenga & Readymade",
    subtitle:
      "High-demand men's fabrics, partywear kurtis & festive lehengas. Serving 1,000+ retail stores since 2001.",
    badge: "Ready Wholesale Stock",
    image: "/images/selesproductsimages/4add71ea-fd79-47b5-8f73-75dd4f6829cd.avif",
    link: "/products",
    btnText: "Browse Full Catalog",
    order: 4,
    active: true,
    type: "hero",
  },
];

const DEFAULT_TRENDING_BANNERS = [
  {
    title: "Royal Banarasi Silk Saree",
    subtitle: "Direct wholesale rates from Surat mills",
    badge: "Trending Wholesale",
    image: "/images/selesproductsimages/7ff997fb-c6a3-4333-84d2-907a30cb30f9.avif",
    link: "/products?category=wholesale-sarees",
    btnText: "Shop Sarees",
    order: 1,
    active: true,
    type: "trending",
  },
  {
    title: "Designer Cotton & Chanderi Suit Piece",
    subtitle: "High margin 3-piece unstitched lots",
    badge: "Fast Dispatch",
    image: "/images/selesproductsimages/a3198247-d1d7-47e6-a99b-1e0d14f3ec33.avif",
    link: "/products?category=dress-materials",
    btnText: "View Suits",
    order: 2,
    active: true,
    type: "trending",
  },
  {
    title: "Rayon Kurti & Pant Sets",
    subtitle: "Ready sets for retail boutiques",
    badge: "Boutique Choice",
    image: "/images/selesproductsimages/4add71ea-fd79-47b5-8f73-75dd4f6829cd.avif",
    link: "/products?category=kurti-sets",
    btnText: "Explore Sets",
    order: 3,
    active: true,
    type: "trending",
  },
  {
    title: "Heavy Organza Festive Collection",
    subtitle: "Zari embroidery wedding special",
    badge: "Festive Exclusive",
    image: "/images/selesproductsimages/7bc3e582-f0d0-4032-8993-7e3d7b22cfa9.avif",
    link: "/products?category=lehenga-choli",
    btnText: "View Festive",
    order: 4,
    active: true,
    type: "trending",
  },
];

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const activeOnly = searchParams.get("activeOnly");

    const filter = {};
    if (type) filter.type = type;
    if (activeOnly === "true") filter.active = true;

    let banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });

    if ((!banners || banners.length === 0) && (!type || type === "hero")) {
      await Banner.insertMany(DEFAULT_BANNERS);
      banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });
    }

    if ((!banners || banners.length === 0) && type === "trending") {
      await Banner.insertMany(DEFAULT_TRENDING_BANNERS);
      banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });
    }

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
