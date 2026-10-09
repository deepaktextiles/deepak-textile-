"use client";

import React from "react";

export const Textarea = ({ label, error, helperText, className = "", id, ...props }) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-txt-primary uppercase tracking-wide">
          {label} {props.required && <span className="text-danger">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        className={`w-full bg-white text-txt-primary text-sm rounded-md border ${
          error ? "border-danger" : "border-border focus:border-navy-500"
        } px-3.5 py-2.5 transition-all outline-none disabled:bg-gray-100 placeholder:text-txt-secondary/60 ${className}`}
        rows={props.rows || 4}
        {...props}
      />
      {error && <p className="text-xs text-danger font-medium mt-1">{error}</p>}
      {!error && helperText && <p className="text-xs text-txt-secondary mt-1">{helperText}</p>}
    </div>
  );
};

export const Select = ({ label, options = [], error, helperText, className = "", id, ...props }) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-txt-primary uppercase tracking-wide">
          {label} {props.required && <span className="text-danger">*</span>}
        </label>
      )}
      <select
        id={inputId}
        className={`w-full bg-white text-txt-primary text-sm rounded-md border ${
          error ? "border-danger" : "border-border focus:border-navy-500"
        } px-3.5 py-2.5 transition-all outline-none disabled:bg-gray-100 ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger font-medium mt-1">{error}</p>}
      {!error && helperText && <p className="text-xs text-txt-secondary mt-1">{helperText}</p>}
    </div>
  );
};
