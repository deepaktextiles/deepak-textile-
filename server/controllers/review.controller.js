import { Review } from "../models/Review.js";

const DEFAULT_REVIEWS = [
  {
    name: "Rajesh Sharma",
    business: "Jaipur Textile Showroom, Rajasthan",
    rating: 5,
    time: "2 days ago",
    avatarBg: "bg-blue-600",
    isLocalGuide: true,
    text: "Best wholesale mill manufacturer in Surat! We ordered 400 pcs of dress materials and pure silk sarees for our showroom. Quality is top-notch and parcel reached Jaipur in just 3 days with authentic GST invoice. Margins are super healthy.",
    order: 1,
    active: true,
  },
  {
    name: "Pooja Mehta",
    business: "Pooja Designer Boutique, Mumbai",
    rating: 5,
    time: "1 week ago",
    avatarBg: "bg-rose-600",
    isLocalGuide: false,
    text: "Very transparent rates and direct mill pricing without middleman commission. Their WhatsApp video call facility helped me verify the zari border and fabric weave before dispatch. Deepak Textiles is now our regular supply partner.",
    order: 2,
    active: true,
  },
  {
    name: "Anand Verma",
    business: "Verma Cloth Merchants, Kanpur",
    rating: 5,
    time: "2 weeks ago",
    avatarBg: "bg-emerald-600",
    isLocalGuide: true,
    text: "Been purchasing bulk saree lots from Deepak Textiles for 3 years. Zero defects, excellent colorfast fabrics, and quick transport dispatch from Surat ring road. Highly recommended for all cloth merchants across North India.",
    order: 3,
    active: true,
  },
  {
    name: "Sunita Patel",
    business: "Radhe Ethnic Studio, Ahmedabad",
    rating: 5,
    time: "3 weeks ago",
    avatarBg: "bg-amber-600",
    isLocalGuide: false,
    text: "Ordered catalog sets for festive season. All 12 color variants arrived intact with premium retail hanger packaging. Sold out 80% within the first weekend. Reordering another 200 sets today!",
    order: 4,
    active: true,
  },
  {
    name: "Manoj Choudhary",
    business: "Manoj Saree Kendra, Patna, Bihar",
    rating: 5,
    time: "1 month ago",
    avatarBg: "bg-indigo-600",
    isLocalGuide: true,
    text: "Fastest transport delivery to Bihar via Mithila Express transport. Their team coordinates dispatch tracking on WhatsApp until delivery. Genuine Surat wholesale mandi pricing with zero surprises.",
    order: 5,
    active: true,
  },
  {
    name: "Kavita Reddy",
    business: "Reddy Silks & Sarees, Hyderabad",
    rating: 5,
    time: "1 month ago",
    avatarBg: "bg-teal-600",
    isLocalGuide: false,
    text: "South Indian retailers often struggle to get authentic Banarasi and Surat fabrics directly without multiple agents. Deepak Textiles solved that completely. Exceptional silk blends and responsive customer support.",
    order: 6,
    active: true,
  },
];

export const getAllReviews = async (req, res) => {
  try {
    const { activeOnly } = req.query;
    const filter = activeOnly === "true" ? { active: true } : {};

    let reviews = await Review.find(filter).sort({ order: 1, createdAt: -1 });

    if (!reviews || reviews.length === 0) {
      await Review.insertMany(DEFAULT_REVIEWS);
      reviews = await Review.find(filter).sort({ order: 1, createdAt: -1 });
    }

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { name, business, rating, time, text, isLocalGuide, avatarBg, active, order } = req.body;

    if (!name || !text) {
      return res.status(400).json({
        success: false,
        message: "Customer Name and Review Text are required.",
      });
    }

    const review = await Review.create({
      name: name.trim(),
      business: business ? business.trim() : "Retail Textile Merchant",
      rating: Number(rating) || 5,
      time: time ? time.trim() : "Verified Buyer",
      text: text.trim(),
      isLocalGuide: Boolean(isLocalGuide),
      avatarBg: avatarBg || "bg-[#C00000]",
      active: active !== undefined ? Boolean(active) : true,
      order: Number(order) || 0,
    });

    res.status(201).json({
      success: true,
      message: "Customer review created successfully.",
      review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.status(200).json({
      success: true,
      message: "Customer review updated successfully.",
      review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
