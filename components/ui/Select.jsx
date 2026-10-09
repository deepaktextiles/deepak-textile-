"use client";

import React from "react";

export const Select = ({
  label,
  error,
  helperText,
  options = [],
  className = "",
  id,
  children,
  ...props
}) => {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-txt-secondary mb-1.5"
        >
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-md text-sm text-txt-main transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 ${
          error ? "border-red-500 bg-red-50/20" : "border-border hover:border-gray-400"
        } ${className}`}
        {...props}
      >
        {children
          ? children
          : options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-txt-secondary">{helperText}</p>}
    </div>
  );
};
