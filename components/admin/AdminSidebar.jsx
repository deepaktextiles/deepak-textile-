"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Inbox,
  Image as ImageIcon,
  ExternalLink,
  LogOut,
  ShieldCheck,
  X,
  ChevronRight,
  Store,
  Star,
} from "lucide-react";
import { useAdmin } from "../../lib/context/AdminContext";
import { useAdminTab } from "../../lib/context/AdminTabContext";

export function AdminSidebar({ mobileOpen, onCloseMobile }) {
  const pathname = usePathname();
  const { admin, logout } = useAdmin();
  const { activeTab, setActiveTab } = useAdminTab();

  const navItems = [
    {
      id: "banner",
      label: "Hero & Trending Banners",
      icon: ImageIcon,
      description: "Homepage carousels & sliders",
    },
    {
      id: "products",
      label: "Wholesale Products",
      icon: Package,
      description: "Manage pricing, MOQ & catalog",
    },
    {
      id: "categories",
      label: "Categories",
      icon: Layers,
      description: "Sarees, Suits, Kurtis, Fabrics",
    },
    {
      id: "enquiries",
      label: "Buyer Inquiries",
      icon: Inbox,
      description: "Wholesale quote requests",
    },
    {
      id: "reviews",
      label: "Customer Reviews",
      icon: Star,
      description: "Google reviews & testimonials",
    },
    {
      id: "settings",
      label: "Showroom & Settings",
      icon: Store,
      description: "Phone, WhatsApp, GSTIN, Address",
    },
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out of the Admin Portal?")) {
      logout();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0B1528] text-slate-100 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <Link
          href="/admin"
          onClick={() => {
            setActiveTab("banner");
            if (onCloseMobile) onCloseMobile();
          }}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-1 border border-slate-700/60 shadow-lg shadow-black/20 group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
            <Image
              src="/images/icons/logo.jpeg"
              alt="Deepak Textiles"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="font-heading font-extrabold text-sm sm:text-base text-white tracking-wide block leading-tight">
              Deepak Textiles
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400/90 block">
              Wholesale Admin
            </span>
          </div>
        </Link>

        {/* Mobile close button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Live Store Pill Indicator */}
      <div className="px-4 pt-4 pb-2">
        <div className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium text-[11px]">System Online</span>
          </div>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 group"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="px-3 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Management
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === "/admin" && activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`w-full text-left flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? "bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-300 border border-amber-500/30 shadow-sm"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-amber-400 text-navy-950 font-bold shadow-md shadow-amber-500/20"
                      : "bg-slate-800/90 text-slate-400 group-hover:text-amber-400 group-hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold leading-tight">{item.label}</span>
                  <span className="text-[10px] font-normal text-slate-400 group-hover:text-slate-300 block">
                    {item.description}
                  </span>
                </div>
              </div>
              <ChevronRight
                className={`w-4 h-4 transition-transform ${
                  isActive ? "text-amber-400 translate-x-0.5" : "text-slate-600 group-hover:text-slate-400"
                }`}
              />
            </button>
          );
        })}

        <div className="pt-4 px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Quick Links
        </div>

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800/90 text-slate-400 group-hover:text-amber-400">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-bold">Wholesale Catalog</span>
              <span className="text-[10px] font-normal text-slate-400">Buyer storefront</span>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
        </Link>
      </div>

      {/* Admin User Profile & Logout */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 text-navy-950 font-black text-sm flex items-center justify-center shrink-0">
            {admin?.name ? admin.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-white truncate block">
                {admin?.name || "Super Admin"}
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </div>
            <span className="text-[10px] text-slate-400 truncate block">
              {admin?.email || "admin@deepaktextiles.com"}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/50 border border-red-900/40 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 shrink-0 h-screen sticky top-0 border-r border-slate-800 z-30 shadow-xl">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-10 transition-transform">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
