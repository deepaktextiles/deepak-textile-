import { Admin } from "../models/Admin.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { Enquiry } from "../models/Enquiry.js";
import { Setting } from "../models/Setting.js";
import { connectDB } from "../config/db.js";

export const seedDatabase = async () => {
  console.log("[Seed] Checking database records...");

  const adminCount = await Admin.countDocuments();
  if (adminCount > 0) {
    console.log("[Seed] Admin and catalog already seeded. Skipping.");
    return;
  }

  console.log("[Seed] Initializing Deepak Textiles wholesale catalog...");

  // 1. Admin
  await Admin.create({
    name: "Deepak Agarwal (Owner)",
    email: "admin@deepaktextiles.com",
    password: "Admin@123",
    role: "admin",
  });
  console.log("[Seed] Admin created: admin@deepaktextiles.com / Admin@123");

  // 2. Settings & Banner
  await Setting.create({
    companyName: "Deepak Textiles",
    tagline: "Premium Textiles. Trusted Wholesale Supply.",
    bannerTitle: "Premium Textiles. Trusted Wholesale Supply.",
    bannerSubtitle:
      "Quality fabrics and fashion collections for retailers, resellers and bulk buyers across India. Direct Surat mill rates.",
    bannerImage:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=80",
    phone: "+91 98251 44520",
    whatsappNumber: "+91 98251 44520",
    email: "sales@deepaktextiles.com",
    address: "Plot 104-108, Millenium Textile Market, Ring Road, Surat, Gujarat 395002",
    gstNumber: "24AAACD1234F1Z8",
  });

  // 3. Categories
  const categoriesData = [
    {
      name: "Sarees",
      slug: "sarees",
      description: "Banarasi, Katan Silk, Chanderi, Georgette & Organza wholesale sarees.",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Dress Materials",
      slug: "dress-materials",
      description: "Unstitched 3-piece suit sets, pure cotton salwar kameez sets.",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Kurta Sets",
      slug: "kurta-sets",
      description: "Ready-to-wear women's kurti lots, Anarkali suit lots.",
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Fabrics",
      slug: "fabrics",
      description: "Mill fabric rolls in Pure Rayon, Modal, Linen, and 60s Cambric Cotton.",
      image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Ladies Wear",
      slug: "ladies-wear",
      description: "Ethnic and festive wear wholesale lots for boutique owners.",
      image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Men's Wear",
      slug: "mens-wear",
      description: "Men's ethnic kurta fabric, premium shirting linen.",
      image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const catMap = {};
  for (const cat of categoriesData) {
    const doc = await Category.create(cat);
    catMap[cat.slug] = doc._id;
  }

  // 4. Products
  const products = [
    {
      name: "Royal Banarasi Katan Silk Saree with Rich Zari Pallu",
      slug: "royal-banarasi-katan-silk-saree",
      sku: "DT-SAR-001",
      description:
        "Hand-woven Banarasi Katan Silk Saree with heavy gold zari border and rich pallu. Sourced directly from our Surat weaving unit. Each piece accompanied by unstitched matching blouse piece.",
      shortDescription: "Pure Katan Silk with heavy contrast zari work. Standard wholesale lot of 10 sarees.",
      category: catMap["sarees"],
      images: [
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80",
      ],
      price: 4500,
      wholesalePrice: 2150,
      minimumOrderQuantity: 10,
      stock: 450,
      unit: "pieces",
      fabric: "Katan Silk",
      color: "Deep Crimson Red",
      pattern: "Zari Floral Weave",
      featured: true,
      active: true,
    },
    {
      name: "Chanderi Cotton Silk Embroidered Dress Material (Unstitched 3-Piece)",
      slug: "chanderi-cotton-silk-suit-material",
      sku: "DT-DRS-102",
      description:
        "Premium 3-piece unstitched suit material featuring resham threadwork top, pure santoon bottom, and digital printed Chanderi dupatta. Ideal for boutique resellers.",
      shortDescription: "Chanderi top + santoon bottom + printed dupatta. Lot of 15 sets.",
      category: catMap["dress-materials"],
      images: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
      ],
      price: 2400,
      wholesalePrice: 1050,
      minimumOrderQuantity: 15,
      stock: 620,
      unit: "sets",
      fabric: "Chanderi Silk",
      color: "Mustard Gold & Teal",
      pattern: "Resham Embroidery",
      featured: true,
      active: true,
    },
    {
      name: "Premium 14kg Liva Rayon Printed Kurti Lot (Pack of 20)",
      slug: "premium-14kg-rayon-printed-kurti-lot",
      sku: "DT-KRT-204",
      description:
        "Fast-selling A-line printed kurti lot made from breathable 14kg Liva Certified Rayon. Fast reactive dye prints with zero bleeding guarantee. Assorted sizes M, L, XL, XXL.",
      shortDescription: "14kg Liva Rayon printed kurtis in assorted sizes. Factory direct pack of 20.",
      category: catMap["kurta-sets"],
      images: [
        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80",
      ],
      price: 1100,
      wholesalePrice: 420,
      minimumOrderQuantity: 20,
      stock: 1200,
      unit: "pieces",
      fabric: "14kg Liva Rayon",
      color: "Assorted Floral Prints",
      pattern: "Discharge Print",
      featured: true,
      active: true,
    },
    {
      name: "Pure 60s Cambric Cotton Fabric Rolls (Wholesale Thaan)",
      slug: "pure-60s-cambric-cotton-fabric-rolls",
      sku: "DT-FAB-301",
      description:
        "Finest grade 60x60 Cambric Cotton mill-print fabric rolls. Extra-soft finish with high color-fastness. Designed for garment manufacturers and boutique designers.",
      shortDescription: "60s combed pure cotton fabric roll. Wholesale lot of 100 meters minimum.",
      category: catMap["fabrics"],
      images: [
        "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=900&q=80",
      ],
      price: 220,
      wholesalePrice: 115,
      minimumOrderQuantity: 100,
      stock: 5000,
      unit: "meters",
      fabric: "60s Cambric Cotton",
      color: "Indigo Blue Print",
      pattern: "Ajrakh Block Print Style",
      featured: true,
      active: true,
    },
    {
      name: "Heavy Organza Tissue Festive Saree with Cutwork Border",
      slug: "heavy-organza-tissue-festive-saree",
      sku: "DT-SAR-005",
      description:
        "Trending organza tissue saree with delicate floral embroidery and laser cut scalloped borders. Comes with a matching satin silk blouse piece.",
      shortDescription: "Sheer organza tissue with intricate cutwork embroidery. MOQ 10 pieces.",
      category: catMap["sarees"],
      images: [
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
      ],
      price: 3600,
      wholesalePrice: 1650,
      minimumOrderQuantity: 10,
      stock: 280,
      unit: "pieces",
      fabric: "Organza Tissue",
      color: "Pastel Lavender",
      pattern: "Cutwork Floral Embroidery",
      featured: false,
      active: true,
    },
    {
      name: "Pure Linen Slub Unstitched Men's Kurta & Shirting Fabric",
      slug: "pure-linen-slub-mens-kurta-fabric",
      sku: "DT-MEN-402",
      description:
        "Breathable 100% natural linen slub fabric in contemporary pastel hues. Outstanding texture and comfort from our Surat looms.",
      shortDescription: "Natural linen slub shirting and kurta fabric. 50 meters minimum roll.",
      category: catMap["mens-wear"],
      images: [
        "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80",
      ],
      price: 490,
      wholesalePrice: 280,
      minimumOrderQuantity: 50,
      stock: 1800,
      unit: "meters",
      fabric: "100% Pure Linen",
      color: "Beige Slub",
      pattern: "Natural Slub Texture",
      featured: true,
      active: true,
    },
  ];

  for (const p of products) {
    await Product.create(p);
  }

  // 5. Sample Enquiry
  await Enquiry.create({
    name: "Ramesh Shah",
    phone: "+91 98765 43210",
    email: "ramesh@shahstores.com",
    companyName: "Shah Cloth Stores (Pune)",
    quantity: 50,
    message: "Inquiring about 50 pieces of Banarasi Katan Silk Sarees with transport to Pune.",
    status: "new",
  });

  console.log("[Seed] Deepak Textiles catalog seeded successfully!");
};

// Directly executed
if (process.argv[1] && process.argv[1].includes("seed")) {
  connectDB()
    .then(async () => {
      await seedDatabase();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
