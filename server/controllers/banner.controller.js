import { Banner } from "../models/Banner.js";

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

    const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });

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
    const { title, subtitle, badge, image, mobileImage, link, btnText, order, active, type = "hero" } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Banner desktop image is required.",
      });
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

    const { title, subtitle, badge, image, mobileImage, link, btnText, order, active, type } = req.body;

    if (title !== undefined) banner.title = title.trim();
    if (subtitle !== undefined) banner.subtitle = subtitle.trim();
    if (badge !== undefined) banner.badge = badge.trim();
    if (image !== undefined) banner.image = image.trim();
    if (mobileImage !== undefined) banner.mobileImage = mobileImage.trim();
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
