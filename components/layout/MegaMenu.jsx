"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const megaMenuData = [
  {
    title: "Wholesale Sarees",
    slug: "wholesale-sarees",
    items: [
      { name: "Royal Banarasi Silk Sarees", href: "/products?category=wholesale-sarees&search=Banarasi" },
      { name: "Katan & Tussar Silk Lots", href: "/products?category=wholesale-sarees&search=Katan" },
      { name: "Georgette & Organza Sarees", href: "/products?category=wholesale-sarees&search=Georgette" },
      { name: "Bandhani & Traditional Patola", href: "/products?category=wholesale-sarees&search=Bandhani" },
      { name: "Cotton & Daily Wear Sarees", href: "/products?category=wholesale-sarees&search=Cotton" },
      { name: "Bridal Heavy Zari Sarees", href: "/products?category=wholesale-sarees&search=Bridal" },
    ],
    viewAllHref: "/products?category=wholesale-sarees",
  },
  {
    title: "Dress Materials & Suits",
    slug: "dress-materials",
    items: [
      { name: "Cambric Cotton 3-Piece Sets", href: "/products?category=dress-materials&search=Cotton" },
      { name: "Chanderi Silk Unstitched Suits", href: "/products?category=dress-materials&search=Chanderi" },
      { name: "Party Wear Heavy Dupatta Sets", href: "/products?category=dress-materials&search=Party" },
      { name: "Rayon & Printed Salwar Suits", href: "/products?category=dress-materials&search=Rayon" },
      { name: "Jaipuri & Bandhej Dress Lots", href: "/products?category=dress-materials&search=Bandhej" },
      { name: "Semi-Stitched Punjabi Suits", href: "/products?category=dress-materials&search=Punjabi" },
    ],
    viewAllHref: "/products?category=dress-materials",
  },
  {
    title: "Kurtis & Ethnic Sets",
    slug: "kurti-sets",
    items: [
      { name: "Kurti + Pant + Dupatta 3-Piece", href: "/products?category=kurti-sets&search=Set" },
      { name: "Anarkali Gowns & Festive Kurtis", href: "/products?category=kurti-sets&search=Anarkali" },
      { name: "Straight Cut Daily Wear Kurtis", href: "/products?category=kurti-sets&search=Straight" },
      { name: "Bridal & Semi-Stitched Lehengas", href: "/products?category=lehenga-choli" },
      { name: "Rayon & Slub Casual Kurtis", href: "/products?category=kurti-sets&search=Rayon" },
      { name: "Crop Top & Skirt Festive Lots", href: "/products?category=lehenga-choli&search=Crop" },
    ],
    viewAllHref: "/products?category=kurti-sets",
  },
  {
    title: "Running Fabrics (Thaan)",
    slug: "fabrics-running-material",
    items: [
      { name: "100% Pure Cambric Cotton Thaan", href: "/products?category=fabrics-running-material&search=Cotton" },
      { name: "Rayon 14Kg / 16Kg Fabric Rolls", href: "/products?category=fabrics-running-material&search=Rayon" },
      { name: "Georgette & Viscose Fabric", href: "/products?category=fabrics-running-material&search=Georgette" },
      { name: "Suiting & Shirting Thaan Lots", href: "/products?category=fabrics-running-material&search=Suiting" },
      { name: "Chiffon & Organza Dupatta Rolls", href: "/products?category=fabrics-running-material&search=Organza" },
      { name: "Dyeable Pure Fabric Materials", href: "/products?category=fabrics-running-material&search=Dyeable" },
    ],
    viewAllHref: "/products?category=fabrics-running-material",
  },
];

const containerVariants = {
  hidden: {
    opacity: 0,
    y: -8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.24,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: {
      duration: 0.16,
      ease: "easeInOut",
    },
  },
};

const columnVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: "easeOut" },
  },
};

export const MegaMenu = ({ isOpen, onClose, bannerImage }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mega-menu-dropdown"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute top-full left-0 w-full bg-white border-t border-b border-gray-200 z-50 overflow-hidden"
          onMouseEnter={(e) => e.stopPropagation()}
        >
          {/* Subtle Top Gold Accent Line */}
          <div className="h-0.5 w-full bg-gradient-to-r from-navy-900 via-gold-500 to-navy-900" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* 4 Main Wholesale Category Columns (9 cols on lg) */}
              <div className="md:col-span-8 lg:col-span-9 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {megaMenuData.map((section) => {
                  return (
                    <motion.div
                      key={section.title}
                      variants={columnVariants}
                      className="space-y-3.5"
                    >
                      {/* Section Header */}
                      <div className="border-b border-gray-100 pb-2">
                        <h4 className="font-heading font-extrabold text-sm text-navy-950 uppercase tracking-wide">
                          {section.title}
                        </h4>
                      </div>

                      {/* Section Sub-items */}
                      <ul className="space-y-2">
                        {section.items.map((item) => (
                          <motion.li
                            key={item.name}
                            whileHover={{ x: 4 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          >
                            <Link
                              href={item.href}
                              onClick={onClose}
                              className="text-xs text-gray-600 hover:text-gold-700 font-medium transition-colors flex items-center justify-between group"
                            >
                              <span>{item.name}</span>
                              <span className="opacity-0 group-hover:opacity-100 text-gold-600 transition-opacity text-xs">
                                →
                              </span>
                            </Link>
                          </motion.li>
                        ))}
                      </ul>

                      {/* View All Section Link */}
                      <div className="pt-1.5">
                        <Link
                          href={section.viewAllHref}
                          onClick={onClose}
                          className="inline-flex items-center gap-1 text-[11px] font-extrabold text-navy-900 hover:text-gold-600 uppercase tracking-wider transition-colors"
                        >
                          <span>Explore All</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* 1 Right Banner Card: Mill Direct Advantage Showcase (3-4 cols) */}
              <motion.div
                variants={columnVariants}
                className="md:col-span-4 lg:col-span-3 bg-white rounded-xl p-5 border border-gray-200 flex flex-col justify-between hover:border-gold-400 transition-colors"
              >
                <div>
                  {/* Top Image Showcase */}
                  <div className="relative w-full  rounded-lg overflow-hidden ">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        bannerImage ||
                        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                      }
                      alt="Surat Wholesale Saree Collection"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                   
                  </div>

                </div>

             
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
