"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MessageCircle, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { WhatsAppIcon } from "../ui/WhatsAppIcon";
import { SALES_PRODUCT_SHOWCASE, SALES_PRODUCT_IMAGES } from "../../lib/salesImages";

export const SalesProductsSlider = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Section Header with Carousel Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-gold-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Deepak Textiles • Active Selling Catalog</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-navy-900 tracking-tight">
            Wholesale Selling Collection
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Real showroom stock photos — Designer Sarees, Suit Pieces & Readymade lots ready for immediate dispatch across Bihar & India.
          </p>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 shadow-xs hover:shadow transition-all active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 shadow-xs hover:shadow transition-all active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.2]" />
          </button>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-950 text-white text-xs font-bold hover:bg-navy-900 transition-colors shadow-xs"
          >
            <span>View All Lots</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
          </Link>
        </div>
      </div>

      {/* Scrollable Track of Selling Products */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth scrollbar-thin scrollbar-thumb-gray-200"
      >
        {SALES_PRODUCT_SHOWCASE.map((item) => {
          const discount = Math.round(
            ((item.retailPrice - item.wholesalePrice) / item.retailPrice) * 100
          );
          const whatsappMsg = encodeURIComponent(
            `Hello Deepak Textiles, I want to inquire about wholesale stock for: *${item.title}* (Wholesale Rate: ₹${item.wholesalePrice}, MOQ: ${item.moq} pcs). Please send catalog & video.`
          );

          return (
            <div
              key={item.id}
              className="min-w-[260px] sm:min-w-[290px] max-w-[290px] bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden shrink-0 snap-start group"
            >
              {/* Image Container with Badge */}
              <div className="relative aspect-[3/3.9] w-full overflow-hidden bg-gray-100">
                <Link href={`/products/${item.slug}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </Link>

                {/* Badge Top Left */}
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-navy-950/85 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
                  {item.badge}
                </span>

             

                {/* Profit Margin Bottom Left */}
                <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                  {discount}% Margin
                </span>
              </div>

              {/* Card Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-700">
                    {item.category}
                  </span>
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="font-heading font-bold text-sm text-gray-900 group-hover:text-gold-700 transition-colors line-clamp-2 mt-0.5">
                      {item.title}
                    </h3>
                  </Link>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline justify-between pt-1 border-t border-gray-100">
                  <div>
                    <span className="text-[10px] text-gray-500 block">Wholesale Rate</span>
                    <span className="text-base font-extrabold text-navy-950">
                      ₹{item.wholesalePrice}
                    </span>
                    <span className="text-xs text-gray-400 line-through ml-1.5">
                      ₹{item.retailPrice}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Direct Rate
                  </span>
                </div>

                {/* WhatsApp Quick Order Button */}
                <a
                  href={`https://wa.me/919308066552?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  <div className="w-4 h-4 flex items-center justify-center shrink-0">
                    <WhatsAppIcon className="w-full h-full" color="#ffffff" phoneColor="#059669" />
                  </div>
                  <span>Order on WhatsApp</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
