// ============================================================================
// Content Block Types
// ============================================================================

export interface ContentBlockMetadata {
  id: string;
  anchorId?: string;
}

export interface TextBlock extends ContentBlockMetadata {
  type: 'text';
  content: string;
}

export interface ImageBlock extends ContentBlockMetadata {
  type: 'image';
  url: string;
  alt?: string;
  caption?: string;
}

export interface ProductBlock extends ContentBlockMetadata {
  type: 'product';
  productId: string;
  productName: string;
  productSlug: string;
  productPrice: number;
  productImage?: string;
}

export interface HeadingBlock extends ContentBlockMetadata {
  type: 'heading';
  level: 1 | 2 | 3;
  content: string;
}

export interface QuoteBlock extends ContentBlockMetadata {
  type: 'quote';
  content: string;
  author?: string;
}

export type ContentBlock =
  | TextBlock
  | ImageBlock
  | ProductBlock
  | HeadingBlock
  | QuoteBlock;

// ============================================================================
// Table of Contents
// ============================================================================

export interface TableOfContentsItem {
  id: string;
  level: number;
  text: string;
}

// ============================================================================
// Blog Post Types
// ============================================================================

export interface BlogPost {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  excerpt?: string;
  content?: string; // Legacy
  contentBlocks?: ContentBlock[];
  tableOfContents?: TableOfContentsItem[];
  featuredImageUrl?: string;
  featuredImageAlt?: string; // Note: Frontend usually uses 'image' but backend might send 'featuredImageUrl'. Need to check mapping or adjust.
  // The backend interface says featuredImageUrl, but the old frontend interface had 'image'.
  // I will support both or standardise on the backend one. 
  // Let's stick to the backend response structure for now.
  authorId?: string;
  authorName?: string;
  categoryId?: string;
  categoryName?: string;
  metaTitle?: string;
  metaDescription?: string;
  status: 'draft' | 'published' | 'archived';
  viewCount?: number;
  sortOrder?: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

