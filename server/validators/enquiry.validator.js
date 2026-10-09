import { z } from "zod";

export const createEnquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email address is required"),
  companyName: z.string().min(2, "Company / Business name is required"),
  product: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  message: z.string().optional(),
});

export const updateEnquiryStatusSchema = z.object({
  status: z.enum(["new", "contacted", "quotation_sent", "converted", "closed"]),
  internalNotes: z.string().optional(),
});
