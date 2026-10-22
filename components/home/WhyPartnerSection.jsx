"use client";

import React from "react";
import Link from "next/link";
import {
  BadgePercent,
  Truck,
  Video,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  PhoneCall,
} from "lucide-react";

export const WhyPartnerSection = ({ whatsappNumber = "919308066552" }) => {
  const features = [
    {
      step: "01",
      badge: "Factory-To-Store",
      title: "Factory Mill Direct Rates",
      icon: BadgePercent,
      accentColor: "from-red-600 to-red-800",
      iconBg: "bg-[#C00000] text-white",
      description:
        "By cutting out commission agents, middlemen, and multi-tier margins, you receive rock-bottom Surat mill rates directly from weaving looms for higher retail profit.",
      highlights: [
        "Zero broker commissions",
        "Direct loom-gate pricing",
        "Full GST billing & invoice",
      ],
      actionText: "View Wholesale Rates",
      actionLink: "/products",
    },
    {
      step: "02",
      badge: "Pan-India Logistics",
      title: "High-Volume Stock Ready for Dispatch",
      icon: Truck,
      accentColor: "from-navy-800 to-navy-950",
      iconBg: "bg-navy-900 text-amber-400",
      description:
        "Massive ready inventory across Sarees, Dress Materials, Kurtis, and Fabrics. Daily parcel packaging and tie-ups with leading transport carriers guarantee rapid doorstep delivery.",
      highlights: [
        "10,000+ ready catalog lots",
        "Daily transport booking across Bihar & India",
        "Waterproof industrial bale packing",
      ],
      actionText: "Explore Bulk Catalog",
      actionLink: "/categories",
    },
    {
      step: "03",
      badge: "Virtual Sourcing Desk",
      title: "WhatsApp Video Calling & Samples",
      icon: Video,
      accentColor: "from-emerald-500 to-teal-700",
      iconBg: "bg-emerald-600 text-white",
      description:
        "Cannot travel to Surat? Book a 1-on-1 WhatsApp video appointment to inspect fabric hand-feel, border zari work, drape, and color variety live with our sales managers.",
      highlights: [
        "Live 1-on-1 video inspection",
        "Direct fabric sample dispatch",
        "Instant catalog PDF on phone",
      ],
      actionText: "Book Video Call",
      actionLink: `https://wa.me/${whatsappNumber}?text=Hello%20Deepak%20Textiles,%20I%20want%20to%20book%20a%20WhatsApp%20video%20call%20to%20inspect%20wholesale%20stock.`,
      isExternal: true,
    },
  ];

  return (
    <section className="relative py-12 sm:py-20 bg-gradient-to-b from-white via-slate-50/70 to-white border-y border-slate-200/80 overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-navy-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-900 text-xs font-bold uppercase tracking-widest mb-3.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Why Retailers Choose Deepak Textiles</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-navy-950 tracking-tight leading-tight">
            Direct Textile Sourcing from Surat
          </h2>

          <div className="w-20 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 mx-auto mt-3.5 rounded-full shadow-sm" />

          <p className="text-xs sm:text-base text-slate-600 mt-4 leading-relaxed font-normal">
            Whether you operate a retail showroom, boutique, garment wholesale counter, or online brand, we supply high-demand designer lots at unbeatable factory mill margins.
          </p>
        </div>

        {/* 3 Modern Luxury Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.step}
                className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 hover:border-amber-400 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Large Subtle Watermark Step Number */}
                <span className="absolute top-4 right-5 text-6xl sm:text-7xl font-black text-slate-100/90 font-heading select-none group-hover:text-amber-100/60 transition-colors pointer-events-none">
                  {feature.step}
                </span>

                <div>
                  {/* Top: Icon + Badge */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div
                      className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>

                    <span className="relative z-10 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 group-hover:border-amber-300 group-hover:bg-amber-50 group-hover:text-amber-900 transition-colors">
                      {feature.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl text-navy-950 mb-2.5 group-hover:text-navy-900 leading-snug">
                    {feature.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-100 mb-6">
                    {feature.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Link */}
                <div className="pt-2">
                  <Link
                    href={feature.actionLink}
                    target={feature.isExternal ? "_blank" : undefined}
                    rel={feature.isExternal ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-[#C00000] hover:text-white text-navy-900 text-xs font-bold border border-slate-200/80 hover:border-[#C00000] transition-all group/btn"
                  >
                    <span>{feature.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Banner Bar */}
        <div className="mt-10 sm:mt-14 p-4 sm:p-5 rounded-2xl bg-navy-950 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-[#C00000] text-white flex items-center justify-center font-black shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold font-heading text-white">
                100% Genuine Wholesale Guarantee • ESTD. 2001
              </h4>
              <p className="text-[11px] text-slate-300">
                Serving over 5,000+ retail stores across Bihar, UP, Bengal, Jharkhand & nationwide.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/contact"
              className="px-4 py-2.5 rounded-xl bg-[#C00000] hover:bg-[#A80000] text-white font-bold text-xs shadow-md transition-colors"
            >
              Contact Wholesale Desk
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
