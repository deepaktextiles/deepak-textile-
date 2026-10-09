"use client";

import React, { useRef } from "react";
import { Star, ChevronLeft, ChevronRight, CheckCircle2, ExternalLink } from "lucide-react";

// Official Google "G" Logo SVG
const GoogleLogo = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

const reviewsData = [
  {
    id: 1,
    name: "Rajesh Sharma",
    business: "Jaipur Textile Showroom, Rajasthan",
    rating: 5,
    time: "2 days ago",
    avatarBg: "bg-blue-600",
    initial: "R",
    isLocalGuide: true,
    text: "Best wholesale mill manufacturer in Surat! We ordered 400 pcs of dress materials and pure silk sarees for our showroom. Quality is top-notch and parcel reached Jaipur in just 3 days with authentic GST invoice. Margins are super healthy.",
  },
  {
    id: 2,
    name: "Pooja Mehta",
    business: "Pooja Designer Boutique, Mumbai",
    rating: 5,
    time: "1 week ago",
    avatarBg: "bg-rose-600",
    initial: "P",
    isLocalGuide: false,
    text: "Very transparent rates and direct mill pricing without middleman commission. Their WhatsApp video call facility helped me verify the zari border and fabric weave before dispatch. Deepak Textiles is now our regular supply partner.",
  },
  {
    id: 3,
    name: "Anand Verma",
    business: "Verma Cloth Merchants, Kanpur",
    rating: 5,
    time: "2 weeks ago",
    avatarBg: "bg-emerald-600",
    initial: "A",
    isLocalGuide: true,
    text: "Been purchasing bulk saree lots from Deepak Textiles for 3 years. Zero defects, excellent colorfast fabrics, and quick transport dispatch from Surat ring road. Highly recommended for all cloth merchants across North India.",
  },
  {
    id: 4,
    name: "Sunita Patel",
    business: "Radhe Ethnic Studio, Ahmedabad",
    rating: 5,
    time: "3 weeks ago",
    avatarBg: "bg-amber-600",
    initial: "S",
    isLocalGuide: false,
    text: "Superb organza, chanderi, and georgette fabric lot quality. Our retail customers loved the prints. Lowest MOQ for wholesale lots is a huge plus for growing boutiques like ours. Will be placing Diwali festive re-orders soon.",
  },
  {
    id: 5,
    name: "Mohammad Faizan",
    business: "Deccan Garments & Sarees, Hyderabad",
    rating: 5,
    time: "1 month ago",
    avatarBg: "bg-indigo-600",
    initial: "M",
    isLocalGuide: true,
    text: "Authentic Surat mill direct rates without any brokerage. Packaging was heavy duty waterproof bale dispatch. Courteous staff and quick tracking updates on WhatsApp. Trustworthy wholesale firm.",
  },
  {
    id: 6,
    name: "Kavita Rathi",
    business: "Rathi Silks, Indore",
    rating: 5,
    time: "1 month ago",
    avatarBg: "bg-teal-600",
    initial: "K",
    isLocalGuide: false,
    text: "Ordered Banarasi and Dola Silk saree catalog lots. Finished pieces with matching unstitched blouse material are exactly as shown in their catalog photos. Excellent wholesale partner.",
  },
];

export const GoogleReviewsSection = () => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -360 : 360;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-white py-10 sm:py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header: Google Overall Score & Verification */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <GoogleLogo className="w-6 h-6" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Google Customer Reviews
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Verified Business
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
                4.9
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  Based on <strong className="text-navy-950 font-bold">1,480+</strong> verified B2B reviews from retailers across India
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons & Carousel Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 hover:border-navy-950 text-xs font-bold text-navy-950 transition-colors"
            >
              <span>Write a Review</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scroll("left")}
                aria-label="Previous Reviews"
                className="w-9 h-9 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center text-gray-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label="Next Reviews"
                className="w-9 h-9 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center text-gray-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Carousel Cards */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pt-8 pb-4 scrollbar-none snap-x snap-mandatory"
        >
          {reviewsData.map((review) => (
            <div
              key={review.id}
              className="w-[85vw] sm:w-[360px] lg:w-[380px] shrink-0 snap-start bg-white rounded-xl border border-gray-200 p-5 sm:p-6 flex flex-col justify-between hover:border-gold-500 transition-colors"
            >
              <div className="space-y-4">
                {/* Reviewer Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${review.avatarBg} text-white flex items-center justify-center font-bold text-sm shrink-0`}
                    >
                      {review.initial}
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-navy-950 leading-tight">
                        {review.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 leading-tight truncate max-w-[200px]">
                        {review.business}
                      </p>
                      {review.isLocalGuide && (
                        <span className="text-[10px] text-amber-700 font-semibold">
                          ★ Local Guide
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Google Icon */}
                  <GoogleLogo className="w-5 h-5 shrink-0" />
                </div>

                {/* Stars and Relative Time */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">{review.time}</span>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-[13px] text-gray-700 leading-relaxed">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>

              {/* Verified Buyer Footer */}
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Surat Mill Direct Buyer</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 mt-4 border-t border-gray-100 text-center">
          <div className="space-y-0.5">
            <span className="text-xl sm:text-2xl font-extrabold text-navy-950">5,000+</span>
            <p className="text-xs text-gray-500">Retailers & Boutiques</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-xl sm:text-2xl font-extrabold text-navy-950">28+ States</span>
            <p className="text-xs text-gray-500">Pan-India Parcel Delivery</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-xl sm:text-2xl font-extrabold text-navy-950">100% Genuine</span>
            <p className="text-xs text-gray-500">GST Mill Invoices</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-xl sm:text-2xl font-extrabold text-navy-950">4.9 / 5.0</span>
            <p className="text-xs text-gray-500">Google Customer Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
};
