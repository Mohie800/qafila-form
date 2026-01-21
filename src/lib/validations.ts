import { z } from "zod";

// Form validation messages
const messages = {
  required: "This field is required",
  email: "Please enter a valid email address",
  url: "Please enter a valid URL",
  phone: "Please enter a valid phone number",
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be at most ${max} characters`,
  min: (min: number) => `Must be at least ${min}`,
  max: (max: number) => `Must be at most ${max}`,
};

// Vendor submission schema
export const vendorFormSchema = z.object({
  designerName: z
    .string()
    .min(2, messages.minLength(2))
    .max(100, messages.maxLength(100)),

  email: z.string().email(messages.email),

  city: z
    .string()
    .min(2, messages.minLength(2))
    .max(100, messages.maxLength(100)),

  category: z.string().min(1, messages.required),

  brandName: z
    .string()
    .min(2, messages.minLength(2))
    .max(200, messages.maxLength(200)),

  phoneNumber: z.string().regex(/^[+]?[\d\s-]{8,20}$/, messages.phone),

  storeLink: z.string().url(messages.url).optional().or(z.literal("")),

  brandStory: z
    .string()
    .min(50, messages.minLength(50))
    .max(2000, messages.maxLength(2000)),

  fulfillmentMethod: z.string().min(1, messages.required),

  stockAvailability: z.string().min(1, messages.required),

  branchCount: z.number().min(0, messages.min(0)).max(1000, messages.max(1000)),
});

export type VendorFormData = z.infer<typeof vendorFormSchema>;

// File validation schema (for server-side)
export const fileValidation = {
  logo: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/webp"],
  },
  pdf: {
    maxSize: 20 * 1024 * 1024, // 20MB
    allowedTypes: ["application/pdf"],
  },
};

// Admin login schema
export const adminLoginSchema = z.object({
  username: z
    .string()
    .min(3, messages.minLength(3))
    .max(50, messages.maxLength(50)),

  password: z.string().min(8, messages.minLength(8)),
});

export type AdminLoginData = z.infer<typeof adminLoginSchema>;

// Admin setup schema
export const adminSetupSchema = z
  .object({
    username: z
      .string()
      .min(3, messages.minLength(3))
      .max(50, messages.maxLength(50)),

    password: z
      .string()
      .min(8, messages.minLength(8))
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type AdminSetupData = z.infer<typeof adminSetupSchema>;

// Category options
export const categoryOptions = [
  { value: "fashion", labelEn: "Fashion", labelAr: "أزياء" },
  { value: "jewelry", labelEn: "Jewelry", labelAr: "مجوهرات" },
  { value: "home-decor", labelEn: "Home Decor", labelAr: "ديكور منزلي" },
  { value: "art", labelEn: "Art", labelAr: "فن" },
  { value: "crafts", labelEn: "Crafts", labelAr: "حرف يدوية" },
  { value: "food", labelEn: "Food", labelAr: "أغذية" },
  { value: "beauty", labelEn: "Beauty", labelAr: "جمال" },
  { value: "other", labelEn: "Other", labelAr: "أخرى" },
];

// Fulfillment method options
export const fulfillmentOptions = [
  { value: "self", labelEn: "Self-fulfillment", labelAr: "تنفيذ ذاتي" },
  { value: "qafila", labelEn: "Qafila fulfillment", labelAr: "تنفيذ قافلة" },
  { value: "hybrid", labelEn: "Hybrid", labelAr: "مختلط" },
];

// Stock availability options
export const stockOptions = [
  { value: "in-stock", labelEn: "In stock", labelAr: "متوفر" },
  { value: "made-to-order", labelEn: "Made to order", labelAr: "حسب الطلب" },
  { value: "pre-order", labelEn: "Pre-order", labelAr: "طلب مسبق" },
  { value: "limited", labelEn: "Limited stock", labelAr: "مخزون محدود" },
];
