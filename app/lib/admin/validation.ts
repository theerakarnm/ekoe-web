/**
 * Admin Validation Schemas
 * Zod schemas for validating admin forms and API requests
 */

import { z } from 'zod';

// ============================================================================
// Reusable Field Validators
// ============================================================================

export const slugValidator = z
  .string()
  .min(1, 'Slug is required')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only');

export const urlValidator = z
  .string()
  .url('Must be a valid URL')
  .optional()
  .or(z.literal(''));

export const priceValidator = z
  .number()
  .min(0, 'Price must be positive')
  .int('Price must be in cents (integer)');

export const emailValidator = z
  .string()
  .email('Must be a valid email address');

export const dateValidator = z
  .string()
  .datetime()
  .optional()
  .or(z.date().optional());

// ============================================================================
// Product Schemas
// ============================================================================

export const productVariantSchema = z.object({
  id: z.string().optional(),
  productId: z.string().optional(),
  variantType: z.string().min(1, 'Variant type is required').default('Size'),
  sku: z.string().optional(),
  name: z.string().min(1, 'Variant name is required'),
  value: z.string().min(1, 'Variant value is required'),
  price: priceValidator,
  compareAtPrice: priceValidator.optional(),
  stockQuantity: z.number().int().min(0, 'Stock must be non-negative'),
  lowStockThreshold: z.number().int().min(0),
  isActive: z.boolean(),
});

export const productImageSchema = z.object({
  id: z.string().optional(),
  productId: z.string().optional(),
  url: z.string().url('Must be a valid image URL'),
  altText: z.string().optional(),
  description: z.string().optional(),
  variantId: z.string().optional(),
  sortOrder: z.number().int().min(0),
  isPrimary: z.boolean(),
});

export const productIngredientSchema = z.object({
  keyIngredients: z.array(z.object({
    name: z.string().min(1, 'Ingredient name is required'),
    description: z.string().min(1, 'Ingredient description is required'),
  })).optional(),
  fullList: z.string().optional(),
  image: z.string().optional(),
});

export const productHowToUseSchema = z.object({
  steps: z.array(z.object({
    title: z.string().min(1, 'Step title is required'),
    description: z.string().min(1, 'Step description is required'),
    icon: z.string().optional(),
  })).optional(),
  proTips: z.array(z.string().min(1, 'Pro tip cannot be empty')).optional(),
  note: z.string().optional(),
});

export const productComplimentaryGiftSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  value: z.string().optional(),
});

export const realUserReviewsSchema = z.object({
  image: z.string().optional(),
  content: z.string().optional(),
});

export const productSetItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1).default(1),
});

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255, 'Name too long'),
  slug: slugValidator,
  subtitle: z.string().max(500, 'Subtitle too long').optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),

  // Pricing
  basePrice: priceValidator,
  compareAtPrice: priceValidator.optional(),

  // Product type
  productType: z.enum(['single', 'set', 'bundle']),

  // Status
  status: z.enum(['draft', 'active', 'archived']),
  featured: z.boolean(),
  trackInventory: z.boolean(),

  // SEO
  metaTitle: z.string().max(255, 'Meta title too long').optional(),
  metaDescription: z.string().max(500, 'Meta description too long').optional(),

  // Inventory tracking

  // Relations (optional for creation)
  images: z.array(productImageSchema).optional(),
  variants: z.array(productVariantSchema).optional(),
  categoryIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),

  // New fields
  ingredients: productIngredientSchema.optional(),

  // Set items and Benefits
  setItems: z.array(productSetItemSchema).optional(),
  benefits: z.array(z.string()).optional(),

  goodFor: z.string().optional(),
  whyItWorks: z.string().optional(),
  howToUse: productHowToUseSchema.optional(),
  complimentaryGift: productComplimentaryGiftSchema.optional(),
  realUserReviews: realUserReviewsSchema.optional(),
}).refine(
  (data) => {
    // If compareAtPrice is provided, it should be greater than basePrice
    if (data.compareAtPrice && data.compareAtPrice <= data.basePrice) {
      return false;
    }
    return true;
  },
  {
    message: 'Compare at price must be greater than base price',
    path: ['compareAtPrice'],
  }
);

export type ProductFormData = z.infer<typeof productSchema>;
export type ProductVariantFormData = z.infer<typeof productVariantSchema>;
export type ProductImageFormData = z.infer<typeof productImageSchema>;

// ============================================================================
// Blog Post Schemas
// ============================================================================

// Content block metadata (shared by all blocks)
const blockMetadataSchema = z.object({
  id: z.string(),
  anchorId: z.string().optional(),
});

// Text block
const textBlockSchema = blockMetadataSchema.extend({
  type: z.literal('text'),
  content: z.string(),
});

