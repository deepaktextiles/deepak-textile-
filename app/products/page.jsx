"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  X,
  Package,
  ChevronDown,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { productsApi, categoriesApi } from "../../services/api";
import { ProductCard } from "../../components/product/ProductCard";
import { Button } from "../../components/ui/Button";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParam || "");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "");
  const [selectedFabric, setSelectedFabric] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [selectedPattern, setSelectedPattern] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [sortOrder, setSortOrder] = useState("desc");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [showMoreSizes, setShowMoreSizes] = useState(false);
  const [showMoreDescription, setShowMoreDescription] = useState(false);

  // Accordion toggle states matching Libas reference image
  const [openSections, setOpenSections] = useState({
    size: true,
    colors: false,
    category: true,
    fabric: false,
    occasion: false,
    pattern: false,
    priceRange: false,
    style: false,
  });

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const allSizes = [
    { label: "XS", count: "989" },
    { label: "S", count: "3289" },
    { label: "M", count: "3482" },
    { label: "L", count: "3488" },
    { label: "XL", count: "3488" },
    { label: "XXL", count: "2890" },
    { label: "3XL", count: "1420" },
    { label: "Free Size", count: "860" },
  ];

  const colorsList = [
    { label: "Red", count: "480" },
    { label: "Maroon", count: "320" },
    { label: "Yellow / Mustard", count: "240" },
    { label: "Pink / Peach", count: "510" },
    { label: "Green / Mint", count: "380" },
    { label: "Blue / Navy", count: "290" },
    { label: "Black", count: "180" },
    { label: "White", count: "140" },
  ];

  const fabricsList = [
    { label: "Pure Silk", count: "145" },
    { label: "Banarasi Silk", count: "98" },
    { label: "Cotton Silk", count: "210" },
    { label: "Georgette", count: "320" },
    { label: "Chanderi", count: "115" },
    { label: "Rayon", count: "410" },
    { label: "Organza", count: "85" },
    { label: "Cambric Cotton", count: "160" },
  ];

  const occasionsList = [
    { label: "Daily Wear", count: "520" },
    { label: "Festive & Wedding", count: "840" },
    { label: "Party Wear", count: "290" },
    { label: "Office Wear", count: "180" },
  ];

  const patternsList = [
    { label: "Floral Print", count: "310" },
    { label: "Embroidered", count: "540" },
    { label: "Bandhani / Bandhej", count: "190" },
    { label: "Zari Woven", count: "260" },
    { label: "Solid / Plain", count: "170" },
    { label: "Digital Print", count: "220" },
  ];

  const priceRanges = [
    { id: "all", label: "All Prices", count: "3489" },
    { id: "under-500", label: "Under ₹500", count: "180", min: 0, max: 500 },
    { id: "500-1000", label: "₹500 - ₹1,000", count: "460", min: 500, max: 1000 },
    { id: "1000-2500", label: "₹1,000 - ₹2,500", count: "720", min: 1000, max: 2500 },
    { id: "above-2500", label: "Above ₹2,500", count: "310", min: 2500, max: null },
  ];

  const stylesList = [
    { label: "Straight Cut", count: "410" },
    { label: "Anarkali", count: "290" },
    { label: "A-Line", count: "240" },
    { label: "Sharara / Gharara", count: "160" },
    { label: "Co-Ords", count: "95" },
  ];

  // Sync URL params
  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    if (searchParam) setSearch(searchParam);
  }, [searchParam]);

  // Load categories from backend
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

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          limit: 60,
        };

        if (sortBy === "featured") {
          params.sort = "featured";
        } else if (sortBy === "price-asc") {
          params.sort = "price_asc";
        } else if (sortBy === "price-desc") {
          params.sort = "price_desc";
        } else {
          params.sortBy = "createdAt";
          params.sortOrder = "desc";
        }

        if (selectedCategory && selectedCategory !== "All") {
          params.category = selectedCategory;
        }
        if (selectedFabric && selectedFabric !== "All") {
          params.fabric = selectedFabric;
        }
        if (selectedSize) {
          params.size = selectedSize;
        }
        if (selectedColor) {
          params.color = selectedColor;
        }
        if (search.trim()) {
          params.search = search.trim();
        }

        const selectedPR = priceRanges.find((p) => p.id === priceRange);
        if (selectedPR && selectedPR.id !== "all") {
          if (selectedPR.min !== undefined && selectedPR.min !== null) {
            params.minPrice = selectedPR.min;
          }
          if (selectedPR.max !== undefined && selectedPR.max !== null) {
            params.maxPrice = selectedPR.max;
          }
        }

        const res = await productsApi.getAll(params);
        setProducts(res.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 150);

    return () => clearTimeout(timer);
  }, [
    selectedCategory,
    selectedFabric,
    selectedSize,
    selectedColor,
    selectedOccasion,
    selectedPattern,
    selectedStyle,
    priceRange,
    search,
    sortBy,
    sortOrder,
  ]);

  const clearAllFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedFabric("");
    setSelectedSize("");
    setSelectedColor("");
    setSelectedOccasion("");
    setSelectedPattern("");
    setSelectedStyle("");
    setPriceRange("all");
    setSortBy("featured");
    setSortOrder("desc");
  };

  const hasActiveFilters = Boolean(
    selectedCategory ||
      selectedFabric ||
      selectedSize ||
      selectedColor ||
      selectedOccasion ||
      selectedPattern ||
      selectedStyle ||
      priceRange !== "all" ||
      search.trim()
  );

  const currentCategoryName =
    categories.find((c) => c.slug === selectedCategory)?.name ||
    (selectedCategory ? selectedCategory.replace(/-/g, " ") : "Suits for Women");

  // Reusable Checkbox Component matching the Libas reference image
  const FilterCheckbox = ({ checked, onChange, label, count }) => (
    <button
      type="button"
      onClick={onChange}
      className="w-full flex items-center justify-between py-1 text-left group cursor-pointer"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`w-3.5 h-3.5 rounded-[2px] border transition-colors flex items-center justify-center shrink-0 ${
            checked
              ? "bg-navy-950 border-navy-950 text-white"
              : "border-gray-300 bg-white group-hover:border-gray-500"
          }`}
        >
          {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
        </div>
        <span
          className={`text-xs truncate ${
            checked
              ? "font-bold text-navy-950"
              : "font-normal text-gray-700 group-hover:text-gray-950"
          }`}
        >
          {label}
        </span>
      </div>
      {count && (
        <span className="text-[11px] text-gray-400 font-normal shrink-0 ml-1">
          ({count})
        </span>
      )}
    </button>
  );

  // Accordion Section Component
  const AccordionSection = ({ title, isOpen, onToggle, children }) => (
    <div className="border-b border-gray-200">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3.5 text-left group cursor-pointer focus:outline-none"
      >
        <span className="font-heading font-bold text-xs text-gray-900 tracking-wider uppercase">
          {title}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && <div className="pb-3.5 pt-0.5 space-y-1">{children}</div>}
    </div>
  );

  const displayedSizes = showMoreSizes ? allSizes : allSizes.slice(0, 5);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
        <Link href="/" className="hover:text-navy-950 font-normal">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-normal capitalize">
          {currentCategoryName}
        </span>
      </div>

      {/* Main 2-Column Layout: Left Filters + Right Products Grid */}
      <div className="flex flex-col md:flex-row items-start gap-8 lg:gap-12">
        {/* ========================================================= */}
        {/* LEFT SIDEBAR: FILTERS (DESKTOP & TABLETS - md: and up)   */}
        {/* Directly matching Libas reference image                   */}
        {/* ========================================================= */}
        <aside className="hidden md:block w-56 lg:w-60 shrink-0 sticky top-20 self-start">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-900" />
              <span className="font-heading font-bold text-xs tracking-wider text-gray-900 uppercase">
                FILTER
              </span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 uppercase tracking-wider transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* 1. SIZE Accordion */}
          <AccordionSection
            title="SIZE"
            isOpen={openSections.size}
            onToggle={() => toggleSection("size")}
          >
            {displayedSizes.map((s) => (
              <FilterCheckbox
                key={s.label}
                label={s.label}
                count={s.count}
                checked={selectedSize === s.label}
                onChange={() =>
                  setSelectedSize(selectedSize === s.label ? "" : s.label)
                }
              />
            ))}
            <button
              type="button"
              onClick={() => setShowMoreSizes(!showMoreSizes)}
              className="text-xs text-gray-500 hover:text-navy-950 font-medium pt-1 block cursor-pointer underline"
            >
              {showMoreSizes ? "Show less" : "Show more"}
            </button>
          </AccordionSection>

          {/* 2. COLORS Accordion */}
          <AccordionSection
            title="COLORS"
            isOpen={openSections.colors}
            onToggle={() => toggleSection("colors")}
          >
            {colorsList.map((col) => (
              <FilterCheckbox
                key={col.label}
                label={col.label}
                count={col.count}
                checked={selectedColor === col.label}
                onChange={() =>
                  setSelectedColor(selectedColor === col.label ? "" : col.label)
                }
              />
            ))}
          </AccordionSection>

          {/* 3. CATEGORY Accordion */}
          <AccordionSection
            title="CATEGORY"
            isOpen={openSections.category}
            onToggle={() => toggleSection("category")}
          >
            <FilterCheckbox
              label="All Categories"
              checked={!selectedCategory}
              onChange={() => setSelectedCategory("")}
            />
            {categories.map((c) => (
              <FilterCheckbox
                key={c._id || c.slug}
                label={c.name}
                checked={selectedCategory === c.slug}
                onChange={() =>
                  setSelectedCategory(
                    selectedCategory === c.slug ? "" : c.slug
                  )
                }
              />
            ))}
          </AccordionSection>

          {/* 4. FABRIC Accordion */}
          <AccordionSection
            title="FABRIC"
            isOpen={openSections.fabric}
            onToggle={() => toggleSection("fabric")}
          >
            {fabricsList.map((f) => (
              <FilterCheckbox
                key={f.label}
                label={f.label}
                count={f.count}
                checked={selectedFabric === f.label}
                onChange={() =>
                  setSelectedFabric(selectedFabric === f.label ? "" : f.label)
                }
              />
            ))}
          </AccordionSection>

          {/* 5. OCCASION Accordion */}
          <AccordionSection
            title="OCCASION"
            isOpen={openSections.occasion}
            onToggle={() => toggleSection("occasion")}
          >
            {occasionsList.map((occ) => (
              <FilterCheckbox
                key={occ.label}
                label={occ.label}
                count={occ.count}
                checked={selectedOccasion === occ.label}
                onChange={() =>
                  setSelectedOccasion(
                    selectedOccasion === occ.label ? "" : occ.label
                  )
                }
              />
            ))}
          </AccordionSection>

          {/* 6. PATTERN AND PRINT Accordion */}
          <AccordionSection
            title="PATTERN AND PRINT"
            isOpen={openSections.pattern}
            onToggle={() => toggleSection("pattern")}
          >
            {patternsList.map((pat) => (
              <FilterCheckbox
                key={pat.label}
                label={pat.label}
                count={pat.count}
                checked={selectedPattern === pat.label}
                onChange={() =>
                  setSelectedPattern(
                    selectedPattern === pat.label ? "" : pat.label
                  )
                }
              />
            ))}
          </AccordionSection>

          {/* 7. PRICE RANGE Accordion */}
          <AccordionSection
            title="PRICE RANGE"
            isOpen={openSections.priceRange}
            onToggle={() => toggleSection("priceRange")}
          >
            {priceRanges.map((pr) => (
              <FilterCheckbox
                key={pr.id}
                label={pr.label}
                count={pr.count}
                checked={priceRange === pr.id}
                onChange={() => setPriceRange(pr.id)}
              />
            ))}
          </AccordionSection>

          {/* 8. STYLE Accordion */}
          <AccordionSection
            title="STYLE"
            isOpen={openSections.style}
            onToggle={() => toggleSection("style")}
          >
            {stylesList.map((st) => (
              <FilterCheckbox
                key={st.label}
                label={st.label}
                count={st.count}
                checked={selectedStyle === st.label}
                onChange={() =>
                  setSelectedStyle(selectedStyle === st.label ? "" : st.label)
                }
              />
            ))}
          </AccordionSection>
        </aside>

        {/* ========================================================= */}
        {/* RIGHT CONTENT: MAIN PRODUCTS AREA                         */}
        {/* Directly matching Libas reference image                   */}
        {/* ========================================================= */}
        <main className="flex-1 min-w-0">
          {/* Category Title & Editorial Description */}
          <div className="space-y-1.5 mb-5">
            <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 font-normal capitalize">
              {currentCategoryName}
            </h1>
            <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed max-w-4xl">
              Ethnic wear styles are ruling the hearts of every Indian woman. Suits for women have become the top drawer essential for in-office traditional elegance, festive gatherings, and wedding celebrations.{" "}
              {showMoreDescription && (
                <span className="text-gray-500">
                  {" "}
                  Explore Surat direct wholesale lots, unstitched dress materials, and ready-to-wear ensembles crafted with authentic artisan weaves, pure silks, and rich embellishments.
                </span>
              )}
              <button
                type="button"
                onClick={() => setShowMoreDescription(!showMoreDescription)}
                className="font-semibold text-gray-900 underline ml-1 cursor-pointer"
              >
                {showMoreDescription ? "Read less" : "Read more"}
              </button>
            </p>
          </div>

          {/* Product Count & Sort Bar (Matching reference image) */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-6">
            <div className="text-xs font-semibold text-gray-700">
              {loading ? (
                <span>Loading products...</span>
              ) : (
                <span>{products.length} products</span>
              )}
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-navy-950 text-white text-xs font-bold"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>FILTER {hasActiveFilters && "•"}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-gray-900 cursor-pointer">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-900 hidden sm:inline" />
              <span className="text-gray-900 hidden sm:inline">SORT</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-bold text-gray-900 text-xs focus:outline-none cursor-pointer uppercase border-none pr-1"
              >
                <option value="featured">FEATURED</option>
                <option value="createdAt-desc">NEWEST</option>
                <option value="price-asc">PRICE: LOW TO HIGH</option>
                <option value="price-desc">PRICE: HIGH TO LOW</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-xs pb-5">
              <span className="text-gray-500 text-[11px] font-medium">Applied:</span>

              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-gray-100 text-navy-950 font-bold text-[11px]">
                  Category: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                  <button onClick={() => setSelectedCategory("")} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedSize && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-gray-100 text-navy-950 font-bold text-[11px]">
                  Size: {selectedSize}
                  <button onClick={() => setSelectedSize("")} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedFabric && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-gray-100 text-navy-950 font-bold text-[11px]">
                  Fabric: {selectedFabric}
                  <button onClick={() => setSelectedFabric("")} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedColor && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-gray-100 text-navy-950 font-bold text-[11px]">
                  Color: {selectedColor}
                  <button onClick={() => setSelectedColor("")} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {priceRange !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-gray-100 text-navy-950 font-bold text-[11px]">
                  Price: {priceRanges.find((p) => p.id === priceRange)?.label}
                  <button onClick={() => setPriceRange("all")} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={clearAllFilters}
                className="text-[11px] font-bold text-rose-600 hover:underline ml-1"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Product Grid: 3 columns on desktop (Exact match to reference image) */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-gray-100 animate-pulse aspect-[3/4.2] w-full"
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10">
              {products.map((prod) => (
                <ProductCard key={prod._id || prod.slug} product={prod} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-gray-100 p-8 space-y-3">
              <Package className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="font-heading font-bold text-base text-navy-950">
                No Products Found
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                No products match the selected filters. Clear your filters to browse the complete collection.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="border-gray-300"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* MOBILE FILTER SLIDE-OVER DRAWER (SLIDES FROM LEFT)        */}
      {/* ========================================================= */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
            />

            {/* Slide Drawer From Left */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative z-50 w-[85vw] max-w-sm h-full bg-white flex flex-col border-r border-gray-200 p-5 overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-gray-900" />
                  <span className="font-heading font-bold text-xs tracking-wider text-gray-900 uppercase">
                    FILTER
                  </span>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* 1. SIZE Accordion */}
              <AccordionSection
                title="SIZE"
                isOpen={openSections.size}
                onToggle={() => toggleSection("size")}
              >
                {allSizes.map((s) => (
                  <FilterCheckbox
                    key={s.label}
                    label={s.label}
                    count={s.count}
                    checked={selectedSize === s.label}
                    onChange={() =>
                      setSelectedSize(selectedSize === s.label ? "" : s.label)
                    }
                  />
                ))}
              </AccordionSection>

              {/* 2. COLORS Accordion */}
              <AccordionSection
                title="COLORS"
                isOpen={openSections.colors}
                onToggle={() => toggleSection("colors")}
              >
                {colorsList.map((col) => (
                  <FilterCheckbox
                    key={col.label}
                    label={col.label}
                    count={col.count}
                    checked={selectedColor === col.label}
                    onChange={() =>
                      setSelectedColor(selectedColor === col.label ? "" : col.label)
                    }
                  />
                ))}
              </AccordionSection>

              {/* 3. CATEGORY Accordion */}
              <AccordionSection
                title="CATEGORY"
                isOpen={openSections.category}
                onToggle={() => toggleSection("category")}
              >
                <FilterCheckbox
                  label="All Categories"
                  checked={!selectedCategory}
                  onChange={() => setSelectedCategory("")}
                />
                {categories.map((c) => (
                  <FilterCheckbox
                    key={c._id || c.slug}
                    label={c.name}
                    checked={selectedCategory === c.slug}
                    onChange={() =>
                      setSelectedCategory(
                        selectedCategory === c.slug ? "" : c.slug
                      )
                    }
                  />
                ))}
              </AccordionSection>

              {/* 4. FABRIC Accordion */}
              <AccordionSection
                title="FABRIC"
                isOpen={openSections.fabric}
                onToggle={() => toggleSection("fabric")}
              >
                {fabricsList.map((f) => (
                  <FilterCheckbox
                    key={f.label}
                    label={f.label}
                    count={f.count}
                    checked={selectedFabric === f.label}
                    onChange={() =>
                      setSelectedFabric(
                        selectedFabric === f.label ? "" : f.label
                      )
                    }
                  />
                ))}
              </AccordionSection>

              {/* 5. PRICE RANGE Accordion */}
              <AccordionSection
                title="PRICE RANGE"
                isOpen={openSections.priceRange}
                onToggle={() => toggleSection("priceRange")}
              >
                {priceRanges.map((pr) => (
                  <FilterCheckbox
                    key={pr.id}
                    label={pr.label}
                    count={pr.count}
                    checked={priceRange === pr.id}
                    onChange={() => setPriceRange(pr.id)}
                  />
                ))}
              </AccordionSection>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-2 mt-auto">
                <button
                  onClick={clearAllFilters}
                  className="py-2.5 px-3 rounded border border-gray-200 text-xs font-bold text-gray-700 uppercase"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="py-2.5 px-3 rounded bg-navy-950 text-white text-xs font-bold uppercase"
                >
                  Apply Filter
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-16 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-gray-100 aspect-[3/4.2]" />
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
