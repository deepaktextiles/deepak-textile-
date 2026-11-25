"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { categoriesApi } from "../../services/api";

const containerVariants = {
  hidden: {
    opacity: 0,
    y: -6,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.04,
      delayChildren: 0.03,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      duration: 0.15,
      ease: "easeInOut",
    },
  },
};

const columnVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export const MegaMenu = ({
  isOpen,
  onClose,
  bannerImage,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch 100% dynamic categories and subcategories from database API
  useEffect(() => {
    let isMounted = true;
    async function fetchCategories() {
      try {
        const res = await categoriesApi.getAll();
        if (
          isMounted &&
          res.success &&
          Array.isArray(res.categories) &&
          res.categories.length > 0
        ) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.error("Could not load dynamic categories for MegaMenu:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute 100% dynamic columns strictly from database categories & their subcategories
  const menuSections = useMemo(() => {
    const rawCategories = Array.isArray(categories) ? categories : [];

    // Main categories: categories without a parentCategory (or where parent does not exist)
    const topCategories = rawCategories.filter((c) => {
      if (!c.parentCategory) return true;
      const parentId = c.parentCategory._id || c.parentCategory;
      const parentExists = rawCategories.some(
        (p) =>
          String(p._id) === String(parentId) && String(p._id) !== String(c._id)
      );
      return !parentExists;
    });

    // Subcategories: categories assigned to a valid parent category
    const subCategories = rawCategories.filter((c) => {
      if (!c.parentCategory) return false;
      const parentId = c.parentCategory._id || c.parentCategory;
      return rawCategories.some(
        (p) =>
          String(p._id) === String(parentId) && String(p._id) !== String(c._id)
      );
    });

    return topCategories.map((cat) => {
      const catSlug = (cat.slug || "").toLowerCase().trim();
      const catName = (cat.name || "").trim();

      // Find real subcategories belonging to this category in database
      const childSubs = subCategories.filter((sub) => {
        const parentId = sub.parentCategory?._id || sub.parentCategory;
        return (
          String(parentId) === String(cat._id) ||
          sub.parentCategory?.slug === catSlug
        );
      });

      const items = childSubs.map((sub) => ({
        id: sub._id,
        name: sub.name,
        href: `/products?category=${sub.slug}`,
      }));

      return {
        id: cat._id || catSlug,
        title: catName,
        slug: catSlug,
        items,
        viewAllHref: `/products?category=${catSlug}`,
      };
    });
  }, [categories]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mega-menu-dropdown"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="absolute top-full left-0 w-full bg-white border-t border-b border-gray-200 z-50 overflow-hidden shadow-2xl"
        >
          {/* Subtle Top Gold Accent Line */}
          <div className="h-0.5 w-full bg-gradient-to-r from-navy-900 via-gold-500 to-navy-900" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Dynamic Wholesale Category Columns */}
              <div className="md:col-span-8 lg:col-span-9 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 lg:gap-8 max-h-[72vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 pr-2">
                {loading && menuSections.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-gray-400 text-sm">
                    Loading wholesale catalogs...
                  </div>
                ) : (
                  menuSections.map((section) => (
                    <motion.div
                      key={section.id || section.slug}
                      variants={columnVariants}
                      className="space-y-3.5"
                    >
                      {/* Section Header */}
                      <div className="border-b border-gray-100 pb-2">
                        <Link
                          href={section.viewAllHref}
                          onClick={onClose}
                          className="group inline-block"
                        >
                          <h4 className="font-heading font-extrabold text-sm text-navy-950 uppercase tracking-wide group-hover:text-gold-700 transition-colors">
                            {section.title}
                          </h4>
                        </Link>
                      </div>

                      {/* Section Sub-items (100% from Database) */}
                      {section.items.length > 0 ? (
                        <ul className="space-y-2">
                          {section.items.map((item) => (
                            <motion.li
                              key={String(item.id || item.name) + item.href}
                              whileHover={{ x: 4 }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                              }}
                            >
                              <Link
                                href={item.href}
                                onClick={onClose}
                                className="text-xs text-gray-600 hover:text-gold-700 font-medium transition-colors flex items-center justify-between group"
                              >
                                <span>{item.name}</span>
                                <span className="opacity-0 group-hover:opacity-100 text-gold-600 transition-opacity text-xs">
                                  →
                                </span>
                              </Link>
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-gray-400 italic py-1">
                          Catalog lots available
                        </p>
                      )}

                      {/* View All Section Link */}
                      <div className="pt-1.5">
                        <Link
                          href={section.viewAllHref}
                          onClick={onClose}
                          className="inline-flex items-center gap-1 text-[11px] font-extrabold text-navy-900 hover:text-gold-600 uppercase tracking-wider transition-colors"
                        >
                          <span>Explore All</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* 1 Right Banner Card: Mill Direct Advantage Showcase */}
              <motion.div
                variants={columnVariants}
                className="md:col-span-4 lg:col-span-3 bg-white rounded-xl p-5 border border-gray-200 flex flex-col justify-between hover:border-gold-400 transition-colors"
              >
                <div>
                  {/* Top Image Showcase */}
                  <div className="relative w-full rounded-lg overflow-hidden aspect-[4/3] bg-gray-50 border border-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        bannerImage ||
                        "https://res.cloudinary.com/mqbs9z4j/image/upload/v1793016127/deepak_textiles/gqnnslpmdj9cbvkh1ydp.png"
                      }
                      alt="Surat Wholesale Collection"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="mt-3.5 space-y-1">
                    <span className="text-[10px] font-extrabold tracking-widest text-gold-700 uppercase">
                      Direct Mill Supply
                    </span>
                    <h5 className="font-heading font-bold text-xs text-navy-950">
                      Surat Factory Rates in Darbhanga
                    </h5>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      All catalog lots ready for bulk store dispatch with GST
                      invoice.
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-gray-100">
                  <Link
                    href="/products"
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-700 hover:text-gold-800 uppercase tracking-wider transition-colors"
                  >
                    <span>Browse All Lots</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
