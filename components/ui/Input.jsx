"use client";

import React from "react";

export const Input = ({ label, error, helperText, leftIcon, rightIcon, className = "", id, ...props }) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-txt-primary uppercase tracking-wide">
          {label} {props.required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-txt-secondary pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-white text-txt-primary text-sm rounded-md border ${
            error ? "border-danger" : "border-border focus:border-navy-500"
          } ${leftIcon ? "pl-10" : "pl-3.5"} ${
            rightIcon ? "pr-10" : "pr-3.5"
          } py-2.5 transition-all outline-none disabled:bg-gray-100 placeholder:text-txt-secondary/60 ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 text-txt-secondary pointer-events-none flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-danger font-medium mt-1">{error}</p>}
      {!error && helperText && <p className="text-xs text-txt-secondary mt-1">{helperText}</p>}
    </div>
  );
};
