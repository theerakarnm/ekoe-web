import type { LoaderFunctionArgs } from "react-router";
import { getProducts } from "~/lib/services/product.service";
import { blogService } from "~/lib/services/blog.service";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  // 1. Define static routes with priorities
  const staticRoutes = [
    { path: "", priority: "1.0", changefreq: "daily" },
    { path: "/shop", priority: "0.9", changefreq: "daily" },
    { path: "/blogs", priority: "0.8", changefreq: "daily" },
    { path: "/about", priority: "0.7", changefreq: "monthly" },
    { path: "/contact", priority: "0.7", changefreq: "monthly" },
    { path: "/faq", priority: "0.7", changefreq: "weekly" },
    { path: "/return-policy", priority: "0.5", changefreq: "monthly" },
    { path: "/online-executive", priority: "0.6", changefreq: "weekly" },
  ];

  // 2. Fetch dynamic content
  // We need to fetch ALL products and blogs. 
  // API pagination might limit us, so we might need to handle that if the catalog is huge.
  // For now, let's assume a reasonable limit or fetch effectively.
  // Using a large limit for sitemap generation.

  const [productsData, blogsData] = await Promise.all([
    getProducts({ limit: 1000 }), // Fetch up to 1000 products
    blogService.getBlogs({ limit: 1000 }) // Fetch up to 1000 blogs
  ]);

  const products = productsData?.data || [];
  const blogs = blogsData?.data || [];

  // 3. Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes
      .map((route) => {
        return `
  <url>
    <loc>${baseUrl}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
      })
      .join("")}
  ${products
      .map((product) => {
        return `
  <url>
    <loc>${baseUrl}/product-detail/${product.id}</loc>
    <lastmod>${new Date(product.updatedAt || product.createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      })
      .join("")}
  ${blogs
      .map((blog) => {
        return `
  <url>
    <loc>${baseUrl}/blogs/${blog.id}</loc>
    <lastmod>${new Date(blog.updatedAt || blog.createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      })
      .join("")}
</urlset>
`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      "Xml-Version": "1.0",
      "Encoding": "UTF-8"
    },
  });
};
