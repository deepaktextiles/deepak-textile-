import { Banner } from "../models/Banner.js";

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

export const getAllBanners = async (req, res) => {
  try {
    const { type, activeOnly } = req.query;
    const filter = {};
    if (type) {
      filter.type = type;
    }
    if (activeOnly === "true") {
      filter.active = true;
    }

    let banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });

    // Auto-seed defaults if database has no banners for this type yet
    if ((!banners || banners.length === 0) && (!type || type === "hero")) {
      await Banner.insertMany(DEFAULT_BANNERS);
      banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });
    }

    if ((!banners || banners.length === 0) && type === "trending") {
      await Banner.insertMany(DEFAULT_TRENDING_BANNERS);
      banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });
    }

    res.status(200).json({ success: true, count: banners.length, banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }
    res.status(200).json({ success: true, banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBanner = async (req, res) => {
  try {
    const { title, subtitle, badge, image, link, btnText, order, active, type = "hero" } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Banner image is required.",
      });
    }

    const banner = await Banner.create({
      title: title ? title.trim() : "",
      subtitle: subtitle ? subtitle.trim() : "",
      badge: badge ? badge.trim() : "",
      image: image.trim(),
      link: link ? link.trim() : "/products",
      btnText: btnText ? btnText.trim() : "",
      order: Number(order) || 0,
      active: active !== undefined ? Boolean(active) : true,
      type: type === "trending" ? "trending" : "hero",
    });

    res.status(201).json({
      success: true,
      message: `${type === "trending" ? "Trending" : "Hero"} Banner created successfully.`,
      banner,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    const { title, subtitle, badge, image, link, btnText, order, active, type } = req.body;

    if (title !== undefined) banner.title = title.trim();
    if (subtitle !== undefined) banner.subtitle = subtitle.trim();
    if (badge !== undefined) banner.badge = badge.trim();
    if (image !== undefined) banner.image = image.trim();
    if (link !== undefined) banner.link = link.trim();
    if (btnText !== undefined) banner.btnText = btnText.trim();
    if (order !== undefined) banner.order = Number(order);
    if (active !== undefined) banner.active = Boolean(active);
    if (type !== undefined) banner.type = type;

    await banner.save();

    res.status(200).json({
      success: true,
      message: "Banner updated successfully.",
      banner,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
