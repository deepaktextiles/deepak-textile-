"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size,
  maxWidth,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const activeSize = size || maxWidth || "lg";

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-4xl",
    "2xl": "max-w-5xl",
    "3xl": "max-w-6xl",
    full: "max-w-[95vw]",
  };

  const chosenWidth = sizeClasses[activeSize] || sizeClasses.lg;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full ${chosenWidth} bg-white rounded-2xl shadow-2xl border border-border overflow-hidden z-10 max-h-[92vh] flex flex-col my-auto`}
      >
        {(title || description) && (
          <div className="flex items-start justify-between p-5 border-b border-border bg-sitebg/60">
            <div>
              {title && <h3 className="font-heading font-bold text-lg text-navy-500">{title}</h3>}
              {description && <p className="text-xs text-txt-secondary mt-1">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-txt-secondary hover:text-navy-500 p-1 rounded-md hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
