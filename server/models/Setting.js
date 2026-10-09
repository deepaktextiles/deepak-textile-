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
    phone: { type: String, default: "+91 98251 44520" },
    whatsappNumber: { type: String, default: "+91 98251 44520" },
    whatsapp: { type: String, default: "+91 98251 44520" },
    email: { type: String, default: "sales@deepaktextiles.com" },
    address: {
      type: String,
      default: "Plot 104-108, Millenium Textile Market, Ring Road, Surat, Gujarat 395002",
    },
    gstNumber: { type: String, default: "24AAACD1234F1Z8" },
    gstin: { type: String, default: "24AAACD1234F1Z8" },
  },
  { timestamps: true }
);

export const Setting = mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
