"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { categoriesApi } from "../../services/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoriesApi.getAll();
        if (res.categories) setCategories(res.categories);
      } catch (err) {
        console.error("Error loading categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-6 border-b border-border">
        <div className="text-xs font-bold text-gold-700 uppercase tracking-widest mb-1">
          Catalog Collections
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-navy-500">
          Wholesale Textile Categories
        </h1>
        <p className="text-xs sm:text-sm text-txt-secondary mt-1">
          Explore all fabric lots manufactured and supplied directly from Surat, Gujarat.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-xl h-64 border border-border animate-pulse" />
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id || cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group bg-white rounded-xl overflow-hidden border border-border hover:border-gold-400 hover:shadow-elevated transition-all flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden bg-sitebg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    cat.image ||
                    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
                  }
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-base text-navy-500 group-hover:text-gold-600 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-txt-secondary">View Wholesale Lots</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-sitebg group-hover:bg-gold-500 group-hover:text-navy-500 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-border p-8">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-txt-secondary">No categories added yet.</p>
        </div>
      )}
    </div>
  );
}
