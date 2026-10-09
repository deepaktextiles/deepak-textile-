import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: "" },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "read", "replied"],
      default: "new",
      index: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ContactMessage =
  mongoose.models.ContactMessage || mongoose.model("ContactMessage", ContactMessageSchema);
