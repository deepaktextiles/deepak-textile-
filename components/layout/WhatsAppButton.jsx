"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WhatsAppIcon } from "../ui/WhatsAppIcon";
import { X, Send } from "lucide-react";

export const WhatsAppButton = ({
  phoneNumber = "919308066552",
  defaultMessage = "Hello Deepak Textiles, I am interested in wholesale sarees, suit pieces, and fabric collections.",
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    defaultMessage
  )}`;

  return (
    <aside
      aria-label="WhatsApp Wholesale Support"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5 select-none"
    >
      {/* Interactive Tooltip Pill for Desktop */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="hidden md:flex flex-col bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-emerald-100 text-left pointer-events-none"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Darbhanga Sales Desk Online
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-800">
              Chat on WhatsApp for Wholesale Rates
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Deepak Textiles on WhatsApp"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white shadow-[0_10px_25px_-5px_rgba(37,211,102,0.45)] hover:shadow-[0_15px_30px_-5px_rgba(37,211,102,0.6)] border border-emerald-100 transition-all duration-300"
      >
        {/* Subtle Ambient Pulse Wave */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/25 animate-ping pointer-events-none" />

        {/* Crisp White Backdrop for the SVG handset cutout */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center overflow-hidden">
          <WhatsAppIcon
            className="w-full h-full transform transition-transform duration-300 group-hover:rotate-6"
            color="#25D366"
          />
        </div>

        {/* Active Online Indicator Badge */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
      </motion.a>
    </aside>
  );
};
