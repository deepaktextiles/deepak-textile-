"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const TrendingBannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const startXRef = useRef(0);
  const isDragActiveRef = useRef(false);
  const hasMovedRef = useRef(false);
  const containerRef = useRef(null);

  const banners = [
    {
      id: 1,
      image: "/images/selesproductsimages/7ff997fb-c6a3-4333-84d2-907a30cb30f9.avif",
      title: "Royal Banarasi Silk Saree",
      link: "/products?category=wholesale-sarees",
    },
    {
      id: 2,
      image: "/images/selesproductsimages/a3198247-d1d7-47e6-a99b-1e0d14f3ec33.avif",
      title: "Designer Cotton & Chanderi Suit Piece",
      link: "/products?category=dress-materials",
    },
    {
      id: 3,
      image: "/images/selesproductsimages/4add71ea-fd79-47b5-8f73-75dd4f6829cd.avif",
      title: "Rayon Kurti & Pant Sets",
      link: "/products?category=kurti-sets",
    },
    {
      id: 4,
      image: "/images/selesproductsimages/7bc3e582-f0d0-4032-8993-7e3d7b22cfa9.avif",
      title: "Heavy Organza Festive Collection",
      link: "/products?category=lehenga-choli",
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Auto-slide every 4.5 seconds (pauses on hover or during drag)
  useEffect(() => {
    if (isPaused || isDragging) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, isDragging, nextSlide]);

  // Drag start (Mouse / Touch)
  const handleDragStart = (clientX) => {
    startXRef.current = clientX;
    isDragActiveRef.current = true;
    hasMovedRef.current = false;
    setIsDragging(true);
    setIsPaused(true);
  };

  // Drag move (Mouse / Touch)
  const handleDragMove = (clientX) => {
    if (!isDragActiveRef.current) return;
    const diff = clientX - startXRef.current;
    if (Math.abs(diff) > 5) {
      hasMovedRef.current = true;
    }
    setDragOffset(diff);
  };

  // Drag end (Mouse / Touch)
  const handleDragEnd = () => {
    if (!isDragActiveRef.current) return;
    isDragActiveRef.current = false;
    setIsDragging(false);

    const threshold = 50; // Drag threshold to trigger slide change
    if (dragOffset < -threshold) {
      nextSlide();
    } else if (dragOffset > threshold) {
      prevSlide();
    }

    setDragOffset(0);
    setTimeout(() => {
      hasMovedRef.current = false;
    }, 50);
  };

  // Mouse Handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragActiveRef.current) {
      handleDragEnd();
    }
    setIsPaused(false);
  };

  // Touch Handlers
  const handleTouchStart = (e) => {
    if (e.touches.length > 0) {
      handleDragStart(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      handleDragMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Prevent link navigation if the user was dragging
  const handleLinkClick = (e) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Centered Heading */}
      <div className="text-center mb-5 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-navy-900 tracking-wider uppercase">
          TRENDING NOW
        </h2>
        <div className="w-16 h-1 bg-gold-500 mx-auto mt-2.5 rounded-full" />
      </div>

      {/* Wide Rounded Image Slider Container with Mouse Drag & Touch Swipe */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 aspect-[16/7] sm:aspect-[21/8] md:aspect-[24/8] min-h-[220px] sm:min-h-[280px] md:min-h-[340px] select-none bg-navy-950 group ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ touchAction: "pan-y" }}
      >
        {/* Carousel Track */}
        <div
          className="flex h-full w-full"
          style={{
            transform: `translateX(calc(-${currentSlide * 100}% + ${dragOffset}px))`,
            transition: isDragging
              ? "none"
              : "transform 500ms cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="min-w-full w-full h-full shrink-0 relative select-none"
            >
              <Link
                href={banner.link}
                onClick={handleLinkClick}
                draggable={false}
                className="block w-full h-full relative select-none pointer-events-auto"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.image}
                  alt={banner.title}
                  draggable={false}
                  className="w-full h-full object-cover object-center pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                />
              </Link>
            </div>
          ))}
        </div>

        {/* Prev / Next Chevrons */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-gold-500 hover:text-navy-950 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-md pointer-events-auto"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-gold-500 hover:text-navy-950 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-md pointer-events-auto"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Bottom Slide Indicators */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 pointer-events-auto">
          {banners.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(idx);
              }}
              className={`transition-all duration-300 rounded-full h-2 ${
                currentSlide === idx
                  ? "w-7 sm:w-8 bg-gold-400 shadow-sm"
                  : "w-2 bg-white/60 hover:bg-white/90"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
