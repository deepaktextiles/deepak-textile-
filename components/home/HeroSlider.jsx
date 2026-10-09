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

export const HeroSlider = ({ customSettings }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const defaultSlides = [
    {
      id: 1,
      badge: "Festive & Bridal Wholesale Special",
      title: customSettings?.bannerTitle || "Durga Puja & Wedding Saree Collection",
      subtitle:
        customSettings?.bannerSubtitle ||
        "Royal Banarasi, Katan Silk, Georgette & Organza Sarees. Authentic Surat Mill Rates for Retailers & Boutiques.",
      image:
        customSettings?.bannerImage ||
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1920&q=85",
      link: "/products?category=wholesale-sarees",
      btnText: "Explore Saree Lots",
      accent: "from-amber-950/90 via-navy-950/80 to-navy-950/60",
    },
    {
      id: 2,
      badge: "Direct Mill Salwar Suits",
      title: "Designer Dress Materials & Unstitched Suits",
      subtitle:
        "Pure Cambric Cotton, Chanderi Silk & Rayon 3-Piece Sets with matching Dupattas. High margin wholesale lots.",
      image:
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1920&q=85",
      link: "/products?category=dress-materials",
      btnText: "View Dress Materials",
      accent: "from-rose-950/90 via-navy-950/80 to-navy-950/60",
    },
    {
      id: 3,
      badge: "High-Demand Ready Stock",
      title: "Trending Kurti Sets & Running Fabric Rolls",
      subtitle:
        "Ready-to-dispatch Kurti-Pant-Dupatta sets and premium Thaan running materials. Pan-India daily transport booking.",
      image:
        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1920&q=85",
      link: "/products",
      btnText: "Browse Full Catalog",
      accent: "from-indigo-950/90 via-navy-950/80 to-navy-950/60",
    },
  ];

  const slides = defaultSlides;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay slider every 5.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const whatsappCleanNumber = (customSettings?.whatsapp || "9825144520").replace(/[^0-9]/g, "");

  return (
    <div className="w-full space-y-0">
      {/* 1. MAIN HERO SLIDER */}
      <section
        className="relative w-full overflow-hidden bg-navy-950 min-h-[480px] sm:min-h-[540px] lg:min-h-[600px] flex items-center select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slides Track */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Image with Zoom animation */}
              <div className="absolute inset-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className={`w-full h-full object-cover object-center transition-transform duration-7000 ease-out ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                />
                {/* Gradient Overlays */}
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent}`} />
                <div className="absolute inset-0 bg-black/30" />
              </div>

              {/* Slide Content */}
              <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                <div className="max-w-3xl space-y-5 sm:space-y-6 py-16">
                  {/* Title */}
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-[1.15] drop-shadow-sm">
                    {slide.title}
                  </h1>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-3.5 pt-2">
                    <Link
                      href={slide.link}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 font-extrabold text-xs sm:text-sm tracking-wide uppercase shadow-lg hover:shadow-gold-500/30 transition-all transform hover:-translate-y-0.5"
                    >
                      <span>{slide.btnText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <a
                      href={`https://wa.me/${whatsappCleanNumber}?text=Hello%20Deepak%20Textiles,%20please%20send%20wholesale%20rates%20for%20${encodeURIComponent(
                        slide.title
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all transform hover:-translate-y-0.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Order Desk</span>
                    </a>
                  </div>

                  {/* Micro Wholesale Notice */}
                  <div className="pt-4 flex items-center gap-4 text-xs text-gray-300 font-medium">
                    <span className="flex items-center gap-1.5 text-gold-400">
                      ★ Direct Surat Mill Rates
                    </span>
                    <span className="text-gray-500">•</span>
                    <span>MOQ: 10 to 20 Pcs Lots</span>
                    <span className="text-gray-500">•</span>
                    <span>GST Invoiced</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
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
      </section>

      {/* 2. RUNNING ICON TICKER BAR (Directly matching user's reference) */}
      <div className="w-full bg-white border-y border-gray-200 py-3.5 shadow-sm overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
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
