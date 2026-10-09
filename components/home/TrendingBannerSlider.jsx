"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export const TrendingBannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const banners = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1920&q=85",
      title: "SILK SAREE SALE",
      subtitle: "Exclusive Surat Mill Katan & Banarasi Lots",
      priceTag: "Starting ₹599/-",
      link: "/products?category=wholesale-sarees",
      btnText: "SHOP NOW",
      theme: "from-amber-950/80 via-black/40 to-transparent",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1920&q=85",
      title: "COTTON SUIT DHAMAKA",
      subtitle: "Pure Cambric Cotton & Chanderi 3-Piece Sets",
      priceTag: "Starting ₹450/-",
      link: "/products?category=dress-materials",
      btnText: "SHOP NOW",
      theme: "from-rose-950/80 via-black/40 to-transparent",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1920&q=85",
      title: "DESIGNER KURTI LOTS",
      subtitle: "Ready-to-Ship Pant-Dupatta Sets for Retailers",
      priceTag: "Starting ₹299/-",
      link: "/products?category=kurti-sets",
      btnText: "SHOP NOW",
      theme: "from-indigo-950/80 via-black/40 to-transparent",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=1920&q=85",
      title: "WEDDING LEHENGA FEST",
      subtitle: "Semi-Stitched Bridal & Partywear Collection",
      priceTag: "Starting ₹1,299/-",
      link: "/products?category=lehenga-choli",
      btnText: "SHOP NOW",
      theme: "from-red-950/80 via-black/40 to-transparent",
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Centered Heading Matching Reference Image */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-navy-900 tracking-wider uppercase">
          TRENDING NOW
        </h2>
        <div className="w-16 h-1 bg-gold-500 mx-auto mt-2.5 rounded-full" />
      </div>

      {/* Wide Rounded Image Slider Container */}
      <div
        className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 aspect-[16/7] sm:aspect-[21/8] md:aspect-[24/8] min-h-[220px] sm:min-h-[280px] md:min-h-[340px] select-none bg-navy-950"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {banners.map((banner, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Full Background Banner Image */}
              <Link href={banner.link} className="block w-full h-full relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover object-center"
                />

                {/* Subtle Right / Side Contrast Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-l ${banner.theme}`} />

                {/* Graphic Banner Overlay (Right side emblem + price tag matching reference) */}
                <div className="absolute inset-y-0 right-6 sm:right-12 md:right-20 flex flex-col items-center justify-center text-center text-white z-20 space-y-2 sm:space-y-3">
                  {/* Decorative Ornamental Badge */}
                  <div className="relative px-5 py-2.5 sm:px-8 sm:py-4 rounded-xl bg-gradient-to-br from-navy-900/90 via-navy-950/90 to-navy-900/90 border-2 border-gold-400 shadow-xl backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-1.5 text-gold-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-0.5">
                      <Sparkles className="w-3 h-3" />
                      <span>DEEPAK TEXTILES</span>
                    </div>
                    <h3 className="text-base sm:text-2xl md:text-3xl font-heading font-black text-gold-300 tracking-wider uppercase drop-shadow">
                      {banner.title}
                    </h3>
                  </div>

                  {/* Price Tag Callout */}
                  <div className="text-lg sm:text-2xl md:text-3xl font-heading font-black text-white tracking-tight drop-shadow-md">
                    {banner.priceTag}
                  </div>

                  {/* Golden Yellow Button */}
                  <span className="inline-block px-5 py-1.5 sm:px-7 sm:py-2 rounded bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-[11px] sm:text-xs tracking-wider uppercase shadow-md transition-all">
                    {banner.btnText}
                  </span>
                </div>
              </Link>
            </div>
          );
        })}

        {/* Prev / Next Chevrons */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-gold-500 hover:text-navy-950 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-md"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-gold-500 hover:text-navy-950 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-md"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Bottom Slide Indicators */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-300 rounded-full h-2 ${
                currentSlide === idx
                  ? "w-7 sm:w-8 bg-gold-400 shadow-sm"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
