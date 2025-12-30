import type { Route } from "./+types/home";
import { Landing } from "../landing/landing";
import { getBestSellers, getNewArrivals, type Product } from "~/lib/services/product.service";
import { blogService } from "~/lib/services/blog.service";
import type { BlogPost } from "~/interface/blog.interface";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Ekoe | Biological Beauty For Living Skin" },
    { name: "description", content: "Discover our collection of natural skincare products" },
  ];
}

export async function loader() {
  try {
    // Fetch best sellers, new arrivals, and blogs in parallel
    const [bestSellers, newArrivals, blogsResponse] = await Promise.all([
      getBestSellers(8),
      getNewArrivals(8),
      blogService.getBlogs({ limit: 3, sortOrder: 'desc' })
    ]);

    return {
      bestSellers,
      newArrivals,
      blogs: blogsResponse.data,
      error: null
    };
  } catch (error) {
    console.error('Error loading landing page data:', error);
    // Return empty arrays on error so the page still renders
    return {
      bestSellers: [] as Product[],
      newArrivals: [] as Product[],
      blogs: [] as BlogPost[],
      error: error instanceof Error ? error.message : 'Failed to load products'
    };
  }
}


export default function Home({ loaderData }: Route.ComponentProps) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ekoe",
    "url": "https://ekoe.com", // Replace with actual production URL if known, or handle dynamically
    "logo": "https://ekoe.com/ekoe-asset/Ekoe_Logo-01.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+66-123-456-789", // Placeholder
      "contactType": "Customer Service"
    },
    "sameAs": [
      "https://www.facebook.com/ekoe",
      "https://www.instagram.com/ekoe"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Landing loaderData={loaderData} />
    </>
  );
}
