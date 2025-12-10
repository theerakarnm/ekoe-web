import type { Route } from "./+types/home";
import { Landing } from "../landing/landing";
import { getBestSellers, getNewArrivals, type Product } from "~/lib/services/product.service";
import { blogService } from "~/lib/services/blog.service";
import type { BlogPost } from "~/interface/blog.interface";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Ekoe - Natural Skincare Products" },
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
  return <Landing loaderData={loaderData} />;
}
