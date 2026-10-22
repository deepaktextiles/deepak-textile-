import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    business: { type: String, default: "Retail Textile Merchant", trim: true },
    rating: { type: Number, required: true, default: 5, min: 1, max: 5 },
    time: { type: String, default: "Verified Buyer" },
    text: { type: String, required: true, trim: true },
    isLocalGuide: { type: Boolean, default: false },
    avatarBg: { type: String, default: "bg-[#C00000]" },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
