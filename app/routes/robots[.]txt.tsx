import type { LoaderFunctionArgs } from "react-router";

export const loader = ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const robotText = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /account/
Disallow: /cart
Disallow: /checkout
Disallow: /order-success/
Disallow: /payment/

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(robotText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400", // Cache for 24 hours
    },
  });
};
