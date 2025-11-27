import type { Route } from "./+types/home";
import { Landing } from "../landing/landing";
import { getBestSellers, getNewArrivals, type Product } from "~/lib/services/product.service";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Ekoe - Natural Skincare Products" },
    { name: "description", content: "Discover our collection of natural skincare products" },
  ];
}

export async function loader() {
  try {
    // Fetch best sellers and new arrivals in parallel
    const [bestSellers, newArrivals] = await Promise.all([
      getBestSellers(8),
      getNewArrivals(8)
    ]);

    return {
      bestSellers,
      newArrivals,
      error: null
    };
  } catch (error) {
    console.error('Error loading landing page data:', error);
    // Return empty arrays on error so the page still renders
    return {
      bestSellers: [] as Product[],
      newArrivals: [] as Product[],
      error: error instanceof Error ? error.message : 'Failed to load products'
    };
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Landing loaderData={loaderData} />;
}
