"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const variants = {
    primary:
      "bg-gold-500 hover:bg-gold-600 text-navy-500 shadow-sm hover:shadow-gold active:scale-[0.99]",
    navy:
      "bg-navy-500 hover:bg-navy-600 text-white shadow-sm active:scale-[0.99]",
    whatsapp:
      "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-[0.99]",
    outline:
      "border border-border bg-white text-txt-primary hover:bg-sitebg hover:border-navy-300",
    "gold-outline":
      "border border-gold-500 bg-transparent text-gold-500 hover:bg-gold-500 hover:text-navy-500",
    danger: "bg-danger text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5 h-8",
    md: "text-sm px-4 py-2.5 gap-2 h-10",
    lg: "text-base px-6 py-3.5 gap-2.5 h-12",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
