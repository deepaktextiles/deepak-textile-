"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MessageCircle,
  Phone,
  Truck,
  CreditCard,
  ShoppingBag,
  ChevronRight,
  ChevronDown,
  Heart,
  Star,
  Check,
  Package,
  Layers,
  FileText,
  Share2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { productsApi } from "../../../services/api";
import { Button } from "../../../components/ui/Button";
import { EnquiryModal } from "../../../components/wholesale/EnquiryModal";
import { ProductCard } from "../../../components/product/ProductCard";

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

  // Gallery images for 2-column grid matching reference image media_1791547493330.jpg
  const galleryImages =
    product.images && product.images.length >= 4
      ? product.images
      : product.images && product.images.length > 0
      ? [
          product.images[0],
          product.images[1] || product.images[0],
          product.images[2] ||
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
          product.images[3] ||
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
        ]
      : [
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=80",
        ];

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
    `Hello Deepak Textiles (Surat), I want to place a wholesale order for:
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
          {/* LEFT: 2-COLUMN IMAGE GALLERY (Matching Screenshot 1)    */}
          {/* ======================================================= */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[3/4.2] w-full overflow-hidden bg-gray-50 group cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />

                  {/* MOQ badge on first photo */}
                  {idx === 0 && (
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded">
                      MOQ: {product.minimumOrderQuantity || 10}{" "}
                      {product.unit || "pcs"}
                    </div>
                  )}

                  {/* Rating Badge on bottom left of first photo */}
                  {idx === 0 && (
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-bold text-gray-900 flex items-center gap-1 border border-gray-100">
                      <span className="text-amber-500">★</span>
                      <span>{product.rating || "4.7"}</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-500 font-medium">
                        ({product.reviewsCount || "24"})
                      </span>
                    </div>
                  )}

                  {/* Heart on bottom right of first photo */}
                  {idx === 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsWishlisted(!isWishlisted);
                      }}
                      className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-xs flex items-center justify-center transition-all border border-gray-100"
                      aria-label="Wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isWishlisted
                            ? "fill-rose-500 text-rose-500"
                            : "text-gray-700"
                        }`}
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>
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
                href={`https://wa.me/919825144520?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button
                  variant="whatsapp"
                  size="lg"
                  className="w-full font-bold bg-emerald-600 hover:bg-emerald-500 text-white py-3.5"
                  leftIcon={<MessageCircle className="w-5 h-5" />}
                >
                  Order on WhatsApp (Direct Mill)
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
                  href="tel:+919825144520"
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
                        Deepak Textiles Private Limited
                      </p>
                      <p>
                        <strong>Mill Address:</strong> Shop 204-206, 2nd Floor,
                        Radharaman Textile Market, Ring Road, Surat, Gujarat -
                        395002
                      </p>
                      <p>
                        <strong>GSTIN:</strong> 24AAACD1234F1Z5
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
        {/* RELATED WHOLESALE PRODUCTS                                */}
        {/* ========================================================= */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-gray-200 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-heading font-medium text-gray-900">
                You May Also Like
              </h2>
              <Link
                href={`/products?category=${product.category?.slug}`}
                className="text-xs font-bold text-navy-950 hover:underline uppercase tracking-wider"
              >
                View More {product.category?.name}
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id || p.slug} product={p} />
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
      </div>
    </div>
  );
}
