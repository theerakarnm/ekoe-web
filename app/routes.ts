import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("online-executive", "routes/online-executive.tsx"),
  route("shop", "routes/shop.tsx"),
  route("product-detail", "routes/product-detail.tsx"),
] satisfies RouteConfig;
