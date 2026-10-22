"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MessageCircle, Menu, ShieldCheck, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { MegaMenu } from "./MegaMenu";
import { MobileSideDrawer } from "./MobileSideDrawer";
import { WhatsAppIcon } from "../ui/WhatsAppIcon";

export const Header = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const leaveTimerRef = useRef(null);

  // Close menus on page navigation
  useEffect(() => {
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleMouseEnter = () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    setMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 180);
  };

  return (
    <>
      {/* Top Darbhanga B2B Bar */}
      <div className="bg-navy-900 text-gray-300 text-xs py-2 px-4 border-b border-navy-800 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-gold-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Darbhanga Wholesale Textile Hub • Estd. 2001 (Bihar)
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-300">Sarees • Suit Pieces • Shirting & Suiting • Lehenga & Readymade</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:+919308066552"
              className="flex items-center gap-1.5 text-gray-200 hover:text-gold-400 transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              <span>Sales Desk: +91 93080 66552</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header with Framer Motion Entrance */}
      <motion.header
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 transition-all"
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            {/* Left side: Hamburger button (on mobile) & Logo */}
            <div className="flex items-center gap-3">
              {/* Mobile Hamburger to trigger Side Drawer */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden text-gray-800 hover:text-navy-950 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Open Mobile Menu Drawer"
              >
                <Menu className="w-6 h-6 stroke-[2.2]" />
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 shrink-0">
                <div className="w-10 h-10 rounded-lg bg-navy-900 border-2 border-gold-500 flex items-center justify-center font-black text-gold-400 text-xl tracking-tighter">
                  DT
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-lg sm:text-xl text-navy-900 tracking-wider leading-none">
                    DEEPAK <span className="text-gold-600">TEXTILES</span>
                  </span>
                  <span className="text-[10px] tracking-widest uppercase font-bold text-gray-500 leading-tight mt-0.5">
                    Darbhanga Wholesale Hub
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                  pathname === "/"
                    ? "text-gold-700 bg-gold-50/80 font-bold border-b-2 border-gold-600"
                    : "text-gray-700 hover:text-navy-900 hover:bg-gray-50"
                }`}
              >
                Home
              </Link>

              {/* Animated Desktop Mega Menu Trigger */}
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
              >
                <button
                  onClick={() => setMegaMenuOpen((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                    megaMenuOpen || pathname.startsWith("/categories") || pathname.includes("category=")
                      ? "text-gold-700 bg-gold-50/80 font-bold border-b-2 border-gold-600"
                      : "text-gray-700 hover:text-navy-900 hover:bg-gray-50"
                  }`}
                  aria-expanded={megaMenuOpen}
                >
                  <span>Wholesale Catalogs</span>
                  <motion.div
                    animate={{ rotate: megaMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </motion.div>
                </button>
              </div>

              <Link
                href="/products"
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                  pathname === "/products"
                    ? "text-gold-700 bg-gold-50/80 font-bold border-b-2 border-gold-600"
                    : "text-gray-700 hover:text-navy-900 hover:bg-gray-50"
                }`}
              >
                All Products
              </Link>

              <Link
                href="/about"
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                  pathname === "/about"
                    ? "text-gold-700 bg-gold-50/80 font-bold border-b-2 border-gold-600"
                    : "text-gray-700 hover:text-navy-900 hover:bg-gray-50"
                }`}
              >
                About Us
              </Link>

              <Link
                href="/contact"
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                  pathname === "/contact"
                    ? "text-gold-700 bg-gold-50/80 font-bold border-b-2 border-gold-600"
                    : "text-gray-700 hover:text-navy-900 hover:bg-gray-50"
                }`}
              >
                Contact Us
              </Link>
            </nav>

            {/* Right Side Direct Contact */}
            <div className="flex items-center gap-3">
              {/* WhatsApp Direct Button */}
              <a
                href="https://wa.me/919308066552?text=Hello%20Deepak%20Textiles,%20I%20am%20interested%20in%20wholesale%20catalogs."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm hover:shadow"
              >
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center p-0.5">
                  <WhatsAppIcon className="w-full h-full" color="#25D366" />
                </div>
                <span>WhatsApp Desk</span>
              </a>

              {/* WhatsApp on Mobile */}
              <a
                href="https://wa.me/919308066552?text=Hello%20Deepak%20Textiles,%20I%20am%20interested%20in%20wholesale%20catalogs."
                target="_blank"
                rel="noopener noreferrer"
                className="sm:hidden flex items-center justify-center p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                title="Chat on WhatsApp"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center">
                  <WhatsAppIcon className="w-full h-full" color="#25D366" />
                </div>
              </a>

              {/* Call on Mobile */}
              <a
                href="tel:+919308066552"
                className="sm:hidden flex items-center justify-center p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                title="Call Desk"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Desktop Mega Menu Dropdown */}
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <MegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
        </div>
      </motion.header>

      {/* Mobile Side Drawer Sliding from Left (Matching Reference Screenshot) */}
      <MobileSideDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};
