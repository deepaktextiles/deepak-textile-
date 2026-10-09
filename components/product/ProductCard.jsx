"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageCircle, Eye } from "lucide-react";
import { Button } from "../ui/Button";
import { EnquiryModal } from "../wholesale/EnquiryModal";

export const ProductCard = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const primaryImage =
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80";

  const whatsappMessage = encodeURIComponent(
    `Hello Deepak Textiles, I am interested in wholesale order for:
*${product.name}*
SKU: ${product.sku}
Wholesale Rate: ₹${product.wholesalePrice || product.price}/${product.unit}
MOQ: ${product.minimumOrderQuantity} ${product.unit}
Please share catalog photos and dispatch details.`
  );

  return (
    <>
      <div className="group bg-white rounded-lg border border-border hover:border-gold-400 hover:shadow-elevated transition-all duration-300 flex flex-col overflow-hidden">
        {/* Clickable Image */}
        <Link href={`/products/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-sitebg block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-navy-500 text-white px-2 py-0.5 rounded shadow-sm">
              MOQ: {product.minimumOrderQuantity} {product.unit || "pcs"}
            </span>
          </div>
        </Link>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs text-txt-secondary mb-1">
              <span className="font-semibold text-gold-700 uppercase tracking-wider text-[11px]">
                {product.category?.name || "Wholesale Lot"}
              </span>
              <span className="font-mono text-[11px] text-gray-400">SKU: {product.sku}</span>
            </div>

            <Link href={`/products/${product.slug}`} className="block">
              <h3 className="font-heading font-semibold text-sm text-navy-500 hover:text-gold-600 line-clamp-2 transition-colors leading-snug">
                {product.name}
              </h3>
            </Link>

            <div className="mt-2 flex items-center gap-2 text-xs text-txt-secondary">
              <span className="bg-sitebg px-2 py-0.5 rounded text-[11px] font-medium border border-border">
                {product.fabric}
              </span>
              <span className="text-gray-300">•</span>
              <span className="truncate text-[11px]">{product.color}</span>
            </div>
          </div>

          {/* Pricing & Direct Contact Actions */}
          <div className="pt-2 border-t border-border/80 space-y-2.5">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-txt-secondary block uppercase tracking-wider font-semibold">
                  Wholesale Price
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading font-extrabold text-base text-navy-500">
                    ₹{product.wholesalePrice?.toLocaleString("en-IN") || product.price?.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-txt-secondary">/{product.unit || "pc"}</span>
                </div>
              </div>

              {product.price > (product.wholesalePrice || 0) && (
                <div className="text-right">
                  <span className="text-[10px] text-txt-secondary block">Retail MRP</span>
                  <span className="text-xs line-through text-gray-400">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons: WhatsApp & View Details */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link href={`/products/${product.slug}`} className="w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs py-2 h-9 border-navy-300 hover:bg-sitebg text-navy-500"
                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                >
                  Details
                </Button>
              </Link>

              <a
                href={`https://wa.me/919825144520?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button
                  variant="whatsapp"
                  size="sm"
                  className="w-full text-xs py-2 h-9 font-bold bg-emerald-600 hover:bg-emerald-500"
                  leftIcon={<MessageCircle className="w-3.5 h-3.5" />}
                >
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
  );
};
