"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export const SareeStoreBento = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Centered Heading Matching Reference Image */}
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-navy-900 tracking-wider uppercase">
          THE SAREE STORE
        </h2>
        <div className="w-16 h-1 bg-gold-500 mx-auto mt-2.5 rounded-full" />
      </div>

      {/* 3-Column Bento Grid Matching User's Image */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* 1. LEFT COLUMN: Tall Portrait with "Deepak GOLD" Emblem (4 cols) */}
        <Link
          href="/products?category=wholesale-sarees"
          className="md:col-span-4 group relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-navy-950/90 shadow-md hover:shadow-2xl transition-all duration-300 min-h-[420px] sm:min-h-[480px] md:min-h-[520px] flex flex-col justify-end bg-navy-950"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85"
            alt="Deepak Gold Silk Sarees"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

          {/* Ornamental "Deepak GOLD" Seal at bottom */}
          <div className="relative z-10 p-6 flex flex-col items-center text-center">
            <div className="w-32 h-20 sm:w-36 sm:h-22 rounded-[50%] bg-gradient-to-b from-[#3a1d0f] to-[#1a0c06] border-2 border-gold-400 flex flex-col items-center justify-center shadow-2xl p-2 transform group-hover:scale-105 transition-transform">
              <span className="font-heading italic text-gold-300 text-xs sm:text-sm font-semibold tracking-wide">
                Deepak
              </span>
              <span className="font-heading font-black text-gold-400 text-lg sm:text-xl tracking-widest uppercase -mt-0.5">
                GOLD
              </span>
            </div>
            <span className="mt-3 text-xs font-bold text-gray-200 uppercase tracking-widest group-hover:text-gold-400 transition-colors flex items-center gap-1">
              <span>Pure Zari Silk Lots</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>

        {/* 2. MIDDLE COLUMN: Two Stacked Landscape Banners (4 cols) */}
        <div className="md:col-span-4 flex flex-col gap-5 sm:gap-6 justify-between">
          {/* Top Card: DURGA PUJO */}
          <Link
            href="/products?category=wholesale-sarees"
            className="group relative flex-1 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-navy-950/90 shadow-md hover:shadow-2xl transition-all duration-300 min-h-[200px] sm:min-h-[235px] flex flex-col justify-end bg-navy-950"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=85"
              alt="Durga Pujo Saree Collection"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Centered Yellow Text */}
            <div className="relative z-10 p-5 text-center">
              <h3 className="font-heading font-black text-lg sm:text-xl md:text-2xl text-yellow-400 tracking-wider uppercase drop-shadow-md group-hover:text-yellow-300 transition-colors">
                DURGA PUJO
              </h3>
              <p className="text-[11px] text-gray-300 font-semibold tracking-wide mt-0.5">
                Festive Wholesale Lots
              </p>
            </div>
          </Link>

          {/* Bottom Card: KARWA CHAUTH */}
          <Link
            href="/products?category=wholesale-sarees"
            className="group relative flex-1 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-navy-950/90 shadow-md hover:shadow-2xl transition-all duration-300 min-h-[200px] sm:min-h-[235px] flex flex-col justify-end bg-navy-950"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85"
              alt="Karwa Chauth Saree Collection"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Centered Yellow Text */}
            <div className="relative z-10 p-5 text-center">
              <h3 className="font-heading font-black text-lg sm:text-xl md:text-2xl text-yellow-400 tracking-wider uppercase drop-shadow-md group-hover:text-yellow-300 transition-colors">
                KARWA CHAUTH
              </h3>
              <p className="text-[11px] text-gray-300 font-semibold tracking-wide mt-0.5">
                Red & Bridal Special Saree Lots
              </p>
            </div>
          </Link>
        </div>

        {/* 3. RIGHT COLUMN: Tall Portrait with "READY TO WEAR SAREES" (4 cols) */}
        <Link
          href="/products?category=wholesale-sarees"
          className="md:col-span-4 group relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-navy-950/90 shadow-md hover:shadow-2xl transition-all duration-300 min-h-[420px] sm:min-h-[480px] md:min-h-[520px] flex flex-col justify-end bg-navy-950"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=900&q=85"
            alt="Ready to Wear Sarees"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

          {/* Yellow Centered Text at bottom */}
          <div className="relative z-10 p-6 text-center">
            <h3 className="font-heading font-black text-lg sm:text-2xl text-yellow-400 tracking-wider uppercase leading-snug drop-shadow-md group-hover:text-yellow-300 transition-colors">
              READY TO<br />WEAR SAREES
            </h3>
            <p className="text-xs text-gray-300 font-semibold tracking-wide mt-1">
              Pre-Stitched & Designer Drape Lots
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
};
