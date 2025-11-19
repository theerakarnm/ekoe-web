import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("online-executive", "routes/online-executive.tsx"),
] satisfies RouteConfig;
