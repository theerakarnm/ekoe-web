import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Coupons - Admin Portal" },
    { name: "description", content: "Manage discount coupons" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  // Coupon list data will be loaded in later tasks
  return { coupons: [], total: 0 };
}

export default function CouponList() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Discount Coupons</h1>
      <p className="text-gray-600">Coupon list will be implemented in task 10</p>
    </div>
  );
}
