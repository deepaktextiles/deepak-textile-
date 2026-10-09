"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const BestSellerMensSlider = () => {
  const scrollRef = useRef(null);

  const mensItems = [
    {
      id: 1,
      title: "Jackets and Coats",
      image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=85",
      borderColor: "border-[#b82548]",
      barBg: "bg-[#b82548]",
      link: "/products?search=Jacket",
    },
    {
      id: 2,
      title: "Track Pants & Casuals",
      image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=85",
      borderColor: "border-[#b47012]",
      barBg: "bg-[#b47012]",
      link: "/products?search=Fabric",
    },
    {
      id: 3,
      title: "Kurta Pajama",
      image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=85",
      borderColor: "border-black",
      barBg: "bg-black",
      link: "/products?search=Kurta",
    },
    {
      id: 4,
      title: "Sherwani",
      image: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=800&q=85",
      borderColor: "border-black",
      barBg: "bg-black",
      link: "/products?search=Sherwani",
    },
    {
      id: 5,
      title: "Jodhpuri Suit",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=85",
      borderColor: "border-black",
      barBg: "bg-black",
      link: "/products?search=Suit",
    },
    {
      id: 6,
      title: "Shirting & Suiting Thaan",
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=85",
      borderColor: "border-[#14213d]",
      barBg: "bg-[#14213d]",
      link: "/products?category=fabrics-running-material",
    },
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Centered Heading with Decorative Diamond Divider Matching Reference Image */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-navy-950 tracking-normal">
          Best Seller Mens
        </h2>

        {/* Ornamental Ethnic Chain / Diamond Pattern Divider */}
        <div className="flex items-center justify-center gap-1 mt-2 text-navy-900/60 text-xs select-none">
          <span>◇◈◇◈◇◈◇◈◇◈◇◈◇◈◇◈◇◈◇◈◇◈◇◈◇◈◇</span>
        </div>
      </div>

      {/* Slider Container with Left & Right Arrows */}
      <div className="relative group">
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-navy-900 hover:text-white text-navy-900 border border-gray-200 shadow-md flex items-center justify-center transition-all backdrop-blur-sm"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-4 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {mensItems.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className={`flex-none w-[200px] sm:w-[220px] md:w-[235px] lg:w-[245px] rounded-2xl sm:rounded-3xl border-2 ${item.borderColor} overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group/card bg-white`}
            >
              {/* Image Box */}
              <div className="relative aspect-[3/4.6] overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-top group-hover/card:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Bottom Solid Bar with Italic / Script Title */}
              <div
                className={`w-full py-2.5 px-3 ${item.barBg} text-center flex items-center justify-center`}
              >
                <span className="font-serif italic text-white text-xs sm:text-sm font-semibold tracking-wide truncate">
                  {item.title}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-navy-900 hover:text-white text-navy-900 border border-gray-200 shadow-md flex items-center justify-center transition-all backdrop-blur-sm"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
