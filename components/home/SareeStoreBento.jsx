"use client";

import React from "react";
import { SkeletonImage } from "../ui/SkeletonImage";

export const SareeStoreBento = () => {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Centered Heading */}
      <div className="text-center mb-6 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-navy-900 tracking-wider uppercase">
          THE SAREE STORE
        </h2>
        <div className="w-16 h-1 bg-gold-500 mx-auto mt-2.5 rounded-full" />
      </div>

      {/* 3-Column Bento Grid using imagescatlogs banners (non-clickable) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* 1. LEFT COLUMN: Tall Portrait — Wedding Styles */}
        <div className="md:col-span-4 relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-navy-950/90 shadow-md aspect-[3/4.6] md:aspect-auto md:min-h-[520px] bg-navy-950">
          <SkeletonImage
            src="/images/imagescatlogs/wedding_97499e88-815e-4f88-a47c-535cda99822a.jpg"
            alt="Wedding Styles Collection"
            wrapperClassName="absolute inset-0 w-full h-full"
            skeletonClassName="bg-navy-900"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* 2. MIDDLE COLUMN: Two Stacked Landscape Banners */}
        <div className="md:col-span-4 flex flex-col gap-5 sm:gap-6 justify-between">
          {/* Top Card: Haldi Looks */}
          <div className="relative flex-1 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-navy-950/90 shadow-md aspect-[4/3] min-h-[200px] sm:min-h-[235px] bg-navy-950">
            <SkeletonImage
              src="/images/imagescatlogs/haldi-1.jpg"
              alt="Haldi Looks Collection"
              wrapperClassName="absolute inset-0 w-full h-full"
              skeletonClassName="bg-navy-900"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Bottom Card: Plus Sizes */}
          <div className="relative flex-1 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-navy-950/90 shadow-md aspect-[4/3] min-h-[200px] sm:min-h-[235px] bg-navy-950">
            <SkeletonImage
              src="/images/imagescatlogs/plus-sizes_75ae8ad9-b729-4712-8b15-bc2df5772bb0.jpg"
              alt="Plus Sizes Ethnic Collection"
              wrapperClassName="absolute inset-0 w-full h-full"
              skeletonClassName="bg-navy-900"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* 3. RIGHT COLUMN: Tall Portrait — Cocktail Sarees */}
        <div className="md:col-span-4 relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-navy-950/90 shadow-md aspect-[3/4.3] md:aspect-auto md:min-h-[520px] bg-navy-950">
          <SkeletonImage
            src="/images/imagescatlogs/cocktail_dd7ec918-cd00-4276-bc7b-c599cf6c9313.jpg"
            alt="Cocktail Sarees Collection"
            wrapperClassName="absolute inset-0 w-full h-full"
            skeletonClassName="bg-navy-900"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
};
