import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  // Public routes
  index("routes/home.tsx"),
  route("online-executive", "routes/online-executive.tsx"),
  route("shop", "routes/shop.tsx"),
  route("product-detail", "routes/product-detail.tsx"),
  route("set-product-detail", "routes/set-product-detail.tsx"),
  route("cart", "routes/cart.tsx"),
  route("checkout", "routes/checkout.tsx"),

  // Admin routes
  route("admin/login", "routes/admin/login.tsx"),

  // Date Picker Demo
  route("date-picker-demo", "routes/date-picker-demo.tsx"),

  layout("routes/admin/_layout.tsx", [
    route("admin/dashboard", "routes/admin/dashboard.tsx"),

    // Product routes
    route("admin/products", "routes/admin/products/index.tsx"),
    route("admin/products/new", "routes/admin/products/new.tsx"),
    route("admin/products/:id/edit", "routes/admin/products/$id.edit.tsx"),

    // Blog routes
    route("admin/blog", "routes/admin/blog/index.tsx"),
    route("admin/blog/new", "routes/admin/blog/new.tsx"),
    route("admin/blog/:id/edit", "routes/admin/blog/$id.edit.tsx"),

    // Coupon routes
    route("admin/coupons", "routes/admin/coupons/index.tsx"),
    route("admin/coupons/new", "routes/admin/coupons/new.tsx"),
    route("admin/coupons/:id/edit", "routes/admin/coupons/$id.edit.tsx"),
  ]),
] satisfies RouteConfig;
