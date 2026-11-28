"use client";

import React from "react";
import { SALES_PRODUCT_IMAGES } from "../../lib/salesImages";
import { SkeletonImage } from "../ui/SkeletonImage";

export const BestSellerMensSlider = () => {
  const brandLogos = SALES_PRODUCT_IMAGES;

  const renderTrack = (keyPrefix, isDuplicate = false) => (
    <div
      className="flex items-center gap-4 sm:gap-6 pr-4 sm:pr-6 shrink-0"
      aria-hidden={isDuplicate ? "true" : undefined}
    >
      {brandLogos.map((logoUrl, idx) => (
        <div
          key={`${keyPrefix}-${idx}`}
          className="w-28 h-16 sm:w-36 sm:h-20 rounded-xl border border-gray-200 bg-white p-2.5 sm:p-3 flex items-center justify-center shrink-0"
        >
          <SkeletonImage
            src={logoUrl}
            alt={isDuplicate ? "" : `Brand Partner ${idx + 1}`}
            loading="eager"
            decoding="async"
            wrapperClassName="w-full h-full"
            className="w-full h-full object-contain"
            logoClassName="w-6 sm:w-7"
          />
        </div>
      ))}
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden py-2">
        {/* Soft left & right edge fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent z-10" />

        <div className="flex w-max animate-marquee">
          {renderTrack("track-a", false)}
          {renderTrack("track-b", true)}
        </div>
      </div>
    </section>
  );
};
