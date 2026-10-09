"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  MessageCircle,
  Phone,
  Truck,
  ShieldCheck,
  Package,
  Layers,
  FileText,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Clock,
} from "lucide-react";
import { productsApi } from "../../../services/api";
import { Button } from "../../../components/ui/Button";
import { EnquiryModal } from "../../../components/wholesale/EnquiryModal";
import { ProductCard } from "../../../components/product/ProductCard";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productsApi.getBySlug(slug);
        if (res.product) {
          setProduct(res.product);
          setSelectedImage(res.product.images?.[0] || "");

          // Load related products
          if (res.product.category?.slug || res.product.category?._id) {
            const relRes = await productsApi.getAll({
              category: res.product.category?.slug || res.product.category?._id,
              limit: 4,
            });
            if (relRes.products) {
              setRelatedProducts(relRes.products.filter((p) => p._id !== res.product._id));
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="bg-white rounded-xl h-[450px] border border-border" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-10 bg-gray-200 rounded w-3/4" />
            <div className="h-12 bg-gray-200 rounded w-1/2" />
            <div className="h-40 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <Package className="w-16 h-16 text-gray-300 mx-auto" />
        <h2 className="text-2xl font-bold font-heading text-navy-500">Product Not Found</h2>
        <p className="text-sm text-txt-secondary">
          The requested wholesale lot may have been sold out or updated.
        </p>
        <Link href="/products">
          <Button variant="primary">Return to Wholesale Catalog</Button>
        </Link>
      </div>
    );
  }

  const primaryImage =
    selectedImage ||
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80";

  const whatsappMessage = encodeURIComponent(
    `Hello Deepak Textiles (Surat), I am interested in wholesale order for:
*${product.name}*
SKU: ${product.sku}
Wholesale Rate: ₹${product.wholesalePrice || product.price}/${product.unit || "pc"}
Minimum Order: ${product.minimumOrderQuantity} ${product.unit || "pcs"}
Fabric: ${product.fabric}
Color/Set: ${product.color}

Please send video clips of this lot, current stock quantity, and transport charges to my city.`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-txt-secondary">
        <Link href="/" className="hover:text-gold-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/products" className="hover:text-gold-600 transition-colors">
          Wholesale Products
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        {product.category && (
          <>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-gold-600 transition-colors"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </>
        )}
        <span className="text-txt-main font-semibold truncate max-w-[200px] sm:max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Product Images Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border bg-white shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-3 left-3 bg-navy-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded shadow">
              Wholesale Lot
            </div>
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-navy-500 text-xs font-bold px-2.5 py-1 rounded border border-border shadow-sm">
              MOQ: {product.minimumOrderQuantity} {product.unit || "pcs"}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img ? "border-gold-500 ring-2 ring-gold-500/30" : "border-border hover:border-gray-400"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Surat Mill Dispatch Notice */}
          <div className="p-4 rounded-xl bg-gold-50 border border-gold-200/80 text-xs text-gold-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <Truck className="w-4 h-4 text-gold-700" />
              <span>Direct Surat Mill Transport & Parcel Booking</span>
            </div>
            <p className="text-gold-800 leading-relaxed">
              Dispatched directly from Ring Road textile warehouses via V-Trans, TCI, or your preferred local transport.
            </p>
          </div>
        </div>

        {/* Right: Product Details & Wholesale Ordering (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-3 text-xs text-txt-secondary mb-2">
              <span className="font-bold text-gold-700 uppercase tracking-widest bg-gold-100/60 px-2.5 py-0.5 rounded">
                {product.category?.name || "Wholesale Textile"}
              </span>
              <span>•</span>
              <span className="font-mono">SKU: {product.sku}</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                In Stock ({product.stock} {product.unit || "pcs"} available)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-navy-500 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-xl bg-white border border-border shadow-card flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-txt-secondary block">
                Wholesale Price (Ex-Surat Mill)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-heading font-extrabold text-navy-500">
                  ₹{product.wholesalePrice?.toLocaleString("en-IN") || product.price?.toLocaleString("en-IN")}
                </span>
                <span className="text-sm font-semibold text-txt-secondary">
                  / {product.unit || "piece"} + 5% GST
                </span>
              </div>
            </div>

            {product.price > (product.wholesalePrice || 0) && (
              <div className="text-right">
                <span className="text-xs text-txt-secondary block">Retail Showroom MRP</span>
                <span className="text-base line-through text-gray-400 font-semibold">
                  ₹{product.price?.toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>

          {/* Wholesale Order Specifications Table */}
          <div className="bg-white rounded-xl border border-border overflow-hidden shadow-card">
            <div className="bg-sitebg px-4 py-3 border-b border-border flex items-center gap-2">
              <Layers className="w-4 h-4 text-gold-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-navy-500">
                Wholesale Lot Specifications
              </h3>
            </div>
            <div className="divide-y divide-border text-xs">
              <div className="grid grid-cols-2 p-3 sm:px-4">
                <span className="font-semibold text-txt-secondary">Minimum Order Quantity (MOQ)</span>
                <span className="font-bold text-navy-500">
                  {product.minimumOrderQuantity} {product.unit || "pcs"} (Wholesale lot)
                </span>
              </div>
              <div className="grid grid-cols-2 p-3 sm:px-4">
                <span className="font-semibold text-txt-secondary">Fabric Quality</span>
                <span className="font-medium text-navy-500">{product.fabric || "Premium Mill Fabric"}</span>
              </div>
              <div className="grid grid-cols-2 p-3 sm:px-4">
                <span className="font-semibold text-txt-secondary">Color / Shade Match</span>
                <span className="font-medium text-navy-500">{product.color || "Catalog Matching Assorted"}</span>
              </div>
              <div className="grid grid-cols-2 p-3 sm:px-4">
                <span className="font-semibold text-txt-secondary">Unit / Packaging</span>
                <span className="font-medium text-navy-500">{product.unit || "Piece"} (Standard Bulk Packaging)</span>
              </div>
              <div className="grid grid-cols-2 p-3 sm:px-4">
                <span className="font-semibold text-txt-secondary">Dispatch Timeline</span>
                <span className="font-medium text-emerald-700 font-semibold">Within 24 to 48 Hours from Surat</span>
              </div>
            </div>
          </div>

          {/* DIRECT WHOLESALE CONTACT & INQUIRY ACTIONS */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-txt-secondary uppercase tracking-wider">
              Direct Contact & Bulk Booking:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* WhatsApp Direct Action */}
              <a
                href={`https://wa.me/919825144520?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button
                  variant="whatsapp"
                  size="lg"
                  className="w-full font-bold shadow-md hover:shadow-emerald-900/20 bg-emerald-600 hover:bg-emerald-500"
                  leftIcon={<MessageCircle className="w-5 h-5" />}
                >
                  Order on WhatsApp
                </Button>
              </a>

              {/* Request Wholesale Quote Modal */}
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="w-full font-bold shadow-md bg-gold-500 hover:bg-gold-400 text-navy-500"
                leftIcon={<FileText className="w-5 h-5" />}
              >
                Request Wholesale Quote
              </Button>
            </div>

            {/* Direct Phone Call Button */}
            <a
              href="tel:+919825144520"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-navy-500 hover:bg-navy-600 text-white text-xs sm:text-sm font-bold transition-colors shadow-sm"
            >
              <Phone className="w-4 h-4 text-gold-400" />
              <span>Call Surat Sales Desk: +91 98251 44520 / +91 94268 11200</span>
            </a>
          </div>

          {/* Description */}
          {product.description && (
            <div className="pt-4 space-y-2">
              <h3 className="font-heading font-bold text-sm text-navy-500 uppercase tracking-wider">
                Product Details & Fabric Notes
              </h3>
              <p className="text-xs sm:text-sm text-txt-secondary leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-border">
                {product.description}
              </p>
            </div>
          )}

          {/* Wholesale Buyer Guarantee */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
            <div className="flex items-center gap-2 text-txt-secondary p-3 bg-white rounded-lg border border-border">
              <ShieldCheck className="w-4 h-4 text-gold-600 shrink-0" />
              <span>100% Original Surat Mill Quality</span>
            </div>
            <div className="flex items-center gap-2 text-txt-secondary p-3 bg-white rounded-lg border border-border">
              <FileText className="w-4 h-4 text-gold-600 shrink-0" />
              <span>GST Tax Invoices with HSN</span>
            </div>
            <div className="flex items-center gap-2 text-txt-secondary p-3 bg-white rounded-lg border border-border">
              <Clock className="w-4 h-4 text-gold-600 shrink-0" />
              <span>Fast Daily Transport Booking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products in the same category */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-border space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-bold text-navy-500">
              More {product.category?.name || "Wholesale"} Lots
            </h2>
            <Link
              href={`/products?category=${product.category?.slug}`}
              className="text-xs font-semibold text-gold-700 hover:underline"
            >
              View All {product.category?.name}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id || p.slug} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Quote Enquiry Modal */}
      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </div>
  );
}
