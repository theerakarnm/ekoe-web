import type { MetaDescriptor } from "react-router";

/**
 * SEO Configuration for Ekoe
 */
export const SITE_CONFIG = {
  name: "Ekoe",
  tagline: "Biological Beauty For Living Skin",
  domain: "https://ekoe.com",
  defaultOgImage: "https://ekoe.com/favicon.png",
  twitterHandle: "@ekoe_skincare",
  locale: "th_TH",
  twitterCardType: "summary_large_image" as const,
} as const;

/**
 * Generate comprehensive meta tags for SEO
 */
interface SEOMetaOptions {
  title: string;
  description: string;
  pathname?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
  noIndex?: boolean;
  product?: {
    price: number;
    currency: string;
    availability: "in stock" | "out of stock";
  };
}

/**
 * Generate standard SEO meta tags including Open Graph and Twitter Cards
 */
export function generateSEOMeta(options: SEOMetaOptions): MetaDescriptor[] {
  const {
    title,
    description,
    pathname = "",
    ogImage = SITE_CONFIG.defaultOgImage,
    ogType = "website",
    publishedTime,
    modifiedTime,
    author,
    keywords,
    noIndex = false,
    product,
  } = options;

  const fullTitle = title.includes(SITE_CONFIG.name)
    ? title
    : `${title} | ${SITE_CONFIG.name}`;

  const canonicalUrl = `${SITE_CONFIG.domain}${pathname}`;

  const meta: MetaDescriptor[] = [
    // Basic Meta
    { title: fullTitle },
    { name: "description", content: description },

    // Canonical URL
    { tagName: "link", rel: "canonical", href: canonicalUrl },

    // Open Graph
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:url", content: canonicalUrl },
    { property: "og:type", content: ogType },
    { property: "og:image", content: ogImage },
    { property: "og:image:alt", content: title },
    { property: "og:site_name", content: SITE_CONFIG.name },
    { property: "og:locale", content: SITE_CONFIG.locale },

    // Twitter Card
    { name: "twitter:card", content: SITE_CONFIG.twitterCardType },
    { name: "twitter:site", content: SITE_CONFIG.twitterHandle },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ];

  // Add keywords if provided
  if (keywords && keywords.length > 0) {
    meta.push({ name: "keywords", content: keywords.join(", ") });
  }

  // Add noindex if specified
  if (noIndex) {
    meta.push({ name: "robots", content: "noindex, nofollow" });
  }

  // Add article-specific meta for blog posts
  if (ogType === "article") {
    if (publishedTime) {
      meta.push({ property: "article:published_time", content: publishedTime });
    }
    if (modifiedTime) {
      meta.push({ property: "article:modified_time", content: modifiedTime });
    }
    if (author) {
      meta.push({ property: "article:author", content: author });
    }
  }

  // Add product-specific meta
  if (product) {
    meta.push(
      { property: "product:price:amount", content: String(product.price) },
      { property: "product:price:currency", content: product.currency },
      { property: "og:availability", content: product.availability }
    );
  }

  return meta;
}

/**
 * Generate JSON-LD structured data for Organization
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_CONFIG.domain}/#organization`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.domain,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_CONFIG.domain}/favicon.png`,
      width: 300,
      height: 300,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+66-XXX-XXX-XXXX",
      contactType: "Customer Service",
      availableLanguage: ["Thai", "English"],
    },
    sameAs: [
      "https://www.facebook.com/ekoebotanics",
      "https://www.instagram.com/ekoebeauty",
      "https://www.tiktok.com/@ekoebeauty",
      "https://line.me/R/ti/p/@ekoe",
    ],
  };
}

/**
 * Generate JSON-LD structured data for WebSite with SearchAction
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.domain}/#website`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.domain,
    description: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
    publisher: {
      "@id": `${SITE_CONFIG.domain}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.domain}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate JSON-LD structured data for BreadcrumbList
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.domain}${item.path}`,
    })),
  };
}

/**
 * Generate JSON-LD structured data for FAQ Page
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate JSON-LD structured data for Article (Blog Post)
 */
interface ArticleSchemaOptions {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedTime: string;
  modifiedTime?: string;
  author?: string;
}

export function generateArticleSchema(options: ArticleSchemaOptions) {
  const {
    title,
    description,
    url,
    imageUrl,
    publishedTime,
    modifiedTime,
    author = SITE_CONFIG.name,
  } = options;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    url: `${SITE_CONFIG.domain}${url}`,
    image: imageUrl || SITE_CONFIG.defaultOgImage,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      "@type": "Organization",
      name: author,
      url: SITE_CONFIG.domain,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.domain}/favicon.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.domain}${url}`,
    },
  };
}

/**
 * Generate JSON-LD structured data for Product
 */
interface ProductSchemaOptions {
  name: string;
  description: string;
  url: string;
  images: string[];
  sku: string;
  price: number;
  currency?: string;
  availability: "InStock" | "OutOfStock" | "PreOrder";
  rating?: number;
  reviewCount?: number;
}

export function generateProductSchema(options: ProductSchemaOptions) {
  const {
    name,
    description,
    url,
    images,
    sku,
    price,
    currency = "THB",
    availability,
    rating,
    reviewCount,
  } = options;

  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: images,
    sku,
    brand: {
      "@type": "Brand",
      name: SITE_CONFIG.name,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_CONFIG.domain}${url}`,
      priceCurrency: currency,
      price: price,
      availability: `https://schema.org/${availability}`,
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: SITE_CONFIG.name,
      },
    },
  };

  // Add aggregate rating if available
  if (rating && reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount: reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

/**
 * Utility to inject JSON-LD script tag
 */
export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
