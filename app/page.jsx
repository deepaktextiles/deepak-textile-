"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, Phone, ArrowRight, ShieldCheck, Truck, Package, Sparkles } from "lucide-react";
import { productsApi, categoriesApi, settingsApi } from "../services/api";
import { ProductCard } from "../components/product/ProductCard";
import { HeroSlider } from "../components/home/HeroSlider";
import { TrendingBannerSlider } from "../components/home/TrendingBannerSlider";
import { SareeStoreBento } from "../components/home/SareeStoreBento";
import { BestSellerMensSlider } from "../components/home/BestSellerMensSlider";

export default function HomePage() {
  const [settings, setSettings] = useState({
    bannerTitle: "Surat's Trusted Wholesale Textile & Garment Hub",
    bannerSubtitle: "Direct Mill Rates • Premium Sarees, Suits, Kurti Sets & Fabrics • Supplying 5,000+ Retailers Across India",
    bannerImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80",
    phone: "+91 98251 44520",
    whatsapp: "+91 98251 44520",
  });
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, categoriesRes, productsRes] = await Promise.allSettled([
          settingsApi.get(),
          categoriesApi.getAll(),
          productsApi.getAll({ limit: 8, featured: true }),
        ]);

        if (settingsRes.status === "fulfilled") {
          const s = settingsRes.value?.settings || settingsRes.value?.setting;
          if (s) setSettings((prev) => ({ ...prev, ...s }));
        }

        if (categoriesRes.status === "fulfilled" && categoriesRes.value?.categories) {
          setCategories(categoriesRes.value.categories);
        }

        if (productsRes.status === "fulfilled" && productsRes.value?.products) {
          setFeaturedProducts(productsRes.value.products);
        }
      } catch (err) {
        console.error("Error loading home data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const whatsappCleanNumber = (settings.whatsapp || "9825144520").replace(/[^0-9]/g, "");

  return (
    <div className="space-y-7 sm:space-y-14 pb-10 sm:pb-16">
      {/* 1. HERO CAROUSEL SLIDER */}
      <HeroSlider customSettings={settings} />

      {/* 2. TOP CATEGORIES (Matching Reference Image) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-navy-900 tracking-wider uppercase">
            TOP CATEGORIES
          </h2>
          <div className="w-16 h-1 bg-gold-500 mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 sm:gap-8">
          {(categories.length > 0 ? categories.slice(0, 4) : [
            { name: "SAREES", slug: "wholesale-sarees", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80" },
            { name: "DRESS MATERIALS", slug: "dress-materials", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80" },
            { name: "KURTA SETS", slug: "kurti-sets", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80" },
            { name: "LEHENGA CHOLI", slug: "lehenga-choli", image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=80" },
          ]).map((cat) => (
            <Link
              key={cat._id || cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center"
            >
              {/* Card Image Box with rounded border like reference */}
              <div className="w-full aspect-[4/4.2] rounded-2xl overflow-hidden border-2 border-navy-900/90 shadow-sm group-hover:shadow-xl group-hover:border-gold-500 transition-all duration-300 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    cat.image ||
                    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={cat.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Bold Uppercase Title Underneath (like reference image) */}
              <div className="pt-3.5 text-center">
                <h3 className="font-heading font-extrabold text-sm sm:text-base tracking-wider uppercase text-navy-950 group-hover:text-gold-600 transition-colors">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. TRENDING NOW — IMAGE BANNER SLIDER (Matching Reference Image) */}
      <TrendingBannerSlider />

      {/* 4. FEATURED PRODUCTS (CLICK TO VIEW FULL DETAILS) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-navy-500">
              Featured Wholesale Lots
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-navy-500 hover:text-gold-700 flex items-center gap-1 group"
          >
            <span>View Full Wholesale Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-lg border border-border p-4 animate-pulse h-80" />
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod._id || prod.slug} product={prod} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-border p-8">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-txt-secondary">No products loaded yet. Login as Admin to add products!</p>
          </div>
        )}
      </section>

      {/* 5. THE SAREE STORE — 3-COLUMN BENTO SHOWCASE (Matching Reference Image) */}
      <SareeStoreBento />

      {/* 6. BEST SELLER MENS — HORIZONTAL SLIDER (Matching Reference Image) */}
      <BestSellerMensSlider />

      {/* 7. SURAT WHOLESALE ADVANTAGE SECTION */}
      <section className="bg-white border-y border-border py-7 sm:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-bold text-gold-700 uppercase tracking-widest">
              Why Partner With Deepak Textiles
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-navy-500 mt-1">
              Direct Textile Sourcing from Surat
            </h2>
            <p className="text-xs sm:text-sm text-txt-secondary mt-2">
              Whether you run a retail shop, showroom, boutique, or online clothing store, we supply high-demand designs at the best wholesale rates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-border bg-sitebg hover:border-gold-400 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-navy-500 text-gold-400 flex items-center justify-center font-bold text-xl mb-4">
                01
              </div>
              <h3 className="font-heading font-bold text-base text-navy-500 mb-2">
                Factory Mill Direct Rates
              </h3>
              <p className="text-xs text-txt-secondary leading-relaxed">
                By cutting out distributors, broker commissions, and third-party margins, you get bottom-line Surat mill rates directly from our manufacturing floors.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-sitebg hover:border-gold-400 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-navy-500 text-gold-400 flex items-center justify-center font-bold text-xl mb-4">
                02
              </div>
              <h3 className="font-heading font-bold text-base text-navy-500 mb-2">
                High-Volume Stock Ready for Dispatch
              </h3>
              <p className="text-xs text-txt-secondary leading-relaxed">
                Huge inventory ready in our Surat warehouse. Daily parcel packing and tie-ups with leading transport agencies ensure fast delivery across all Indian states.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-sitebg hover:border-gold-400 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-navy-500 text-gold-400 flex items-center justify-center font-bold text-xl mb-4">
                03
              </div>
              <h3 className="font-heading font-bold text-base text-navy-500 mb-2">
                WhatsApp Video Calling & Samples
              </h3>
              <p className="text-xs text-txt-secondary leading-relaxed">
                Cannot travel to Surat? No problem. Connect with our sales manager on WhatsApp video call to inspect fabric texture, border zari, and print finishes in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DIRECT CALL / WHATSAPP BANNER */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-navy-500 to-navy-700 rounded-2xl p-8 sm:p-12 text-white shadow-elevated flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
              Instant B2B Order Booking
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold">
              Looking for Bulk Wholesale Lots for Your Shop?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Connect directly with our Surat Wholesale Desk. Get instant catalog PDFs, current stock availability, and special volume discounts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <a
              href={`https://wa.me/${whatsappCleanNumber}?text=Hello%20Deepak%20Textiles,%20I%20want%20to%20order%20bulk%20wholesale%20stock.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp Us Now</span>
            </a>

            <a
              href={`tel:${settings.phone || "+919825144520"}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-gray-100 text-navy-500 font-bold text-sm shadow transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>Call Sales Desk</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