// Image block
const imageBlockSchema = blockMetadataSchema.extend({
  type: z.literal('image'),
  url: z.string(),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

// Product block
const productBlockSchema = blockMetadataSchema.extend({
  type: z.literal('product'),
  productId: z.string(),
  productName: z.string(),
  productSlug: z.string(),
  productPrice: z.number(),
  productImage: z.string().optional(),
});

// Heading block (used for table of contents)
const headingBlockSchema = blockMetadataSchema.extend({
  type: z.literal('heading'),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  content: z.string(),
});

// Quote block
const quoteBlockSchema = blockMetadataSchema.extend({
  type: z.literal('quote'),
  content: z.string(),
  author: z.string().optional(),
});

// Union of all block types
export const contentBlockSchema = z.discriminatedUnion('type', [
  textBlockSchema,
  imageBlockSchema,
  productBlockSchema,
  headingBlockSchema,
  quoteBlockSchema,
]);

export type ContentBlock = z.infer<typeof contentBlockSchema>;

export const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500, 'Title too long'),
  subtitle: z.string().max(500, 'Subtitle too long').optional(),
  slug: slugValidator,
  excerpt: z.string().max(1000, 'Excerpt too long').optional(),
  content: z.string().optional(), // Legacy field, kept for backward compatibility
  contentBlocks: z.array(contentBlockSchema).optional(),

  // Featured image
  featuredImageUrl: urlValidator,
  featuredImageAlt: z.string().max(255, 'Alt text too long').optional(),

  // Author
  authorId: z.string().optional(),
  authorName: z.string().max(255, 'Author name too long').optional(),

  // Category
  categoryId: z.string().optional(),
  categoryName: z.string().max(100, 'Category name too long').optional(),

  // SEO
  metaTitle: z.string().max(255, 'Meta title too long').optional(),
  metaDescription: z.string().max(500, 'Meta description too long').optional(),

  // Status
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
}).refine(
  (data) => {
    // If status is published, ensure either content or contentBlocks is present
    if (data.status === 'published') {
      const hasContent = data.content && data.content.length > 0;
      const hasBlocks = data.contentBlocks && data.contentBlocks.length > 0;
      return hasContent || hasBlocks;
    }
    return true;
  },
  {
    message: 'Content is required for published posts',
    path: ['contentBlocks'],
  }
);

export type BlogPostFormData = z.infer<typeof blogPostSchema>;

// ============================================================================
// Discount Code Schemas
// ============================================================================

export const discountCodeSchema = z.object({
  code: z
    .string()
    .min(3, 'Code must be at least 3 characters')
    .max(100, 'Code too long')
    .regex(/^[A-Z0-9_-]+$/, 'Code must be uppercase letters, numbers, hyphens, or underscores')
    .transform((val) => val.toUpperCase()),

  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().optional(),

  // Discount type
  discountType: z.enum(['percentage', 'fixed_amount', 'free_shipping']),

  discountValue: z.number().min(0, 'Discount value must be positive'),

  // Conditions
  minPurchaseAmount: priceValidator.optional(),
  maxDiscountAmount: priceValidator.optional(),

  // Usage limits
  usageLimit: z.number().int().min(1, 'Usage limit must be at least 1').optional(),
  usageLimitPerCustomer: z.number().int().min(1, 'Limit per customer must be at least 1').default(1),

  // Applicability
  applicableToProducts: z.array(z.string()).optional(),
  applicableToCategories: z.array(z.string()).optional(),

  // Status
  isActive: z.boolean().default(true),

  // Validity period
  startsAt: dateValidator,
  expiresAt: dateValidator,
}).refine(
  (data) => {
    // Percentage discount should be between 0 and 100
    if (data.discountType === 'percentage' && data.discountValue > 100) {
      return false;
    }
    return true;
  },
  {
    message: 'Percentage discount must be between 0 and 100',
    path: ['discountValue'],
  }
).refine(
  (data) => {
    // Free shipping should have 0 discount value
    if (data.discountType === 'free_shipping' && data.discountValue !== 0) {
      return false;
    }
    return true;
  },
  {
    message: 'Free shipping discount should have 0 value',
    path: ['discountValue'],
  }
).refine(
  (data) => {
    // If both dates are provided, expiresAt should be after startsAt
    if (data.startsAt && data.expiresAt) {
      const start = new Date(data.startsAt);
      const end = new Date(data.expiresAt);
      return end > start;
    }
    return true;
  },
  {
    message: 'Expiry date must be after start date',
    path: ['expiresAt'],
  }
).refine(
  (data) => {
    // If maxDiscountAmount is provided, it should only be for percentage discounts
    if (data.maxDiscountAmount && data.discountType !== 'percentage') {
      return false;
    }
    return true;
  },
  {
    message: 'Max discount amount only applies to percentage discounts',
    path: ['maxDiscountAmount'],
  }
);

export type DiscountCodeFormData = z.infer<typeof discountCodeSchema>;

// ============================================================================
// Category Schema
// ============================================================================

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(255, 'Name too long'),
  slug: slugValidator,
  description: z.string().optional(),
  parentId: z.string().optional(),
  imageUrl: urlValidator,
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  metaTitle: z.string().max(255, 'Meta title too long').optional(),
  metaDescription: z.string().max(500, 'Meta description too long').optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

// ============================================================================
// Tag Schema
// ============================================================================

export const tagSchema = z.object({
  name: z.string().min(1, 'Tag name is required').max(100, 'Name too long'),
  slug: slugValidator,
  description: z.string().optional(),
});

export type TagFormData = z.infer<typeof tagSchema>;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate a slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Format price from cents to dollars
 */
export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2);
}

/**
 * Parse price from dollars to cents
 */
export function parsePrice(dollars: string | number): number {
  const amount = typeof dollars === 'string' ? parseFloat(dollars) : dollars;
  return Math.round(amount * 100);
}

/**
 * Validate and parse form data with a schema
 */
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string[]> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  });

  return { success: false, errors };
}
