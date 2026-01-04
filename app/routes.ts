import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [

  // Customer auth routes
  route("auth/login", "routes/auth/login.tsx"),


  layout("layouts/_layout.customer.tsx", [
    // Public routes
    index("routes/home.tsx"),
    route("blogs", "routes/blogs/index.tsx"),
    route("blogs/:id", "routes/blogs/$id.tsx"),
    route("online-executive", "routes/online-executive.tsx"),
    route("shop", "routes/shop.tsx"),
    route("product-detail/:id", "routes/product-detail.tsx"),
    route("set-product-detail", "routes/set-product-detail.tsx"),
    route("cart", "routes/cart.tsx"),
    route("checkout", "routes/checkout.tsx"),
    route("about", "routes/about.tsx"),
    route("contact", "routes/contact.tsx"),
    route("return-policy", "routes/return-policy.tsx"),
    route("faq", "routes/faq.tsx"),

    // Payment routes
    route("payment/2c2p/return", "routes/payment/2c2p/return.tsx"),
    route("payment/promptpay/:id", "routes/payment/promptpay/$id.tsx"),

    // Order
    route("order-success/:invoiceNo", "routes/order-success/$invoiceNo.tsx"),

    // Customer auth routes
    route("auth/register", "routes/auth/register.tsx"),
    route("auth/verify-email", "routes/auth/verify-email.tsx"),
    route("auth/reset-password", "routes/auth/reset-password.tsx"),
    route("auth/reset-password-confirm", "routes/auth/reset-password-confirm.tsx"),
    route("auth/callback", "routes/auth/callback.tsx"),

    // Customer account
    route("account", "routes/account/index.tsx"),

    // Marketing Campaign public page
    route("campaign/:slug", "routes/campaign.$slug.tsx"),
  ]),

  // Date Picker Demo
  route("date-picker-demo", "routes/date-picker-demo.tsx"),

  // SEO
  route("robots.txt", "routes/robots[.]txt.tsx"),
  route("sitemap.xml", "routes/sitemap[.]xml.tsx"),

  layout("routes/admin/_layout.tsx", [
    route("admin/dashboard", "routes/admin/dashboard.tsx"),

    route("admin/landing-page", "routes/admin/landing-page.tsx"),

    // Product routes
    route("admin/products", "routes/admin/products/index.tsx"),
    route("admin/products/new", "routes/admin/products/new.tsx"),
    route("admin/products/:id", "routes/admin/products/$id.tsx"),

    // Blog routes
    route("admin/blog", "routes/admin/blog/index.tsx"),
    route("admin/blog/new", "routes/admin/blog/new.tsx"),
    route("admin/blog/:id", "routes/admin/blog/$id.tsx"),

    // Coupon routes
    route("admin/coupons", "routes/admin/coupons/index.tsx"),
    route("admin/coupons/new", "routes/admin/coupons/new.tsx"),
    route("admin/coupons/:id", "routes/admin/coupons/$id.tsx"),

    // Order routes
    route("admin/orders", "routes/admin/orders/index.tsx"),
    route("admin/orders/:id", "routes/admin/orders/$id.tsx"),

    // Customer routes
    route("admin/customers", "routes/admin/customers/index.tsx"),
    route("admin/customers/:id", "routes/admin/customers/$id.tsx"),

    // Promotion routes
    route("admin/promotions", "routes/admin/promotions/index.tsx"),
    route("admin/promotions/new", "routes/admin/promotions/new.tsx"),
    route("admin/promotions/:id", "routes/admin/promotions/$id.tsx"),
    route("admin/promotions/:id/analytics", "routes/admin/promotions/$id.analytics.tsx"),
    route("admin/promotions/:id/edit", "routes/admin/promotions/$id.edit.tsx"),

    // Contacts routes
    route("admin/contacts", "routes/admin/contacts/index.tsx"),
    route("admin/contacts/:id", "routes/admin/contacts/$id.tsx"),

    // Marketing Campaigns routes
    route("admin/marketing-campaigns", "routes/admin/marketing-campaigns/index.tsx"),
    route("admin/marketing-campaigns/new", "routes/admin/marketing-campaigns/new.tsx"),
    route("admin/marketing-campaigns/:id", "routes/admin/marketing-campaigns/$id.tsx"),
  ]),
] satisfies RouteConfig;
