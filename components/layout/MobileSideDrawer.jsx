"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  ChevronDown,
  Sparkles,
  Phone,
  MessageCircle,
  Star,
  MapPin,
  Truck,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { categoriesApi, settingsApi } from "../../services/api";

export const MobileSideDrawer = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const [openSections, setOpenSections] = useState({
    categories: true, // Default open for quick access
    offers: false,
    whatsNew: false,
    about: false,
  });

  // Prevent background body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Fetch dynamic categories and settings from backend
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchDrawerData = async () => {
      try {
        const [catRes, setRes] = await Promise.allSettled([
          categoriesApi.getAll(),
          settingsApi.get(),
        ]);

        if (isMounted && catRes.status === "fulfilled" && catRes.value?.categories) {
          setCategories(catRes.value.categories);
        }

        if (isMounted && setRes.status === "fulfilled") {
          const s = setRes.value?.settings || setRes.value?.setting;
          if (s) setSettings(s);
        }
      } catch (err) {
        console.error("Error fetching drawer data from backend:", err);
      }
    };

    fetchDrawerData();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const whatsappNumber = (settings?.whatsapp || settings?.whatsappNumber || "9825144520").replace(/[^0-9]/g, "");
  const phoneNumber = settings?.phone || "+91 98251 44520";

  // Fallback categories if database has not returned yet
  const displayCategories = categories.length > 0 ? categories : [
    { name: "Wholesale Sarees", slug: "wholesale-sarees" },
    { name: "Salwar Suits & Dress Materials", slug: "dress-materials" },
    { name: "Kurti Sets & Anarkali", slug: "kurti-sets" },
    { name: "Lehenga Choli & Bridal Sets", slug: "lehenga-choli" },
    { name: "Running Fabric Rolls (Thaan)", slug: "fabrics-running-material" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* 1. Backdrop Overlay with Smooth Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
            aria-hidden="true"
          />

          {/* 2. Side Drawer Sliding from Left (Matching User's Reference Screenshot) */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative z-50 w-[86vw] max-w-sm sm:max-w-md h-full bg-white flex flex-col shadow-2xl select-none overflow-hidden"
          >
            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {/* TOP PROMOTIONAL BANNER (Directly matching reference image layout) */}
              <div className="relative w-full aspect-[16/9] min-h-[170px] bg-gradient-to-br from-[#2a1145] via-[#481c6b] to-[#1c082e] overflow-hidden flex flex-col justify-between p-4 text-white">
                {/* Background overlay image with fashion model aesthetic */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    settings?.bannerImage ||
                    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                  }
                  alt="Deepak Textiles Surat Wholesale"
                  className="absolute inset-0 w-full h-full object-cover object-top opacity-35 mix-blend-overlay"
                />

                {/* Top Promo Pills (like "Get the App / Use Code") */}
                <div className="relative z-10 space-y-1.5">
                  <span className="text-[11px] font-bold tracking-wider text-purple-200 uppercase drop-shadow-sm">
                    Surat Mill Direct
                  </span>
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-extrabold uppercase tracking-wide">
                      Wholesale B2B Portal
                    </span>
                  </div>
                </div>

                {/* Rating & Downloads Badge (like ⭐ 4.7 1.5+ Downloads in reference) */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-navy-950 text-[10px] font-black shadow-sm">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    <span>4.9</span>
                    <span className="text-gray-500 font-semibold">• 5,000+ Retailers</span>
                  </div>

                  <span className="font-heading font-black italic text-xs text-gold-300 tracking-wide drop-shadow-sm">
                    Deepak Textiles
                  </span>
                </div>
              </div>

              {/* USER / LOG IN / WHOLESALE DESK HEADER (Matching reference image) */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-700 text-white flex items-center justify-center shadow-xs">
                    <User className="w-5 h-5 text-purple-100" />
                  </div>
                  <span className="font-heading font-black text-sm tracking-widest text-navy-950 uppercase">
                    WHOLESALE DESK
                  </span>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full text-gray-700 hover:text-navy-950 hover:bg-gray-100 transition-colors"
                  aria-label="Close Menu"
                >
                  <X className="w-6 h-6 stroke-[2.2]" />
                </button>
              </div>

              {/* MENU ITEMS LIST (Exact uppercase style with dividers like screenshot) */}
              <nav className="divide-y divide-gray-100 text-xs font-heading font-black tracking-widest text-navy-950 uppercase">
                {/* 1. Highlight Link: FESTIVE SALE */}
                <Link
                  href="/products?category=wholesale-sarees"
                  onClick={onClose}
                  className="block px-5 py-4 hover:bg-gray-50 hover:text-gold-700 transition-colors"
                >
                  <span>FESTIVE & BRIDAL SPECIAL 50-70% OFF</span>
                </Link>

                {/* 2. Highlight Link: WEDDING CELEBRATION */}
                <Link
                  href="/products"
                  onClick={onClose}
                  className="block px-5 py-4 hover:bg-gray-50 hover:text-gold-700 transition-colors"
                >
                  <span>UTSAV: THE WEDDING CELEBRATION</span>
                </Link>

                {/* 3. Highlight Link: SUITS & DRESS MATERIALS */}
                <Link
                  href="/products?category=dress-materials"
                  onClick={onClose}
                  className="block px-5 py-4 hover:bg-gray-50 hover:text-gold-700 transition-colors"
                >
                  <span>DIRECT MILL SALWAR SUITS</span>
                </Link>

                {/* 4. Highlight Link: MENS & RUNNING FABRICS */}
                <Link
                  href="/products?category=fabrics-running-material"
                  onClick={onClose}
                  className="block px-5 py-4 hover:bg-gray-50 hover:text-gold-700 transition-colors"
                >
                  <span>RUNNING FABRIC ROLLS (THAAN)</span>
                </Link>

                {/* 5. ACCORDION: SHOP BY CATEGORIES (Loaded from Backend Database) */}
                <div>
                  <button
                    onClick={() => toggleSection("categories")}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 text-left transition-colors"
                  >
                    <span>SHOP BY CATEGORIES</span>
                    <motion.div
                      animate={{ rotate: openSections.categories ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openSections.categories && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="bg-gray-50/70 border-t border-gray-100 overflow-hidden divide-y divide-gray-100/60"
                      >
                        {displayCategories.map((cat) => (
                          <Link
                            key={cat._id || cat.slug}
                            href={`/products?category=${cat.slug}`}
                            onClick={onClose}
                            className="block px-7 py-3 text-[11px] font-bold text-gray-700 hover:text-navy-950 hover:bg-white tracking-wider flex items-center justify-between transition-colors"
                          >
                            <span>{cat.name}</span>
                            <ArrowRight className="w-3 h-3 text-gold-600 opacity-70" />
                          </Link>
                        ))}

                        <Link
                          href="/categories"
                          onClick={onClose}
                          className="block px-7 py-3 text-[11px] font-extrabold text-gold-700 hover:text-gold-800 tracking-wider flex items-center justify-between transition-colors"
                        >
                          <span>VIEW ALL CATEGORIES</span>
                          <span>→</span>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 6. ACCORDION: SPECIAL OFFERS */}
                <div>
                  <button
                    onClick={() => toggleSection("offers")}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 text-left transition-colors"
                  >
                    <span>SPECIAL WHOLESALE OFFERS</span>
                    <motion.div
                      animate={{ rotate: openSections.offers ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openSections.offers && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="bg-gray-50/70 border-t border-gray-100 px-7 py-3 space-y-2 text-[11px] font-bold text-gray-700 tracking-wider overflow-hidden"
                      >
                        <div className="py-1">★ Direct Factory Mill Rates (Zero Brokerage)</div>
                        <div className="py-1">★ Minimum Order: 10 to 20 Pcs Lots</div>
                        <div className="py-1">★ Volume Parcel Discount Available</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 7. ACCORDION: WHAT'S NEW */}
                <div>
                  <button
                    onClick={() => toggleSection("whatsNew")}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 text-left transition-colors"
                  >
                    <span>WHAT&apos;S NEW IN SURAT</span>
                    <motion.div
                      animate={{ rotate: openSections.whatsNew ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openSections.whatsNew && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="bg-gray-50/70 border-t border-gray-100 px-7 py-3 space-y-2 text-[11px] font-bold text-gray-700 tracking-wider overflow-hidden"
                      >
                        <Link href="/products" onClick={onClose} className="block py-1 hover:text-gold-700">
                          • Durga Puja & Wedding 2026 Collection
                        </Link>
                        <Link href="/products?category=kurti-sets" onClick={onClose} className="block py-1 hover:text-gold-700">
                          • Trending 3-Piece Kurti Sets
                        </Link>
                        <Link href="/products?category=wholesale-sarees" onClick={onClose} className="block py-1 hover:text-gold-700">
                          • Katan & Banarasi Silk Catalog
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 8. ACCORDION: WORLD OF DEEPAK TEXTILES */}
                <div>
                  <button
                    onClick={() => toggleSection("about")}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 text-left transition-colors"
                  >
                    <span>WORLD OF DEEPAK TEXTILES</span>
                    <motion.div
                      animate={{ rotate: openSections.about ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openSections.about && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="bg-gray-50/70 border-t border-gray-100 px-7 py-3 space-y-2 text-[11px] font-bold text-gray-700 tracking-wider overflow-hidden"
                      >
                        <Link href="/about" onClick={onClose} className="block py-1 hover:text-gold-700">
                          • About Our Manufacturing & Mills
                        </Link>
                        <Link href="/contact" onClick={onClose} className="block py-1 hover:text-gold-700">
                          • Surat Mill Location & Sales Desk
                        </Link>
                        <div className="py-1 text-gray-500 font-semibold lowercase">
                          gst: 24aaacd1234f1z5 (surat)
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </nav>

              {/* WHOLESALE TRUST PILLARS BAR */}
              <div className="p-5 bg-gray-50 border-t border-gray-200 space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gold-600 shrink-0" />
                  <span className="font-semibold text-[11px]">Pan-India Safe Parcel Booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-[11px]">100% Factory Mill Quality Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-navy-900 shrink-0" />
                  <span className="font-semibold text-[11px]">Radharaman Market, Ring Road, Surat</span>
                </div>
              </div>
            </div>

            {/* STICKY BOTTOM QUICK ACTION BUTTONS */}
            <div className="p-4 bg-white border-t border-gray-200 grid grid-cols-2 gap-2.5 shrink-0">
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hello%20Deepak%20Textiles,%20please%20send%20wholesale%20catalogs.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs tracking-wider uppercase transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`tel:${phoneNumber}`}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-extrabold text-xs tracking-wider uppercase transition-colors"
              >
                <Phone className="w-4 h-4 text-gold-400" />
                <span>Call Mill</span>
              </a>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
