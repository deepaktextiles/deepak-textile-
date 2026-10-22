"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MessageCircle,
  Phone,
  Truck,
  CreditCard,
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Heart,
  Star,
  Check,
  Package,
  Layers,
  FileText,
  Share2,
  Maximize2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { productsApi } from "../../../services/api";
import { Button } from "../../../components/ui/Button";
import { EnquiryModal } from "../../../components/wholesale/EnquiryModal";
import { ProductCard } from "../../../components/product/ProductCard";
import Image from "next/image";
import whatsapp from "../../../images/icons/whatsapp221.svg";
import { SALES_PRODUCT_IMAGES } from "../../../lib/salesImages";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const relatedSliderRef = useRef(null);

  // Accordions matching reference image media_1791547508325.png
  const [openAccordions, setOpenAccordions] = useState({
    description: true,
    styleNotes: false,
    sizeAndFit: false,
    materialAndCare: false,
    specifications: false,
    sellerInfo: false,
  });

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productsApi.getBySlug(slug);
        if (res.product) {
          setProduct(res.product);

          // Load related products
          if (res.product.category?.slug || res.product.category?._id) {
            const relRes = await productsApi.getAll({
              category: res.product.category?.slug || res.product.category?._id,
              limit: 4,
            });
            if (relRes.products) {
              setRelatedProducts(
                relRes.products.filter((p) => p._id !== res.product._id)
              );
            }
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-pulse">
          <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gray-100 aspect-[3/4.2] rounded" />
            <div className="bg-gray-100 aspect-[3/4.2] rounded" />
          </div>
          <div className="lg:col-span-5 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-10 bg-gray-200 rounded w-1/2" />
            <div className="h-40 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <Package className="w-16 h-16 text-gray-300 mx-auto" />
        <h2 className="text-2xl font-bold font-heading text-navy-950">
          Product Not Found
        </h2>
        <p className="text-sm text-gray-500">
          The requested wholesale lot may have been sold out or updated.
        </p>
        <Link href="/products">
          <Button variant="primary">Return to Wholesale Catalog</Button>
        </Link>
      </div>
    );
  }

  // Gallery images from real Deepak Textiles selling product photos (selesproductsimages)
  const productCustomImages =
    product.images && product.images.length > 0
      ? product.images.filter((img) => !img.includes("unsplash.com"))
      : [];

  const galleryImages =
    productCustomImages.length >= 4
      ? productCustomImages
      : productCustomImages.length > 0
      ? [...productCustomImages, ...SALES_PRODUCT_IMAGES.slice(0, 6 - productCustomImages.length)]
      : SALES_PRODUCT_IMAGES.slice(0, 6);

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const scrollRelated = (direction) => {
    if (relatedSliderRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      relatedSliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const wholesalePrice = product.wholesalePrice || product.price || 499;
  const retailPrice =
    product.price && product.price > wholesalePrice
      ? product.price
      : Math.round(wholesalePrice * 2.5);
  const discountPercent = Math.max(
    10,
    Math.round(((retailPrice - wholesalePrice) / retailPrice) * 100)
  );

  const availableSizes =
    product.sizes && product.sizes.length > 0
      ? product.sizes
      : ["XS", "S", "M", "L", "XL", "XXL"];

  const whatsappMessage = encodeURIComponent(
    `Hello Deepak Textiles (Darbhanga), I want to place a wholesale order for:
*${product.name}*
SKU: ${product.sku || "DT-LOT"}
Wholesale Rate: ₹${wholesalePrice}/${product.unit || "pc"}
Selected Size: ${selectedSize}
MOQ: ${product.minimumOrderQuantity || 10} ${product.unit || "pcs"}
Please send available video clips of this lot and dispatch details.`
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500">
          <Link href="/" className="hover:text-navy-950 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link
            href="/products"
            className="hover:text-navy-950 transition-colors"
          >
            Catalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          {product.category && (
            <>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="hover:text-navy-950 transition-colors capitalize"
              >
                {product.category.name}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </>
          )}
          <span className="text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* ========================================================= */}
        {/* MAIN PDP 2-COLUMN LAYOUT                                  */}
        {/* Left: 2-Column Photo Grid (Matching media_1791547493330)   */}
        {/* Right: Sticky Details & Accordions (media_1791547508325)  */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* ======================================================= */}
          {/* LEFT: INTERACTIVE PRODUCT IMAGE CAROUSEL (PROUSAL)       */}
          {/* ======================================================= */}
          <div className="lg:col-span-7 space-y-3.5">
            {/* Main Featured Carousel Viewport */}
            <div className="relative aspect-[3/3.9] sm:aspect-[3/3.7] w-full overflow-hidden rounded-2xl bg-gray-50 border border-gray-200 shadow-sm group select-none">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIndex}
                  src={galleryImages[activeImageIndex]}
                  alt={`${product.name} wholesale lot view ${activeImageIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.01 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="w-full h-full object-cover object-top cursor-zoom-in"
                  onClick={() => setIsZoomModalOpen(true)}
                  loading="eager"
                />
              </AnimatePresence>

              {/* Prev Slide Arrow */}
              {galleryImages.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all opacity-95 sm:opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 border border-gray-200/60"
                  aria-label="Previous Photo"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
                </button>
              )}

              {/* Next Slide Arrow */}
              {galleryImages.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all opacity-95 sm:opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 border border-gray-200/60"
                  aria-label="Next Photo"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.2]" />
                </button>
              )}

              {/* Top Badges: MOQ (Left) & Slide Counter / Maximize (Right) */}
              <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                <span className="bg-navy-950/90 backdrop-blur-xs text-white text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md shadow-xs">
                  MOQ: {product.minimumOrderQuantity || 10} {product.unit || "pcs"}
                </span>
              </div>

              <div className="absolute top-3.5 right-3.5 flex items-center gap-2">
                <span className="bg-black/65 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                  {activeImageIndex + 1} / {galleryImages.length}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomModalOpen(true);
                  }}
                  className="w-8 h-8 rounded-md bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-xs transition-colors"
                  title="Click to Enlarge"
                  aria-label="Enlarge image"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Badges: Wholesale Rating (Left) & Wishlist (Right) */}
              <div className="absolute bottom-3.5 left-3.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-bold text-gray-900 flex items-center gap-1.5 border border-gray-100 shadow-xs">
                <span className="text-amber-500">★</span>
                <span>{product.rating || "4.7"}</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500 font-medium">({product.reviewsCount || "24"})</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsWishlisted(!isWishlisted);
                }}
                className="absolute bottom-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 hover:bg-white backdrop-blur-xs flex items-center justify-center transition-all border border-gray-100 shadow-xs hover:scale-105 active:scale-95"
                aria-label="Wishlist"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isWishlisted ? "fill-rose-500 text-rose-500" : "text-gray-700"
                  }`}
                />
              </button>
            </div>

            {/* Thumbnail Carousel Track */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-0.5 scrollbar-thin scrollbar-thumb-gray-200">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden shrink-0 transition-all border-2 ${
                      activeImageIndex === idx
                        ? "border-gold-600 ring-2 ring-gold-400/40 scale-102 shadow-sm"
                        : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                    }`}
                    aria-label={`Select product image ${idx + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover object-top"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ======================================================= */}
          {/* RIGHT: BUYING DETAILS & ACCORDIONS (Screenshot 2)       */}
          {/* ======================================================= */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Title & Brand */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-bold text-gold-700 uppercase tracking-widest">
                  {product.category?.name || "Surat Wholesale Collection"}
                </span>
                <span className="font-mono text-gray-400">
                  SKU: {product.sku || "DT-LOT"}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-heading font-medium text-gray-900 leading-snug">
                {product.name}
              </h1>
            </div>

            {/* Purple Lowest Price Badge */}
            <div>
              <span className="inline-block bg-[#580050] text-white text-xs font-bold px-2.5 py-1 rounded tracking-tight">
                2026 Lowest Price
              </span>
            </div>

            {/* Pricing Section */}
            <div className="space-y-1 pb-4 border-b border-gray-200">
              <div className="flex items-baseline gap-2.5">
                <span className="line-through text-gray-400 text-sm sm:text-base font-normal">
                  ₹{retailPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-950">
                  ₹{wholesalePrice.toLocaleString("en-IN")}
                </span>
                <span className="text-rose-600 font-bold text-sm sm:text-base">
                  {discountPercent}% off
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Inclusive of all taxes • GST Invoices provided
              </p>
            </div>

            {/* Size Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-900 uppercase tracking-wider">
                  Select Size
                </span>
                <button
                  type="button"
                  className="font-bold text-gold-700 hover:underline uppercase text-[11px]"
                >
                  Size Chart
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`h-10 min-w-10 px-3.5 rounded text-xs font-bold transition-all border ${
                      selectedSize === sz
                        ? "bg-navy-950 text-white border-navy-950"
                        : "bg-white text-gray-800 border-gray-300 hover:border-gray-900"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Wholesale MOQ Notice Box */}
            <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-navy-950">
                <span>Minimum Order Quantity (MOQ)</span>
                <span className="text-gold-700">
                  {product.minimumOrderQuantity || 10} {product.unit || "pcs"}{" "}
                  Lot
                </span>
              </div>
              <p className="text-gray-500 text-[11px] leading-relaxed">
                Direct factory rate from Surat mills. Sets include assorted
                sizes (XS-XXL) or single-size wholesale bundles.
              </p>
            </div>

            {/* Primary Order Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <a
                href={`https://wa.me/919308066552?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button
                  variant="whatsapp"
                  size="lg"
                  className="w-full font-bold py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                  leftIcon={
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center p-0.5 shrink-0 shadow-xs">
                      <Image
                        src={whatsapp}
                        alt="WhatsApp"
                        width={20}
                        height={20}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  }
                >
                  Order on WhatsApp (Wholesale Direct)
                </Button>
              </a>

              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full font-bold border-gray-300 text-gray-800 hover:bg-gray-50"
                  leftIcon={<FileText className="w-4 h-4" />}
                >
                  Request Quote
                </Button>
                <a
                  href="tel:+919308066552"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold transition-colors"
                >
                  <Phone className="w-4 h-4 text-gold-400" />
                  <span>Call Sales Desk</span>
                </a>
              </div>
            </div>

            {/* ======================================================= */}
            {/* 3 DELIVERY / SERVICE BULLETS (Using user's icon images) */}
            {/* ======================================================= */}
            <div className="pt-4 border-t border-gray-200 space-y-3 text-xs text-gray-800">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/icons/icons8-in-transit-100.gif"
                  alt="Express Shipping"
                  className="w-5 h-5 object-contain shrink-0"
                />
                <span className="font-normal text-gray-900">Express Shipping</span>
              </div>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/icons/icons8-cash-on-delivery-100.png"
                  alt="Cash on Delivery Available"
                  className="w-5 h-5 object-contain shrink-0"
                />
                <span className="font-normal text-gray-900">Cash on Delivery Available</span>
              </div>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/icons/icons8-loyalty.gif"
                  alt="Easy 7-Days Returns"
                  className="w-5 h-5 object-contain shrink-0"
                />
                <span className="font-normal text-gray-900">
                  Easy 7-Days Returns — ₹10 convenience fee applies to returns.
                </span>
              </div>

              {/* Mill Protection & Wholesale Discount Badges */}
              <div className="grid grid-cols-2 gap-2.5 pt-1.5">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/icons/icons8-protect-100.png"
                    alt="Verified Quality"
                    className="w-4 h-4 object-contain shrink-0"
                  />
                  <span className="text-[11px] font-semibold text-gray-900">100% Mill Verified</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/icons/icons8-discount-100.png"
                    alt="Direct Mill Rate"
                    className="w-4 h-4 object-contain shrink-0"
                  />
                  <span className="text-[11px] font-semibold text-gray-900">Direct Factory Rates</span>
                </div>
              </div>
            </div>

            {/* ======================================================= */}
            {/* ACCORDIONS (Exact match to reference Screenshot 2)      */}
            {/* DESCRIPTION, STYLE NOTES, SIZE & FIT, MATERIAL & CARE,  */}
            {/* SPECIFICATIONS, SELLER INFORMATION                     */}
            {/* ======================================================= */}
            <div className="pt-2 border-t border-gray-200 divide-y divide-gray-200">
              {/* 1. DESCRIPTION Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion("description")}
                  className="w-full flex items-center justify-between py-3.5 text-left group focus:outline-none"
                >
                  <span className="font-heading font-bold text-xs tracking-wider text-gray-900 uppercase">
                    DESCRIPTION
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      openAccordions.description ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openAccordions.description && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pb-4 text-xs text-gray-600 leading-relaxed space-y-2"
                    >
                      <p>
                        {product.description ||
                          "This ensemble is tailored from the finest quality Surat mill fabric, featuring rich artisan motifs, delicate lace detailing, and exquisite finish. Specially crafted for wholesale boutiques, retail showrooms, and wedding collections."}
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-gray-600 pt-1">
                        <li>Direct mill lot packaging with individual tags</li>
                        <li>High quality stitching with overlock borders</li>
                        <li>Colorfast dyes tested for long-lasting vibrancy</li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. STYLE NOTES Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion("styleNotes")}
                  className="w-full flex items-center justify-between py-3.5 text-left group focus:outline-none"
                >
                  <span className="font-heading font-bold text-xs tracking-wider text-gray-900 uppercase">
                    STYLE NOTES
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      openAccordions.styleNotes ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openAccordions.styleNotes && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pb-4 text-xs text-gray-600 leading-relaxed space-y-2"
                    >
                      <p>
                        Designed for effortless traditional elegance, festive
                        gatherings, and in-office ethnic wear. Pair with
                        statement jhumkas, minimal bangles, and embellished
                        mojris to complete the ensemble.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. SIZE & FIT Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion("sizeAndFit")}
                  className="w-full flex items-center justify-between py-3.5 text-left group focus:outline-none"
                >
                  <span className="font-heading font-bold text-xs tracking-wider text-gray-900 uppercase">
                    SIZE & FIT
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      openAccordions.sizeAndFit ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openAccordions.sizeAndFit && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pb-4 text-xs text-gray-600 leading-relaxed space-y-2"
                    >
                      <p>
                        <strong>Fit:</strong> Regular Comfort Fit
                      </p>
                      <p>
                        <strong>Model Specs:</strong> The model (height 5&apos;8&quot;)
                        is wearing size S.
                      </p>
                      <div className="pt-2">
                        <table className="w-full text-left border border-gray-200 text-[11px]">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="p-2 border-b border-gray-200 font-bold">
                                Size
                              </th>
                              <th className="p-2 border-b border-gray-200 font-bold">
                                Bust (in)
                              </th>
                              <th className="p-2 border-b border-gray-200 font-bold">
                                Waist (in)
                              </th>
                              <th className="p-2 border-b border-gray-200 font-bold">
                                Hip (in)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="p-2 border-b border-gray-100 font-semibold">
                                XS
                              </td>
                              <td className="p-2 border-b border-gray-100">
                                34
                              </td>
                              <td className="p-2 border-b border-gray-100">
                                28
                              </td>
                              <td className="p-2 border-b border-gray-100">
                                36
                              </td>
                            </tr>
                            <tr>
                              <td className="p-2 border-b border-gray-100 font-semibold">
                                S
                              </td>
                              <td className="p-2 border-b border-gray-100">
                                36
                              </td>
                              <td className="p-2 border-b border-gray-100">
                                30
                              </td>
                              <td className="p-2 border-b border-gray-100">
                                38
                              </td>
                            </tr>
                            <tr>
                              <td className="p-2 border-b border-gray-100 font-semibold">
                                M
                              </td>
                              <td className="p-2 border-b border-gray-100">
                                38
                              </td>
                              <td className="p-2 border-b border-gray-100">
                                32
                              </td>
                              <td className="p-2 border-b border-gray-100">
                                40
                              </td>
                            </tr>
                            <tr>
                              <td className="p-2 border-b border-gray-100 font-semibold">
                                L
                              </td>
                              <td className="p-2 border-b border-gray-100">
                                40
                              </td>
                              <td className="p-2 border-b border-gray-100">
                                34
                              </td>
                              <td className="p-2 border-b border-gray-100">
                                42
                              </td>
                            </tr>
                            <tr>
                              <td className="p-2 font-semibold">XL</td>
                              <td className="p-2">42</td>
                              <td className="p-2">36</td>
                              <td className="p-2">44</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 4. MATERIAL & CARE Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion("materialAndCare")}
                  className="w-full flex items-center justify-between py-3.5 text-left group focus:outline-none"
                >
                  <span className="font-heading font-bold text-xs tracking-wider text-gray-900 uppercase">
                    MATERIAL & CARE
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      openAccordions.materialAndCare ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openAccordions.materialAndCare && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pb-4 text-xs text-gray-600 leading-relaxed space-y-1.5"
                    >
                      <p>
                        <strong>Fabric:</strong>{" "}
                        {product.fabric || "Premium Rayon / Pure Cotton"}
                      </p>
                      <p>
                        <strong>Wash Care:</strong> First wash dry clean
                        recommended. Subsequent gentle hand wash in cold water
                        with mild liquid detergent.
                      </p>
                      <p>
                        <strong>Ironing:</strong> Iron on medium-low reverse
                        heat. Do not iron directly over zari or lace trims.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 5. SPECIFICATIONS Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion("specifications")}
                  className="w-full flex items-center justify-between py-3.5 text-left group focus:outline-none"
                >
                  <span className="font-heading font-bold text-xs tracking-wider text-gray-900 uppercase">
                    SPECIFICATIONS
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      openAccordions.specifications ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openAccordions.specifications && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pb-4 text-xs text-gray-600 leading-relaxed"
                    >
                      <div className="grid grid-cols-2 gap-y-2 pt-1">
                        <div>
                          <span className="text-gray-400 block text-[11px]">
                            Pattern / Print
                          </span>
                          <span className="font-medium text-gray-900">
                            Ethnic Motifs / Floral
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[11px]">
                            Weave Type
                          </span>
                          <span className="font-medium text-gray-900">
                            Machine Weave Mill Finish
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[11px]">
                            Neckline
                          </span>
                          <span className="font-medium text-gray-900">
                            V-Neck with Lace Trims
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[11px]">
                            Sleeve Styling
                          </span>
                          <span className="font-medium text-gray-900">
                            Three-Quarter Sleeves
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[11px]">
                            Origin
                          </span>
                          <span className="font-medium text-gray-900">
                            Surat, Gujarat, India
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[11px]">
                            Wholesale Lot SKU
                          </span>
                          <span className="font-medium text-gray-900 font-mono">
                            {product.sku || "DT-LOT"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 6. SELLER INFORMATION Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion("sellerInfo")}
                  className="w-full flex items-center justify-between py-3.5 text-left group focus:outline-none"
                >
                  <span className="font-heading font-bold text-xs tracking-wider text-gray-900 uppercase">
                    SELLER INFORMATION
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      openAccordions.sellerInfo ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openAccordions.sellerInfo && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pb-4 text-xs text-gray-600 leading-relaxed space-y-1.5"
                    >
                      <p>
                        <strong>Manufacturer & Wholesale Supplier:</strong>{" "}
                        Deepak Textiles (Clothing & Fabric Wholesaler, Estd. 2001)
                      </p>
                      <p>
                        <strong>Wholesale Showroom Address:</strong> 5V7R+V63,
                        Kadirabad Road, Near Naka No. 2, Banglagarh Colony,
                        Mansaar Colony, Darbhanga, Bihar – 846004, India
                      </p>
                      <p>
                        <strong>Phone / WhatsApp:</strong> 093080 66552 / 85446 63335
                      </p>
                      <p>
                        <strong>Business Categories:</strong> Sarees, Suit Pieces, Shirting & Suiting, Lehenga & Readymade
                      </p>
                      <p>
                        <strong>Country of Origin:</strong> India
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RELATED WHOLESALE PRODUCTS CAROUSEL                       */}
        {/* ========================================================= */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-gray-200 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-gray-900">
                  You May Also Like
                </h2>
                <p className="text-xs text-gray-500">
                  Recommended wholesale lots for your boutique or retail store
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollRelated("left")}
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 shadow-xs transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollRelated("right")}
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 shadow-xs transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <Link
                  href={`/products?category=${product.category?.slug}`}
                  className="hidden sm:inline-block ml-2 text-xs font-bold text-navy-950 hover:underline uppercase tracking-wider"
                >
                  View All
                </Link>
              </div>
            </div>

            {/* Scrollable Products Carousel Track */}
            <div
              ref={relatedSliderRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth scrollbar-thin scrollbar-thumb-gray-200"
            >
              {relatedProducts.map((p) => (
                <div
                  key={p._id || p.slug}
                  className="min-w-[220px] sm:min-w-[270px] max-w-[270px] shrink-0 snap-start"
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quote Modal */}
        <EnquiryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={product}
        />

        {/* Fullscreen High-Resolution Image Zoom Modal */}
        <AnimatePresence>
          {isZoomModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
              onClick={() => setIsZoomModalOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsZoomModalOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-gold-400 p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                aria-label="Close Preview"
              >
                <X className="w-6 h-6" />
              </button>

              <div
                className="relative max-h-[90vh] max-w-[90vw] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <motion.img
                  initial={{ scale: 0.94 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.94 }}
                  src={galleryImages[activeImageIndex]}
                  alt="High Resolution Wholesale View"
                  className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl shadow-2xl select-none"
                />

                {/* Modal Navigation Arrows */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors shadow-lg"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors shadow-lg"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-6 h-6 stroke-[2.5]" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
