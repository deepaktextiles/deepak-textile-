import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        product: z.string().min(1, "Product ID required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        variant: z
          .object({
            size: z.string().optional(),
            color: z.string().optional(),
          })
          .optional(),
      })
    )
    .min(1, "Order must contain at least one item"),
  shippingAddress: z.object({
    name: z.string().min(2, "Contact name is required"),
    companyName: z.string().min(2, "Company name is required"),
    phone: z.string().min(10, "Phone number is required"),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    pincode: z.string().min(5, "Pincode is required"),
    GSTNumber: z.string().optional(),
  }),
  billingAddress: z.any().optional(),
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  orderStatus: z.string().optional(),
  paymentStatus: z.string().optional(),
  internalNotes: z.string().optional(),
});
