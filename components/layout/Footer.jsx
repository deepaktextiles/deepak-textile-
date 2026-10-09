"use client";

import React from "react";
import Link from "next/link";
import { Phone, MessageCircle, Mail, MapPin, ShieldCheck, Truck, Clock, Award, Star } from "lucide-react";
import { motion } from "framer-motion";

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
      className="bg-white text-gray-900 pt-14 pb-10 border-t border-gray-200 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 4 Trust Pillars for Wholesale Buyers with Framer Motion */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-gray-200"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -3 }}
            className="flex items-start gap-3.5 p-3.5 rounded-xl bg-gray-50/80 border border-gray-200/80 transition-colors"
          >
            <div className="p-2.5 rounded-lg bg-navy-950 text-gold-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Direct Mill Rates
              </h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Zero middlemen commission. Get authentic factory pricing on bulk lots.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -3 }}
            className="flex items-start gap-3.5 p-3.5 rounded-xl bg-gray-50/80 border border-gray-200/80 transition-colors"
          >
            <div className="p-2.5 rounded-lg bg-navy-950 text-gold-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Pan-India Transport
              </h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Fast dispatch via V-Trans, TCI, SafeExpress and Surat transport hubs.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -3 }}
            className="flex items-start gap-3.5 p-3.5 rounded-xl bg-gray-50/80 border border-gray-200/80 transition-colors"
          >
            <div className="p-2.5 rounded-lg bg-navy-950 text-gold-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                GST Compliant
              </h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                100% genuine tax invoices with HSN codes for hassle-free business claiming.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -3 }}
            className="flex items-start gap-3.5 p-3.5 rounded-xl bg-gray-50/80 border border-gray-200/80 transition-colors"
          >
            <div className="p-2.5 rounded-lg bg-navy-950 text-gold-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Instant WhatsApp Support
              </h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Get catalog PDFs, video calls of fabric lots, and instant quotes.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Footer Links */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-b border-gray-200"
        >
          {/* Brand Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-navy-950 border border-gold-500 flex items-center justify-center font-black text-gold-400 text-lg">
                DT
              </div>
              <span className="font-extrabold text-lg text-gray-950 tracking-wider">
                DEEPAK <span className="text-gold-600">TEXTILES</span>
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Leading Surat-based manufacturer and wholesale supplier of premium Sarees, Salwar Suits, Kurti Sets, and unstitched dress materials. Serving over 5,000+ retail stores across India.
            </p>
            <div className="text-xs text-gold-700 font-bold">
              GSTIN: 24AAACD1234F1Z5 • Surat, Gujarat
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-900">
              <span className="font-bold text-amber-500 flex items-center gap-0.5">
                4.9 ★★★★★
              </span>
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
              Surat Wholesale Desk
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-gray-700">
              <MapPin className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
              <span>
                Shop 204-206, 2nd Floor, Radharaman Textile Market, Ring Road, Surat, Gujarat - 395002
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-700">
              <Phone className="w-4 h-4 text-gold-600 shrink-0" />
              <a href="tel:+919825144520" className="hover:text-navy-950 font-medium transition-colors">
                +91 98251 44520 / +91 94268 11200
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <a
                href="https://wa.me/919825144520?text=Hello%20Deepak%20Textiles,%20please%20send%20wholesale%20catalogs."
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-semibold hover:underline"
              >
                +91 98251 44520 (WhatsApp Order Desk)
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-700">
              <Mail className="w-4 h-4 text-gold-600 shrink-0" />
              <a href="mailto:info@deepaktextiles.com" className="hover:text-navy-950 font-medium transition-colors">
                info@deepaktextiles.com
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500"
        >
          <p>© {currentYear} Deepak Textiles. All Rights Reserved. Surat Wholesale B2B Portal.</p>
          <div className="flex items-center gap-4 text-gray-600 font-medium">
            <span>Minimum Order: Wholesale Lots Only</span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};
