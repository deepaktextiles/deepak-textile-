import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: "Deepak Textiles" },
    tagline: { type: String, default: "Premium Textiles. Trusted Wholesale Supply." },
    bannerTitle: { type: String, default: "Premium Textiles. Trusted Wholesale Supply." },
    bannerSubtitle: {
      type: String,
      default:
        "Quality fabrics and fashion collections for retailers, resellers and bulk buyers across India.",
    },
    bannerImage: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=80",
    },
    phone: { type: String, default: "+91 93080 66552" },
    whatsappNumber: { type: String, default: "+91 93080 66552" },
    whatsapp: { type: String, default: "+91 93080 66552" },
    email: { type: String, default: "deepaktextiles7@gmail.com" },
    address: {
      type: String,
      default: "5V7R+V63, Kadirabad Road, Near Naka No. 2, Banglagarh Colony, Mansaar Colony, Darbhanga, Bihar – 846004",
    },
    gstNumber: { type: String, default: "24AAACD1234F1Z8" },
    gstin: { type: String, default: "24AAACD1234F1Z8" },
  },
  { timestamps: true }
);

export const Setting = mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
