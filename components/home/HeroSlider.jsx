"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ArrowRight,
  Truck,
  ShieldCheck,
  Award,
  Layers,
  RotateCcw,
} from "lucide-react";
import { bannersApi } from "../../services/api.js";

const getOptimizedBannerUrl = (url, isMobile = false) => {
  if (!url || typeof url !== "string") return url;
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    if (!url.includes("/f_auto") && !url.includes("/q_") && !url.includes("/w_")) {
      const transform = isMobile
        ? "w_1080,c_scale,q_100,f_auto,e_sharpen:40"
        : "w_1920,c_scale,q_100,f_auto,e_sharpen:50";
      return url.replace("/upload/", `/upload/${transform}/`);
    }
  }
  return url;
};

export const HeroSlider = ({ customSettings }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);



  const [slides, setSlides] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchBanners = async () => {
      try {
        const res = await bannersApi.getAll();
        if (
          isMounted &&
          res.success &&
          Array.isArray(res.banners) &&
          res.banners.length > 0
        ) {
          const activeBanners = res.banners.filter(
            (b) => b.active !== false && (b.type === "hero" || !b.type)
          );
          setSlides(activeBanners);
        }
      } catch (err) {
        console.error("Could not load banners:", err);
      }
    };
    fetchBanners();
    return () => {
      isMounted = false;
    };
  }, []);

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay slider every 5.5 seconds (only if multiple slides)
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, slides.length]);

  const whatsappCleanNumber = (
    customSettings?.whatsapp || "919308066552"
  ).replace(/[^0-9]/g, "");

  const hasSlides = Array.isArray(slides) && slides.length > 0;

  return (
    <div className="w-full space-y-0">
      {/* 1. MAIN HERO SLIDER (Only visible when admin adds banners) */}
      {hasSlides && (
        <section
          className="relative w-full overflow-hidden bg-navy-950 aspect-[16/7] sm:aspect-[21/8] md:aspect-[24/8] min-h-[220px] sm:min-h-[300px] md:min-h-[380px] lg:min-h-[440px] flex items-center select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
        {/* Slides Track */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide._id || slide.id || index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Image with Crisp HD rendering */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Desktop Banner: Strictly hidden on mobile (< 768px), visible on md+ */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getOptimizedBannerUrl(slide.image, false)}
                  alt={slide.title || "Deepak Textiles Desktop Banner"}
                  loading="eager"
                  fetchPriority={isActive ? "high" : "auto"}
                  decoding="async"
                  style={{
                    imageRendering: "-webkit-optimize-contrast",
                    WebkitBackfaceVisibility: "hidden",
                    backfaceVisibility: "hidden",
                  }}
                  className="hidden md:block w-full h-full object-cover object-center pointer-events-none"
                />

                {/* Mobile Banner: Strictly visible on mobile (< 768px), hidden on md+ */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getOptimizedBannerUrl(slide.mobileImage || slide.image, true)}
                  alt={slide.title || "Deepak Textiles Mobile Banner"}
                  loading="eager"
                  fetchPriority={isActive ? "high" : "auto"}
                  decoding="async"
                  style={{
                    imageRendering: "-webkit-optimize-contrast",
                    WebkitBackfaceVisibility: "hidden",
                    backfaceVisibility: "hidden",
                  }}
                  className="block md:hidden w-full h-full object-cover object-center pointer-events-none"
                />
              </div>

              {/* Full Clickable Banner Link redirecting to assigned Category/Page */}
              <Link
                href={slide.link || "/products"}
                className="absolute inset-0 z-20 block w-full h-full cursor-pointer"
                aria-label={slide.title || "View Collection"}
              />
            </div>
          );
        })}

        {/* Navigation Arrows (Only if multiple slides) */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-gold-500 hover:text-navy-950 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-lg"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-gold-500 hover:text-navy-950 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-lg"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Bottom Slide Indicators / Bars */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-300 rounded-full h-2.5 ${
                    currentSlide === idx
                      ? "w-10 bg-gold-400 shadow-md shadow-gold-500/50"
                      : "w-2.5 bg-white/40 hover:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>
      )}

      {/* 2. RUNNING ICON TICKER BAR (Directly matching user's reference) */}
      <div className="w-full bg-white border-y border-gray-200 py-3.5 shadow-sm overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 items-center text-center">
            {/* 1 */}
            <div className="flex items-center justify-center gap-2.5 text-xs text-navy-900 font-bold">
              <Truck className="w-4 h-4 text-gold-600 shrink-0" />
              <span>Pan-India Transport</span>
            </div>

            {/* 2 */}
            <div className="flex items-center justify-center gap-2.5 text-xs text-navy-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Genuine Quality</span>
            </div>

            {/* 3 */}
            <div className="flex items-center justify-center gap-2.5 text-xs text-navy-900 font-bold">
              <Layers className="w-4 h-4 text-gold-600 shrink-0" />
              <span>2,000+ Running Styles</span>
            </div>

            {/* 4 */}
            <div className="flex items-center justify-center gap-2.5 text-xs text-navy-900 font-bold">
              <Award className="w-4 h-4 text-navy-900 shrink-0" />
              <span>Direct Mill Rates</span>
            </div>

            {/* 5 */}
            <div className="flex items-center justify-center gap-2.5 text-xs text-navy-900 font-bold col-span-2 sm:col-span-1">
              <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Safe Parcel Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
