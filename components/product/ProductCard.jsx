"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";

export const ProductCard = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false);

  const primaryImage =
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80";

  const wholesalePrice = product.wholesalePrice || product.price || 499;
  // If retail MRP is provided and higher, use it; otherwise compute Surat mill discount MRP (approx 2.5x wholesale)
  const retailPrice =
    product.price && product.price > wholesalePrice
      ? product.price
      : Math.round(wholesalePrice * 2.5);

  const discountPercent = Math.max(
    10,
    Math.round(((retailPrice - wholesalePrice) / retailPrice) * 100)
  );

  const whatsappMessage = encodeURIComponent(
    `Hello Deepak Textiles, I am interested in wholesale order for:
*${product.name}*
SKU: ${product.sku || "DT-LOT"}
Wholesale Rate: ₹${wholesalePrice}/${product.unit || "pc"}
MOQ: ${product.minimumOrderQuantity || 10} ${product.unit || "pcs"}
Please share catalog photos and dispatch details.`
  );

  const sizes =
    product.sizes && product.sizes.length > 0
      ? product.sizes
      : ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="group flex flex-col bg-white overflow-hidden transition-all duration-300">
      {/* 1. Tall Portrait Image with Heart Icon on Bottom Right (Matching Reference Image) */}
      <div className="relative aspect-[3/4.2] w-full overflow-hidden bg-gray-100">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </Link>

        {/* MOQ Tag on Top Left */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold tracking-wider uppercase">
            MOQ: {product.minimumOrderQuantity || 10} {product.unit || "pcs"}
          </span>
        </div>

        {/* Rating Pill on Bottom Left (Directly matching Libas reference image) */}
        <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-800 flex items-center gap-1 border border-gray-100">
          <span className="text-amber-500 font-black">★</span>
          <span>{product.rating || "4.7"}</span>
          <span className="text-gray-300 font-light">|</span>
          <span className="text-gray-500 font-medium">({product.reviewsCount || "24"})</span>
        </div>

        {/* Heart / Wishlist Icon on Bottom Right (Directly matching reference image) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 hover:bg-white backdrop-blur-xs flex items-center justify-center transition-all border border-gray-100"
          aria-label="Wishlist"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              isLiked ? "fill-rose-500 text-rose-500" : "text-gray-700"
            }`}
          />
        </button>
      </div>

      {/* 2. Product Details (Exact typography and layout from image) */}
      <div className="pt-2.5 pb-2 px-0.5 space-y-1.5">
        {/* Title */}
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="font-heading font-medium text-xs sm:text-[13px] text-gray-900 hover:text-gold-700 truncate transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Purple/Plum "2026 Lowest Price" Pill Badge */}
        <div>
          <span className="inline-block bg-[#580050] text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded tracking-tight">
            2026 Lowest Price
          </span>
        </div>

        {/* Pricing Row: Strikethrough MRP, Bold Price, Red Discount % */}
        <div className="flex items-baseline gap-1.5 text-xs sm:text-sm">
          <span className="line-through text-gray-500 text-[11px] sm:text-xs">
            ₹{retailPrice.toLocaleString("en-IN")}
          </span>
          <span className="font-extrabold text-gray-950 text-xs sm:text-sm">
            ₹{wholesalePrice.toLocaleString("en-IN")}
          </span>
          <span className="text-rose-600 font-bold text-[11px] sm:text-xs">
            {discountPercent}% off
          </span>
        </div>

        {/* Sizes Row: XS S M L XL XXL */}
        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-gray-600 font-medium tracking-wider pt-0.5">
          {sizes.map((s, idx) => (
            <span key={idx}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
