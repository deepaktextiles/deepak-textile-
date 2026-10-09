"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Filter, Package, MessageCircle } from "lucide-react";
import { productsApi, categoriesApi } from "../../services/api";
import { ProductCard } from "../../components/product/ProductCard";
import { Button } from "../../components/ui/Button";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "");
  const [selectedFabric, setSelectedFabric] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const fabrics = ["All", "Pure Silk", "Banarasi Silk", "Cotton Silk", "Georgette", "Chanderi", "Rayon", "Organza", "Jacquard", "Dola Silk"];

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoriesApi.getAll();
        if (res.categories) setCategories(res.categories);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          sortBy,
          sortOrder,
          limit: 30,
        };
        if (selectedCategory && selectedCategory !== "All") {
          params.category = selectedCategory;
        }
        if (selectedFabric && selectedFabric !== "All") {
          params.fabric = selectedFabric;
        }
        if (search.trim()) {
          params.search = search.trim();
        }

        const res = await productsApi.getAll(params);
        if (res.products) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedCategory, selectedFabric, search, sortBy, sortOrder]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[12px] space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="text-xs font-bold text-gold-700 uppercase tracking-widest mb-1">
            Surat B2B Catalog
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-navy-500">
            Wholesale Textile & Garment Lots
          </h1>
          <p className="text-xs sm:text-sm text-txt-secondary mt-1">
            Browse authentic Surat mill rates. Click any product to view high-resolution photos, MOQ, and fabric specifications.
          </p>
        </div>

        {/* Direct WhatsApp Assistance */}
        <a
          href="https://wa.me/919825144520?text=Hello%20Deepak%20Textiles,%20please%20send%20your%20full%20catalog%20PDF%20with%20rates."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-colors shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Request Full Catalog PDF on WhatsApp</span>
        </a>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-border shadow-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, fabric, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-sitebg border border-border rounded-md text-sm text-txt-main focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-sitebg border border-border rounded-md text-sm text-txt-main focus:outline-none focus:border-gold-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fabric Filter */}
          <div>
            <select
              value={selectedFabric}
              onChange={(e) => setSelectedFabric(e.target.value)}
              className="w-full px-3 py-2 bg-sitebg border border-border rounded-md text-sm text-txt-main focus:outline-none focus:border-gold-500"
            >
              <option value="">All Fabrics</option>
              {fabrics.filter((f) => f !== "All").map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split("-");
                setSortBy(sb);
                setSortOrder(so);
              }}
              className="w-full px-3 py-2 bg-sitebg border border-border rounded-md text-sm text-txt-main focus:outline-none focus:border-gold-500"
            >
              <option value="createdAt-desc">Newest Arrivals First</option>
              <option value="wholesalePrice-asc">Price: Low to High</option>
              <option value="wholesalePrice-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical: A to Z</option>
            </select>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs pt-1">
          <span className="text-txt-secondary font-semibold shrink-0">Quick Filter:</span>
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
              !selectedCategory
                ? "bg-navy-500 text-white font-bold"
                : "bg-sitebg border border-border text-txt-main hover:border-gold-400"
            }`}
          >
            All Lots
          </button>
          {categories.map((c) => (
            <button
              key={c._id || c.slug}
              onClick={() => setSelectedCategory(c.slug)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === c.slug
                  ? "bg-navy-500 text-white font-bold"
                  : "bg-sitebg border border-border text-txt-main hover:border-gold-400"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-white rounded-lg border border-border p-4 animate-pulse h-80" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((prod) => (
            <ProductCard key={prod._id || prod.slug} product={prod} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-border p-8 space-y-3">
          <Package className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-heading font-bold text-base text-navy-500">No Wholesale Products Found</h3>
          <p className="text-xs text-txt-secondary max-w-md mx-auto">
            Try clearing your search query or category filter to view our complete Surat wholesale catalog.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setSelectedCategory("");
              setSelectedFabric("");
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-lg h-72 border border-border" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

