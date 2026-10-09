import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    companyName: { type: String, required: true, trim: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
    quantity: { type: Number, required: true, min: 1 },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "quotation_sent", "converted", "closed"],
      default: "new",
      index: true,
    },
    internalNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Enquiry = mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);
