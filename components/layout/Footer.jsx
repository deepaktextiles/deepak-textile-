"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { WhatsAppIcon } from "../ui/WhatsAppIcon";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariants}
      className="bg-white text-gray-900 pt-12 pb-10 border-t border-gray-200 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Links */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-gray-200"
        >
          {/* Brand Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center shrink-0 shadow-xs">
                <Image
                  src="/images/icons/logo.jpeg"
                  alt="Deepak Textiles"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <span className="font-extrabold text-lg text-gray-950 tracking-wider">
                DEEPAK <span className="text-gold-600">TEXTILES</span>
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Leading Darbhanga-based clothing & fabric wholesaler established in 2001. Supplying bulk Designer Sarees, Suit Pieces & Salwar Suits, Shirting & Suiting, and Lehenga & Readymade collections for retailers, resellers, and boutique owners across Bihar & India.
            </p>
            <div className="text-xs text-gold-700 font-bold">
              Kadirabad Road, Naka No. 2, Darbhanga, Bihar – 846004
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-900">
              <span className="font-bold text-amber-500 flex items-center gap-0.5">
                4.7 ★★★★★
              </span>
              <span className="text-gray-500">Google Verified Wholesaler</span>
              <span className="text-gray-300">|</span>
              <span className="text-[11px] text-gray-600 font-medium">1,480+ Google Reviews</span>
            </div>
          </motion.div>

          {/* Wholesale Categories */}
          <motion.div variants={itemVariants}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">
              Wholesale Catalogs
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { name: "Wholesale Sarees (Silk, Georgette, Cotton)", href: "/products?category=wholesale-sarees" },
                { name: "Salwar Suits & Dress Materials", href: "/products?category=dress-materials" },
                { name: "Designer Kurti & Pant Sets", href: "/products?category=kurti-sets" },
                { name: "Bridal & Semi-Stitched Lehengas", href: "/products?category=lehenga-choli" },
                { name: "Running Fabrics & Thaan Material", href: "/products?category=fabrics-running-material" },
              ].map((cat, idx) => (
                <li key={idx}>
                  <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 350, damping: 25 }}>
                    <Link
                      href={cat.href}
                      className="text-gray-600 hover:text-navy-950 font-medium transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { name: "All Wholesale Products", href: "/products" },
                { name: "Browse by Category", href: "/categories" },
                { name: "About Deepak Textiles", href: "/about" },
                { name: "Contact & Mill Location", href: "/contact" },
              ].map((link, idx) => (
                <li key={idx}>
                  <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 350, damping: 25 }}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-navy-950 font-medium transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Direct Sales Desk Contact */}
          <motion.div variants={itemVariants} className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">
              Darbhanga Wholesale Desk
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-gray-700">
              <MapPin className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
              <span>
                5V7R+V63, Kadirabad Road, Near Naka No. 2, Banglagarh Colony, Darbhanga, Bihar – 846004
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-700">
              <Phone className="w-4 h-4 text-gold-600 shrink-0" />
              <a href="tel:+919308066552" className="hover:text-navy-950 font-medium transition-colors">
                +91 93080 66552 / +91 85446 63335
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center shrink-0">
                <WhatsAppIcon className="w-full h-full" color="#25D366" />
              </div>
              <a
                href="https://wa.me/919308066552?text=Hello%20Deepak%20Textiles,%20please%20send%20wholesale%20catalogs."
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-semibold hover:underline"
              >
                +91 93080 66552 (WhatsApp Wholesale)
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-700">
              <Mail className="w-4 h-4 text-gold-600 shrink-0" />
              <a href="mailto:deepaktextiles7@gmail.com" className="hover:text-navy-950 font-medium transition-colors">
                deepaktextiles7@gmail.com
              </a>
            </div>
            <div className="text-[11px] text-gray-500 pt-1">
              Mon–Sat: 10 AM – 9 PM • Sun: 10 AM – 4 PM
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500"
        >
          <p>© {currentYear} Deepak Textiles. All Rights Reserved. Darbhanga Wholesale B2B Portal.</p>
          <div className="flex items-center gap-4 text-gray-600 font-medium">
            <span>Wholesale & Bulk Orders Only</span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};
