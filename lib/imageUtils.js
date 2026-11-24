/**
 * Image optimization and preloading utilities for fast loading & instant carousel transitions.
 */

export function getOptimizedImageUrl(url, options = {}) {
  if (!url || typeof url !== "string") return url || "/images/logo.jpeg";

  const { width = 1000, quality = "auto" } = options;

  // Cloudinary image auto-optimization
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    // If slow legacy parameters like q_100 or e_sharpen exist, clean them up
    if (url.includes("q_100") || url.includes("e_sharpen")) {
      return url
        .replace(/q_100/g, "q_auto:good")
        .replace(/e_sharpen:\d+/g, "")
        .replace(/,+/g, ",")
        .replace(/\/upload\/,/g, "/upload/");
    }

    // Already transformed with modern flags
    if (url.includes("/f_auto") || url.includes("/q_auto")) {
      return url;
    }

    // Insert automatic WebP/AVIF format + compression + optimal width
    const qFlag = quality === "auto" ? "q_auto:good" : `q_${quality}`;
    const transform = `w_${width},c_limit,${qFlag},f_auto`;
    return url.replace("/upload/", `/upload/${transform}/`);
  }

  // Unsplash image optimization
  if (url.includes("images.unsplash.com")) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set("w", String(width));
      parsed.searchParams.set("auto", "format");
      parsed.searchParams.set("fit", "crop");
      parsed.searchParams.set(
        "q",
        typeof quality === "number" ? String(quality) : "80"
      );
      return parsed.toString();
    } catch {
      return url;
    }
  }

  return url;
}

/**
 * Preloads an array of image URLs into browser cache.
 */
export function preloadImages(urls = []) {
  if (typeof window === "undefined" || !Array.isArray(urls)) return;

  urls.forEach((src) => {
    if (src && typeof src === "string") {
      const img = new window.Image();
      img.decoding = "async";
      img.src = src;
    }
  });
}
