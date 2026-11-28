"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Phone,
  ArrowRight,
  ShieldCheck,
  Truck,
  Package,
  Sparkles,
} from "lucide-react";
import { productsApi, categoriesApi, settingsApi } from "../services/api";
import { ProductCard, ProductCardSkeleton } from "../components/product/ProductCard";
import { HeroSlider } from "../components/home/HeroSlider";
import { SalesProductsSlider } from "../components/home/SalesProductsSlider";
import { TopCategoriesSlider } from "../components/home/TopCategoriesSlider";
import { TrendingBannerSlider } from "../components/home/TrendingBannerSlider";
import { SareeStoreBento } from "../components/home/SareeStoreBento";
import { BestSellerMensSlider } from "../components/home/BestSellerMensSlider";
import { GoogleReviewsSection } from "../components/home/GoogleReviewsSection";
import { WhyPartnerSection } from "../components/home/WhyPartnerSection";

export default function HomePage() {
  const [settings, setSettings] = useState({
    bannerTitle: "Deepak Textiles — Clothing & Fabric Wholesaler",
    bannerSubtitle:
      "Darbhanga, Bihar • Bulk Designer Sarees, Suit Pieces, Shirting & Suiting, Lehenga & Readymade • Estd. 2001",
    bannerImage:
      "https://res.cloudinary.com/mqbs9z4j/image/upload/v1793016127/deepak_textiles/gqnnslpmdj9cbvkh1ydp.png",
    phone: "+91 93080 66552",
    whatsapp: "+91 93080 66552",
  });
  const [categories, setCategories] = useState([]);
  const [wholesaleProducts, setWholesaleProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [visibleFeaturedCount, setVisibleFeaturedCount] = useState(8);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, categoriesRes, productsRes] =
          await Promise.allSettled([
            settingsApi.get(),
            categoriesApi.getAll(),
            productsApi.getAll({ limit: 24 }),
          ]);

        if (settingsRes.status === "fulfilled") {
          const s = settingsRes.value?.settings || settingsRes.value?.setting;
          if (s) setSettings((prev) => ({ ...prev, ...s }));
        }

        if (
          categoriesRes.status === "fulfilled" &&
          categoriesRes.value?.categories
        ) {
          setCategories(categoriesRes.value.categories);
        }

        if (productsRes.status === "fulfilled" && productsRes.value?.products) {
          const prods = productsRes.value.products;
          setWholesaleProducts(prods);
          const featured = prods.filter((p) => p.featured);
          setFeaturedProducts(featured.length > 0 ? featured : prods);
        }
      } catch (err) {
        console.error("Error loading home data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const whatsappCleanNumber = (settings.whatsapp || "919308066552").replace(
    /[^0-9]/g,
    "",
  );

  return (
    <div className="space-y-7 sm:space-y-14 pb-10 sm:pb-16">
      {/* 1. HERO CAROUSEL SLIDER */}
      <HeroSlider customSettings={settings} />

      {/* 2. REAL SELLING PRODUCTS SHOWCASE SLIDER */}
      <SalesProductsSlider
        products={wholesaleProducts}
        customSettings={settings}
      />

      {/* 3. TOP CATEGORIES SLIDER */}
      <TopCategoriesSlider categories={categories} loading={loading} />

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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <ProductCardSkeleton key={n} />
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {featuredProducts.slice(0, visibleFeaturedCount).map((prod) => (
                <ProductCard key={prod._id || prod.slug} product={prod} />
              ))}
            </div>

            {featuredProducts.length > 8 && (
              <div className="flex justify-center pt-1">
                {visibleFeaturedCount < featuredProducts.length ? (
                  <button
                    type="button"
                    onClick={() => setVisibleFeaturedCount((prev) => prev + 8)}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded bg-[#C00000] hover:bg-[#A80000] text-white text-xs sm:text-sm font-semibold tracking-wide transition-colors font-poppins"
                  >
                    Show More ({featuredProducts.length - visibleFeaturedCount} more)
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setVisibleFeaturedCount(8)}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded border border-navy-500 text-navy-500 hover:bg-navy-50 text-xs sm:text-sm font-semibold tracking-wide transition-colors font-poppins"
                  >
                    Show Less
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-border p-8">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-txt-secondary">
              No products loaded yet. Login as Admin to add products!
            </p>
          </div>
        )}
      </section>

      {/* 5. THE SAREE STORE — 3-COLUMN BENTO SHOWCASE (Matching Reference Image) */}
      <SareeStoreBento />

      {/* 6. BEST SELLER MENS — HORIZONTAL SLIDER (Matching Reference Image) */}
      <BestSellerMensSlider />

      {/* 7. SURAT WHOLESALE ADVANTAGE SECTION */}
      <WhyPartnerSection whatsappNumber={whatsappCleanNumber} />

      {/* 8. GOOGLE REVIEWS & RATING SECTION */}
      <GoogleReviewsSection />

      {/* 9. DIRECT CALL / WHATSAPP BANNER */}
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
              Connect directly with our Surat Wholesale Desk. Get instant
              catalog PDFs, current stock availability, and special volume
              discounts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <a
              href={`https://wa.me/${whatsappCleanNumber}?text=Hello%20Deepak%20Textiles,%20I%20want%20to%20order%20bulk%20wholesale%20stock.`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "18px 24px",
                fontWeight: 400,
                borderRadius: "4px",
                letterSpacing: "0.5px",
                fontSize: "14px",
              }}
              className="inline-flex items-center justify-center gap-2 bg-[#C00000] hover:bg-[#A80000] text-white shadow transition-all font-poppins leading-none"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Book Now on WhatsApp</span>
            </a>

            <a
              href={`tel:${settings.phone || "+919308066552"}`}
              style={{
                padding: "18px 24px",
                fontWeight: 400,
                borderRadius: "4px",
                letterSpacing: "0.5px",
                fontSize: "14px",
              }}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-navy-500 shadow transition-all font-poppins leading-none"
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
