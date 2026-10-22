import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    badge: { type: String, default: "Deepak Textiles • Darbhanga" },
    image: { type: String, required: true },
    link: { type: String, default: "/products" },
    btnText: { type: String, default: "Explore Wholesale Lots" },
    accent: { type: String, default: "from-amber-950/90 via-navy-950/80 to-navy-950/60" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    type: { type: String, enum: ["hero", "trending"], default: "hero", index: true },
  },
  { timestamps: true }
);

export const Banner = mongoose.models.Banner || mongoose.model("Banner", BannerSchema);
