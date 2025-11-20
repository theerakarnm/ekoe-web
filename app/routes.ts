import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("online-executive", "routes/online-executive.tsx"),
  route("shop", "routes/shop.tsx"),
  route("product-detail", "routes/product-detail.tsx"),
  route("set-product-detail", "routes/set-product-detail.tsx"),
  route("cart", "routes/cart.tsx"),
  route("checkout", "routes/checkout.tsx"),
] satisfies RouteConfig;
