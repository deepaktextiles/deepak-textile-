"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getOptimizedImageUrl } from "../../lib/imageUtils";
import { SkeletonImage, ImageSkeletonBox } from "../ui/SkeletonImage";

export const TopCategoriesSlider = ({ categories = [], loading = false }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = Math.max(260, clientWidth * 0.75);
    scrollRef.current.scrollTo({
      left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  if (!loading && (!Array.isArray(categories) || categories.length === 0)) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className="text-center mb-6 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-navy-900 tracking-wider uppercase">
          TOP CATEGORIES
        </h2>
        <div className="w-16 h-1 bg-gold-500 mx-auto mt-3 rounded-full" />
      </div>

      {loading ? (
        <div
          className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="flex-none w-[46%] sm:w-[31%] md:w-[calc(25%-18px)] lg:w-[calc(25%-24px)] flex flex-col items-center"
            >
              <ImageSkeletonBox className="w-full aspect-[4/4.2] rounded-2xl" />
              <div className="h-4 w-28 bg-gray-200 rounded mt-3.5 animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="relative group">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute -left-1 sm:-left-4 top-[42%] -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-navy-900 hover:text-white text-navy-900 border border-gray-200 flex items-center justify-center transition-all"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Horizontal Scrollable Slider Track */}
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 px-0.5"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((cat) => (
              <Link
                key={cat._id || cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group/card flex-none w-[46%] sm:w-[31%] md:w-[calc(25%-18px)] lg:w-[calc(25%-24px)] snap-start flex flex-col items-center"
              >
                {/* Card Image Box */}
                <div className="w-full aspect-[4/4.2] rounded-2xl overflow-hidden group-hover/card:border-gold-500 transition-all duration-300 bg-white">
                  <SkeletonImage
                    src={getOptimizedImageUrl(
                      cat.image ||
                        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
                      { width: 600 }
                    )}
                    alt={cat.name}
                    wrapperClassName="w-full h-full"
                    className="w-full h-full object-contain object-top group-hover/card:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Bold Uppercase Title Underneath */}
                <div className="pt-3.5 text-center px-1">
                  <h3 className="font-heading font-extrabold text-sm sm:text-base tracking-wider uppercase text-navy-950 group-hover/card:text-gold-600 transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute -right-1 sm:-right-4 top-[42%] -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-navy-900 hover:text-white text-navy-900 border border-gray-200 flex items-center justify-center transition-all"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </section>
  );
};
