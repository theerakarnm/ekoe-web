import type { Route } from "./+types/new";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New Coupon - Admin Portal" },
    { name: "description", content: "Create a new discount coupon" },
  ];
}

export default function NewCoupon() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New Coupon</h1>
      <p className="text-gray-600">Coupon form will be implemented in task 11</p>
    </div>
  );
}
