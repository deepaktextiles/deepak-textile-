import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  sku: z.string().min(2, "SKU is required"),
  description: z.string().min(5, "Description is required"),
  shortDescription: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  price: z.number().min(0, "Price must be positive"),
  wholesalePrice: z.number().min(0, "Wholesale price must be positive"),
  minimumOrderQuantity: z.number().min(1, "MOQ must be at least 1"),
  stock: z.number().min(0, "Stock must be non-negative"),
  unit: z.string().optional().default("pieces"),
  fabric: z.string().min(1, "Fabric is required"),
  color: z.string().min(1, "Color is required"),
  pattern: z.string().optional(),
  size: z.array(z.string()).optional(),
  variants: z.array(z.any()).optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();
