"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MessageCircle, Lock, Menu, X, ShieldCheck } from "lucide-react";
import { useAdmin } from "../../lib/context/AdminContext";

export const Header = () => {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <>
      {/* Top Surat B2B Bar */}
      <div className="bg-navy-900 text-gray-300 text-xs py-2 px-4 border-b border-navy-800 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-gold-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Surat Wholesale Textile Manufacturer & Mill Supplier (Gujarat)
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-300">Direct Mill Rates • GST Invoices • Pan-India Transport</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:+919825144520"
              className="flex items-center gap-1.5 text-gray-200 hover:text-gold-400 transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              <span>Sales Desk: +91 98251 44520</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky White Header */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-10 h-10 rounded-lg bg-navy-900 border-2 border-gold-500 flex items-center justify-center font-black text-gold-400 text-xl tracking-tighter shadow-sm">
                DT
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl text-navy-900 tracking-wider leading-none">
                  DEEPAK <span className="text-gold-600">TEXTILES</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase font-bold text-gray-500 leading-tight mt-0.5">
                  Surat Wholesale Hub
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                      isActive
                        ? "text-gold-700 bg-gold-50/80 font-bold border-b-2 border-gold-600"
                        : "text-gray-700 hover:text-navy-900 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Direct Contact & Admin Login */}
            <div className="flex items-center gap-3">
              {/* WhatsApp Direct Button */}
              <a
                href="https://wa.me/919825144520?text=Hello%20Deepak%20Textiles,%20I%20am%20interested%20in%20wholesale%20catalogs."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all hover:shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Desk</span>
              </a>

              {/* Admin Portal Button */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/admin"
                    className="px-3 py-1.5 rounded-lg bg-navy-900 text-gold-400 text-xs font-bold hover:bg-navy-800 transition-colors"
                  >
                    Admin Panel
                  </Link>
                  <button
                    onClick={logout}
                    className="text-xs text-gray-500 hover:text-red-600 p-1 font-semibold"
                    title="Sign Out"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1 text-xs text-gray-700 hover:text-navy-900 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gold-500 hover:bg-gold-50/30 transition-all font-semibold"
                  title="Admin Login"
                >
                  <Lock className="w-3.5 h-3.5 text-gold-600" />
                  <span>Admin</span>
                </Link>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-700 hover:text-navy-900 p-1.5 rounded-md hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-4 pb-2 border-t border-gray-200 mt-3 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded text-sm font-semibold text-gray-800 hover:bg-gray-100"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-2 border-t border-gray-200 flex flex-col gap-2">
                <a
                  href="https://wa.me/919825144520?text=Hello%20Deepak%20Textiles,%20I%20am%20interested%20in%20wholesale%20catalogs."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href="tel:+919825144520"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-navy-900 text-xs font-bold"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call +91 98251 44520</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};
