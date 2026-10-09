"use client";

import React from "react";
import Link from "next/link";
import { Phone, MessageCircle, Mail, MapPin, ShieldCheck, Truck, Clock, Award } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-navy-500 text-gray-300 pt-16 pb-12 border-t border-navy-600">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Top 4 Trust Pillars for Wholesale Buyers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-navy-600">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded bg-navy-600 text-gold-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Direct Mill Rates</h4>
              <p className="text-xs text-gray-300 mt-1">Zero middlemen commission. Get authentic factory pricing on bulk lots.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded bg-navy-600 text-gold-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Pan-India Transport</h4>
              <p className="text-xs text-gray-300 mt-1">Fast dispatch via V-Trans, TCI, SafeExpress and local Surat transport hubs.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded bg-navy-600 text-gold-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">GST Compliant</h4>
              <p className="text-xs text-gray-300 mt-1">100% genuine tax invoices with HSN codes for hassle-free business claiming.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded bg-navy-600 text-gold-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Instant WhatsApp Support</h4>
              <p className="text-xs text-gray-300 mt-1">Get catalog PDFs, video calls of fabric lots, and instant quotes.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-b border-navy-600">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded bg-gold-500 flex items-center justify-center font-black text-navy-500 text-lg">
                DT
              </div>
              <span className="font-extrabold text-lg text-white tracking-wider">
                DEEPAK <span className="text-gold-400">TEXTILES</span>
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Leading Surat-based manufacturer and wholesale supplier of premium Sarees, Salwar Suits, Kurti Sets, and unstitched dress materials. Serving over 5,000+ retail stores across India.
            </p>
            <div className="text-xs text-gold-400 font-medium">
              GSTIN: 24AAACD1234F1Z5 • Surat, Gujarat
            </div>
          </div>

          {/* Wholesale Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Wholesale Catalogs
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products?category=wholesale-sarees" className="hover:text-gold-400 transition-colors">
                  Wholesale Sarees (Silk, Georgette, Cotton)
                </Link>
              </li>
              <li>
                <Link href="/products?category=dress-materials" className="hover:text-gold-400 transition-colors">
                  Salwar Suits & Dress Materials
                </Link>
              </li>
              <li>
                <Link href="/products?category=kurti-sets" className="hover:text-gold-400 transition-colors">
                  Designer Kurti & Pant Sets
                </Link>
              </li>
              <li>
                <Link href="/products?category=lehenga-choli" className="hover:text-gold-400 transition-colors">
                  Bridal & Semi-Stitched Lehengas
                </Link>
              </li>
              <li>
                <Link href="/products?category=fabrics-running-material" className="hover:text-gold-400 transition-colors">
                  Running Fabrics & Thaan Material
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products" className="hover:text-gold-400 transition-colors">
                  All Wholesale Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-gold-400 transition-colors">
                  Browse by Category
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold-400 transition-colors">
                  About Deepak Textiles
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-400 transition-colors">
                  Contact & Mill Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Sales Desk Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Surat Wholesale Desk
            </h4>
            <div className="flex items-start gap-2.5 text-xs">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <span>
                Shop 204-206, 2nd Floor, Radharaman Textile Market, Ring Road, Surat, Gujarat - 395002
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <Phone className="w-4 h-4 text-gold-400 shrink-0" />
              <a href="tel:+919825144520" className="hover:text-gold-400">
                +91 98251 44520 / +91 94268 11200
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <a
                href="https://wa.me/919825144520?text=Hello%20Deepak%20Textiles,%20please%20send%20wholesale%20catalogs."
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline"
              >
                +91 98251 44520 (WhatsApp Order Desk)
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <Mail className="w-4 h-4 text-gold-400 shrink-0" />
              <a href="mailto:info@deepaktextiles.com" className="hover:text-gold-400">
                info@deepaktextiles.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-300">
          <p>© {new Date().getFullYear()} Deepak Textiles. All Rights Reserved. Wholesale B2B Portal.</p>
          <div className="flex items-center gap-4">
            <span>Minimum Order: Wholesale Lots Only</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
