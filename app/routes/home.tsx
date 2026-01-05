import type { Route } from "./+types/home";
import { Landing } from "../landing/landing";
import { getBestSellers, getNewArrivals, type Product } from "~/lib/services/product.service";
import { blogService } from "~/lib/services/blog.service";
import type { BlogPost } from "~/interface/blog.interface";
import { getSiteSettings, type SiteSettings } from "~/lib/services/site-settings.service";
import {
  generateSEOMeta,
  generateOrganizationSchema,
  generateWebsiteSchema,
  JsonLd
} from "~/lib/seo";

export function meta({ }: Route.MetaArgs) {
  return generateSEOMeta({
    title: "Ekoe | Biological Beauty For Living Skin",
    description: "แบรนด์สกินแคร์พรีเมียมสัญชาติไทย เน้นความงามที่เป็นธรรมชาติ ผลิตภัณฑ์คุณภาพสำหรับผิวที่มีชีวิต",
    pathname: "/",
    ogType: "website",
    keywords: ["สกินแคร์ไทย", "premium skincare", "Ekoe", "biological beauty", "skincare 2026"],
  });
}

export async function loader() {
  try {
    // Fetch best sellers, new arrivals, blogs, and site settings in parallel
    const [bestSellers, newArrivals, blogsResponse, siteSettings] = await Promise.all([
      getBestSellers(8),
      getNewArrivals(8),
      blogService.getBlogs({ limit: 3, sortOrder: 'desc' }),
      getSiteSettings().catch(() => null), // Fail silently, use defaults
    ]);

    return {
      bestSellers,
      newArrivals,
      blogs: blogsResponse.data,
      siteSettings,
      error: null
    };
  } catch (error) {
    console.error('Error loading landing page data:', error);
    // Return empty arrays on error so the page still renders
    return {
      bestSellers: [] as Product[],
      newArrivals: [] as Product[],
      blogs: [] as BlogPost[],
      siteSettings: null as SiteSettings | null,
      error: error instanceof Error ? error.message : 'Failed to load products'
    };
  }
}


export default function Home({ loaderData }: Route.ComponentProps) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <Landing loaderData={loaderData} />
    </>
  );
}

