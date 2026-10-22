"use client";

import React from "react";
import Link from "next/link";
import { Menu, ExternalLink, Shield, LogOut } from "lucide-react";
import { useAdmin } from "../../lib/context/AdminContext";
import { useAdminTab } from "../../lib/context/AdminTabContext";

export function AdminHeader({ onOpenMobile }) {
  const { admin, logout } = useAdmin();
  const { activeTab } = useAdminTab();

  const getTitle = () => {
    switch (activeTab) {
      case "products":
        return "Wholesale Product Catalog";
      case "categories":
        return "Categories & Collections";
      case "enquiries":
        return "Buyer Quote Enquiries";
      case "banner":
      default:
        return "Hero Banner & Store Settings";
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-border px-4 sm:px-6 lg:px-8 py-3.5 shadow-sm flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-navy-900 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-semibold text-txt-secondary">
            <span>Admin</span>
            <span>/</span>
            <span className="text-amber-600 font-bold capitalize">{activeTab}</span>
          </div>
          <h1 className="text-base sm:text-lg font-heading font-extrabold text-navy-500 leading-tight">
            {getTitle()}
          </h1>
        </div>
      </div>

      {/* Right: Quick actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Live B2B Portal</span>
        </div>

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-sitebg hover:bg-slate-100 text-navy-500 text-xs font-bold transition-colors"
        >
          <span>View Store</span>
          <ExternalLink className="w-3.5 h-3.5 text-txt-secondary" />
        </Link>

        <button
          onClick={() => {
            if (window.confirm("Sign out of admin session?")) {
              logout();
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
