"use client";

import React, { useState, useRef, useEffect } from "react";

/**
 * Same-height pulsing skeleton placeholder with centered DT brand mark.
 */
export function ImageSkeletonBox({
  className = "",
  logoClassName = "",
  showLogo = true,
}) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center animate-pulse bg-gray-200 ${className}`}
    >
      {showLogo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/icons/logo-mark.png"
          alt=""
          aria-hidden="true"
          className={`w-12 sm:w-14 max-w-[42%] max-h-[42%] object-contain opacity-45 select-none pointer-events-none ${logoClassName}`}
        />
      )}
    </div>
  );
}

/**
 * Renders an <img> with a same-height pulsing skeleton overlay (and DT logo)
 * while the image is loading. Once loaded (or if already cached), the skeleton
 * unmounts and the image fades in smoothly without layout shift.
 */
export function SkeletonImage({
  src,
  alt = "",
  className = "",
  wrapperClassName = "",
  skeletonClassName = "",
  logoClassName = "",
  showLogo = true,
  onLoad,
  onError,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!src) {
      setLoaded(true);
      return;
    }

    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [src]);

  const handleLoad = (e) => {
    setLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setLoaded(true);
    if (onError) onError(e);
  };

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {!loaded && (
        <ImageSkeletonBox
          className={`absolute inset-0 w-full h-full ${skeletonClassName}`}
          logoClassName={logoClassName}
          showLogo={showLogo}
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} transition-opacity duration-300 ${
          loaded ? "" : "!opacity-0"
        }`}
        {...props}
      />
    </div>
  );
}
